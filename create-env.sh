#!/bin/bash

# Create .env file with Firebase configuration
cat > .env << EOF
VITE_FIREBASE_API_KEY=AIzaSyC2XKFnozpBi2WNLjqBpNVD1go9tjG1ads
VITE_FIREBASE_AUTH_DOMAIN=shifter-ca239.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shifter-ca239
VITE_FIREBASE_STORAGE_BUCKET=shifter-ca239.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1841660965
VITE_FIREBASE_APP_ID=1:1841660965:web:0d8a3701e1c14420786bcc
VITE_FIREBASE_MEASUREMENT_ID=G-9YZSH1DBHX
EOF

echo ".env file created successfully!"
echo "You can now run: npm run dev"


