# 🗄️ Schema Bază de Date Firebase - Reddit Clone

## 📋 Structura Colecțiilor Firestore

### **1. Colecția `users`**
Stochează informațiile utilizatorilor autentificați.

```javascript
{
  // Document ID: auto-generated (Firebase Auth UID)
  username: "string",           // Numele de utilizator unic
  email: "string",              // Email-ul utilizatorului
  displayName: "string",        // Numele afișat (opțional)
  karma: 0,                     // Karma totală (upvotes - downvotes)
  postKarma: 0,                 // Karma din postări
  commentKarma: 0,              // Karma din comentarii
  createdAt: "timestamp",       // Data înregistrării
  lastLoginAt: "timestamp",     // Ultima autentificare
  isVerified: false,            // Email verificat
  avatar: "string",             // URL către avatar (opțional)
  bio: "string",                // Biografie utilizator (opțional)
  website: "string"             // Website personal (opțional)
}
```

### **2. Colecția `posts`**
Stochează toate postările din aplicație.

```javascript
{
  // Document ID: auto-generated
  title: "string",              // Titlul postării
  content: "string",            // Conținutul postării (text sau URL)
  type: "text|link|image",      // Tipul postării
  authorId: "string",           // UID-ul autorului (referință la users)
  authorUsername: "string",     // Username-ul autorului (cached)
  communityId: "string",        // ID-ul comunității
  communityName: "string",      // Numele comunității (cached)
  upvotes: 0,                   // Număr upvotes
  downvotes: 0,                 // Număr downvotes
  score: 0,                     // Score calculat (upvotes - downvotes)
  commentCount: 0,              // Număr comentarii
  createdAt: "timestamp",       // Data creării
  updatedAt: "timestamp",       // Data ultimei modificări
  isDeleted: false,             // Dacă postarea e ștearsă
  isLocked: false,              // Dacă discuția e închisă
  tags: ["string"],             // Tag-uri (opțional)
  imageUrl: "string",           // URL imagine (pentru postări image)
  thumbnailUrl: "string"        // URL thumbnail
}
```

### **3. Colecția `comments`**
Stochează toate comentariile.

```javascript
{
  // Document ID: auto-generated
  postId: "string",             // ID-ul postării părinte
  authorId: "string",           // UID-ul autorului
  authorUsername: "string",     // Username-ul autorului (cached)
  content: "string",            // Conținutul comentariului
  parentId: "string|null",      // ID-ul comentariului părinte (pentru replies)
  upvotes: 0,                   // Număr upvotes
  downvotes: 0,                 // Număr downvotes
  score: 0,                     // Score calculat
  depth: 0,                     // Nivelul de adâncime în thread
  createdAt: "timestamp",       // Data creării
  updatedAt: "timestamp",       // Data modificării
  isDeleted: false,             // Dacă e șters
  edited: false                 // Dacă a fost editat
}
```

### **4. Colecția `communities`**
Stochează informațiile comunităților (subreddits).

```javascript
{
  // Document ID: auto-generated (sau name-ul comunității)
  name: "string",               // Numele comunității (ex: "r/programming")
  displayName: "string",        // Numele afișat
  description: "string",        // Descrierea comunității
  rules: "string",              // Regulile comunității (markdown)
  createdBy: "string",          // UID-ul creatorului
  createdAt: "timestamp",       // Data creării
  memberCount: 0,               // Număr membri
  isPrivate: false,             // Dacă e comunitate privată
  isRestricted: false,          // Dacă e restricted
  moderators: ["string"],       // Array cu UID-urile moderatorilor
  bannerUrl: "string",          // URL banner (opțional)
  iconUrl: "string",            // URL icon (opțional)
  theme: {                      // Tema custom (opțional)
    primaryColor: "string",
    secondaryColor: "string"
  }
}
```

### **5. Colecția `votes`**
Stochează voturile utilizatorilor (pentru a preveni voturi multiple).

```javascript
{
  // Document ID: {userId}_{targetId}_{targetType}
  userId: "string",             // UID-ul utilizatorului care votează
  targetId: "string",           // ID-ul țintei (post/comment)
  targetType: "post|comment",   // Tipul țintei
  voteType: "up|down|none",     // Tipul votului
  createdAt: "timestamp",       // Când a votat prima dată
  updatedAt: "timestamp"        // Când și-a schimbat votul
}
```

### **6. Colecția `userCommunities`**
Stochează membrii comunităților.

```javascript
{
  // Document ID: {userId}_{communityId}
  userId: "string",             // UID-ul utilizatorului
  communityId: "string",        // ID-ul comunității
  joinedAt: "timestamp",        // Când a intrat în comunitate
  role: "member|moderator|admin" // Rolul în comunitate
}
```

## 🔍 Indexes Necesare

Pentru performanță, creează acești indexes în Firebase Console:

1. **posts**: `authorId`, `communityId`, `createdAt` (descending)
2. **comments**: `postId`, `authorId`, `createdAt` (descending)
3. **votes**: `userId`, `targetId`, `targetType`
4. **userCommunities**: `userId`, `communityId`

## 🔒 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users - doar owner-ul poate modifica
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Posts - oricine poate citi, autentificat poate crea/modifica
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        resource.data.authorId == request.auth.uid;
      allow delete: if request.auth != null &&
        resource.data.authorId == request.auth.uid;
    }

    // Comments - similar cu posts
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        resource.data.authorId == request.auth.uid;
      allow delete: if request.auth != null &&
        resource.data.authorId == request.auth.uid;
    }

    // Communities - public read, owner/mod poate modifica
    match /communities/{communityId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         request.auth.uid in resource.data.get('moderators', []));
    }

    // Votes - doar owner-ul poate modifica
    match /votes/{voteId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // User Communities - membership management
    match /userCommunities/{membershipId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Structura Subcolecțiilor (Opțional)

Pentru organizare mai bună, poți folosi subcolecții:

```
posts/{postId}/
  ├── comments/          // Comentariile postării
  │   ├── {commentId}/
  │   └── replies/       // Subcomentarii
  └── votes/             // Voturile postării

communities/{communityId}/
  ├── posts/             // Postările comunității
  ├── members/           // Membrii comunității
  └── settings/          // Setările comunității
```

## 🚀 Migration Script

Pentru migrarea datelor din localStorage la Firebase, poți crea un script care:
1. Citește datele din localStorage
2. Transformă structura pentru Firestore
3. Încarcă datele în colecțiile corespunzătoare
4. Verifică integritatea datelor

Acest schema oferă o bază solidă pentru scalarea aplicației tale Reddit clone!
