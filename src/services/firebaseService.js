import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';

// ==========================================
// AUTENTIFICARE
// ==========================================

export const firebaseAuth = {
  // Înregistrare utilizator nou
  async register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizează display name
      await updateProfile(user, { displayName: username });

      // Creează document în colecția users
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        username: username,
        email: email,
        karma: 0,
        postKarma: 0,
        commentKarma: 0,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isVerified: false
      });

      return { success: true, user: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login utilizator
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizează lastLoginAt
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
      if (!userDoc.empty) {
        const userRef = doc(db, 'users', userDoc.docs[0].id);
        await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
      }

      return { success: true, user: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listener pentru schimbări auth state
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};

// ==========================================
// UTILIZATORI
// ==========================================

export const userService = {
  // Obține date utilizator după UID
  async getUserByUid(uid) {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return { success: true, user: { id: querySnapshot.docs[0].id, ...userData } };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obține date utilizator după username
  async getUserByUsername(username) {
    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return { success: true, user: { id: querySnapshot.docs[0].id, ...userData } };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Actualizează karma utilizator
  async updateKarma(userId, karmaChange) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentKarma = userSnap.data().karma || 0;
        await updateDoc(userRef, {
          karma: currentKarma + karmaChange,
          updatedAt: serverTimestamp()
        });
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ==========================================
// POSTĂRI
// ==========================================

export const postService = {
  // Obține toate postările
  async getPosts(options = {}) {
    try {
      const { communityId, authorId, limit: limitCount = 50 } = options;

      let q = collection(db, 'posts');

      if (communityId) {
        q = query(q, where('communityId', '==', communityId));
      }

      if (authorId) {
        q = query(q, where('authorId', '==', authorId));
      }

      q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));

      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obține postare după ID
  async getPostById(postId) {
    try {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        return {
          success: true,
          post: {
            id: docSnap.id,
            ...postData,
            createdAt: postData.createdAt?.toDate?.() || new Date(postData.createdAt)
          }
        };
      }
      return { success: false, error: 'Post not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Creează postare nouă
  async createPost(postData, user) {
    try {
      const newPost = {
        ...postData,
        authorId: user.uid,
        authorUsername: user.displayName || user.email,
        upvotes: 1,
        downvotes: 0,
        score: 1,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);

      // Actualizează karma autorului
      await userService.updateKarma(user.uid, 1);

      return { success: true, postId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Actualizează voturile postării
  async updatePostVotes(postId, upvotes, downvotes) {
    try {
      const postRef = doc(db, 'posts', postId);
      const score = upvotes - downvotes;

      await updateDoc(postRef, {
        upvotes,
        downvotes,
        score,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Șterge postare
  async deletePost(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists() && postSnap.data().authorId === userId) {
        await updateDoc(postRef, {
          isDeleted: true,
          updatedAt: serverTimestamp()
        });
        return { success: true };
      }
      return { success: false, error: 'Unauthorized or post not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ==========================================
// COMENTARII
// ==========================================

export const commentService = {
  // Obține comentariile unei postări
  async getCommentsByPostId(postId) {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));

      return { success: true, comments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Adaugă comentariu nou
  async addComment(postId, content, user, parentId = null) {
    try {
      const newComment = {
        postId,
        content,
        authorId: user.uid,
        authorUsername: user.displayName || user.email,
        parentId,
        upvotes: 1,
        downvotes: 0,
        score: 1,
        depth: parentId ? 1 : 0, // Simplificat, în realitate ar trebui calculat
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        edited: false
      };

      const docRef = await addDoc(collection(db, 'comments'), newComment);

      // Actualizează numărul de comentarii în postare
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentCount = postSnap.data().commentCount || 0;
        await updateDoc(postRef, { commentCount: currentCount + 1 });
      }

      // Actualizează karma autorului
      await userService.updateKarma(user.uid, 1);

      return { success: true, commentId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Actualizează voturile comentariului
  async updateCommentVotes(commentId, upvotes, downvotes) {
    try {
      const commentRef = doc(db, 'comments', commentId);
      const score = upvotes - downvotes;

      await updateDoc(commentRef, {
        upvotes,
        downvotes,
        score,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ==========================================
// COMUNITĂȚI
// ==========================================

export const communityService = {
  // Obține toate comunitățile
  async getCommunities() {
    try {
      const q = query(collection(db, 'communities'), orderBy('memberCount', 'desc'));
      const querySnapshot = await getDocs(q);

      const communities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));

      return { success: true, communities };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Obține comunitate după ID
  async getCommunityById(communityId) {
    try {
      const docRef = doc(db, 'communities', communityId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const communityData = docSnap.data();
        return {
          success: true,
          community: {
            id: docSnap.id,
            ...communityData,
            createdAt: communityData.createdAt?.toDate?.() || new Date(communityData.createdAt)
          }
        };
      }
      return { success: false, error: 'Community not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Creează comunitate nouă
  async createCommunity(communityData, user) {
    try {
      const newCommunity = {
        ...communityData,
        createdBy: user.uid,
        moderators: [user.uid],
        memberCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'communities'), newCommunity);

      // Adaugă creatorul ca membru
      await addDoc(collection(db, 'userCommunities'), {
        userId: user.uid,
        communityId: docRef.id,
        joinedAt: serverTimestamp(),
        role: 'admin'
      });

      return { success: true, communityId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ==========================================
// VOTURI
// ==========================================

export const voteService = {
  // Obține votul unui utilizator pentru un target
  async getUserVote(userId, targetId, targetType) {
    try {
      const voteId = `${userId}_${targetId}_${targetType}`;
      const voteRef = doc(db, 'votes', voteId);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        return { success: true, vote: voteSnap.data() };
      }
      return { success: true, vote: null }; // Nu există vot
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Adaugă/actualizează vot
  async setVote(userId, targetId, targetType, voteType) {
    try {
      const voteId = `${userId}_${targetId}_${targetType}`;
      const voteRef = doc(db, 'votes', voteId);

      const voteData = {
        userId,
        targetId,
        targetType,
        voteType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Verifică dacă votul există deja
      const existingVote = await getDoc(voteRef);

      if (existingVote.exists()) {
        // Actualizează votul existent
        await updateDoc(voteRef, voteData);
      } else {
        // Creează vot nou
        await setDoc(voteRef, voteData);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Șterge vot
  async removeVote(userId, targetId, targetType) {
    try {
      const voteId = `${userId}_${targetId}_${targetType}`;
      const voteRef = doc(db, 'votes', voteId);

      await deleteDoc(voteRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ==========================================
// UTILS
// ==========================================

export const firebaseUtils = {
  // Listener în timp real pentru postări
  subscribeToPosts(callback, options = {}) {
    const { communityId, limit: limitCount = 50 } = options;

    let q = collection(db, 'posts');

    if (communityId) {
      q = query(q, where('communityId', '==', communityId));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));

    return onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));
      callback(posts);
    });
  },

  // Listener pentru comentarii
  subscribeToComments(postId, callback) {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));
      callback(comments);
    });
  }
};
