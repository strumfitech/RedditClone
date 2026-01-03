// Script pentru popularea bazei de date Firebase cu date de test
// Rulează: node src/scripts/populateFirebase.js

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

const sampleData = {
  communities: [
    {
      name: "r/announcements",
      displayName: "Announcements",
      description: "Official announcements and updates",
      rules: "Be respectful and follow community guidelines",
      memberCount: 1250,
      isPrivate: false,
      isRestricted: false,
      bannerUrl: null,
      iconUrl: null
    },
    {
      name: "r/programming",
      displayName: "Programming",
      description: "Discussion about programming and computer science",
      rules: "Be civil and on-topic",
      memberCount: 5420,
      isPrivate: false,
      isRestricted: false,
      bannerUrl: null,
      iconUrl: null
    },
    {
      name: "r/funny",
      displayName: "Funny",
      description: "Humor and jokes",
      rules: "Keep it clean and funny",
      memberCount: 8930,
      isPrivate: false,
      isRestricted: false,
      bannerUrl: null,
      iconUrl: null
    },
    {
      name: "r/technology",
      displayName: "Technology",
      description: "Technology news and discussion",
      rules: "Stay on topic and be respectful",
      memberCount: 3210,
      isPrivate: false,
      isRestricted: false,
      bannerUrl: null,
      iconUrl: null
    },
    {
      name: "r/gaming",
      displayName: "Gaming",
      description: "Video games and gaming culture",
      rules: "No spam, be respectful",
      memberCount: 6540,
      isPrivate: false,
      isRestricted: false,
      bannerUrl: null,
      iconUrl: null
    }
  ],

  posts: [
    {
      title: "Welcome to Reddit Clone!",
      content: "This is a fully functional Reddit clone built with React, HTML, CSS, and Bootstrap. Feel free to explore all features!",
      type: "text",
      communityId: "announcements", // Va fi înlocuit cu ID-ul real
      communityName: "r/announcements",
      upvotes: 42,
      downvotes: 2,
      score: 40,
      commentCount: 0,
      isDeleted: false,
      isLocked: false,
      tags: ["welcome", "announcement"]
    },
    {
      title: "Check out this amazing React tutorial!",
      content: "https://react.dev",
      type: "link",
      communityId: "programming", // Va fi înlocuit cu ID-ul real
      communityName: "r/programming",
      upvotes: 156,
      downvotes: 12,
      score: 144,
      commentCount: 0,
      isDeleted: false,
      isLocked: false,
      tags: ["react", "tutorial", "javascript"]
    },
    {
      title: "Why I love programming",
      content: "Programming is not just a job for me, it's a passion. The feeling of solving complex problems and creating something from nothing is incredibly rewarding. What about you?",
      type: "text",
      communityId: "programming", // Va fi înlocuit cu ID-ul real
      communityName: "r/programming",
      upvotes: 89,
      downvotes: 5,
      score: 84,
      commentCount: 0,
      isDeleted: false,
      isLocked: false,
      tags: ["programming", "career", "discussion"]
    },
    {
      title: "Best gaming setup 2024",
      content: "Just upgraded my gaming setup! RTX 4080, i9-13900K, 32GB RAM, and a 4K monitor. Games look incredible! What's your setup like?",
      type: "text",
      communityId: "gaming", // Va fi înlocuit cu ID-ul real
      communityName: "r/gaming",
      upvotes: 234,
      downvotes: 18,
      score: 216,
      commentCount: 0,
      isDeleted: false,
      isLocked: false,
      tags: ["gaming", "hardware", "setup"]
    },
    {
      title: "AI is changing everything",
      content: "From ChatGPT to GitHub Copilot, AI is revolutionizing how we work. What's your experience with AI tools in development?",
      type: "text",
      communityId: "technology", // Va fi înlocuit cu ID-ul real
      communityName: "r/technology",
      upvotes: 167,
      downvotes: 23,
      score: 144,
      commentCount: 0,
      isDeleted: false,
      isLocked: false,
      tags: ["ai", "technology", "future"]
    }
  ]
};

async function populateFirebase() {
  try {
    console.log('🚀 Începerea populării bazei de date Firebase...');

    // 1. Adaugă comunitățile
    console.log('📝 Adaug comunitățile...');
    const communityRefs = {};

    for (const community of sampleData.communities) {
      const communityData = {
        ...community,
        createdBy: 'admin', // UID admin - va trebui să fie înlocuit
        moderators: ['admin'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'communities'), communityData);
      communityRefs[community.name.replace('r/', '')] = docRef.id;
      console.log(`✅ Adăugat comunitatea: ${community.name} (ID: ${docRef.id})`);
    }

    // 2. Adaugă postările
    console.log('📝 Adaug postările...');
    const postRefs = [];

    for (const post of sampleData.posts) {
      const communityKey = post.communityId;
      const communityId = communityRefs[communityKey];

      if (!communityId) {
        console.warn(`⚠️ Comunitatea ${communityKey} nu a fost găsită, sărind postarea: ${post.title}`);
        continue;
      }

      const postData = {
        ...post,
        communityId: communityId,
        authorId: 'admin', // Va trebui să fie înlocuit cu UID-ul real
        authorUsername: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
      postRefs.push(docRef.id);
      console.log(`✅ Adăugat postarea: ${post.title} (ID: ${docRef.id})`);
    }

    // 3. Adaugă comentarii de test (opțional)
    console.log('💬 Adaug comentarii de test...');
    if (postRefs.length > 0) {
      const sampleComments = [
        {
          postId: postRefs[0], // Prima postare
          content: "Welcome! This looks amazing! 🎉",
          authorId: 'admin',
          authorUsername: 'admin',
          parentId: null,
          upvotes: 5,
          downvotes: 0,
          score: 5,
          depth: 0,
          isDeleted: false,
          edited: false
        },
        {
          postId: postRefs[1], // A doua postare
          content: "React is awesome! Thanks for sharing this tutorial.",
          authorId: 'admin',
          authorUsername: 'admin',
          parentId: null,
          upvotes: 12,
          downvotes: 1,
          score: 11,
          depth: 0,
          isDeleted: false,
          edited: false
        }
      ];

      for (const comment of sampleComments) {
        const commentData = {
          ...comment,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'comments'), commentData);
        console.log(`✅ Adăugat comentariu (ID: ${docRef.id})`);
      }
    }

    console.log('🎉 Popularea bazei de date s-a terminat cu succes!');
    console.log('\n📊 Rezumat:');
    console.log(`   - Comunități adăugate: ${Object.keys(communityRefs).length}`);
    console.log(`   - Postări adăugate: ${postRefs.length}`);
    console.log(`   - Comentarii adăugate: ${postRefs.length > 0 ? 2 : 0}`);

    console.log('\n⚠️ IMPORTANT:');
    console.log('1. Înlocuiește "admin" cu UID-ul real al utilizatorului admin');
    console.log('2. Actualizează karma utilizatorilor dacă e necesar');
    console.log('3. Verifică datele în Firebase Console');

  } catch (error) {
    console.error('❌ Eroare la popularea bazei de date:', error);
    process.exit(1);
  }
}

// Rulează script-ul doar dacă este executat direct
if (import.meta.url === `file://${process.argv[1]}`) {
  populateFirebase();
}

export { populateFirebase };
