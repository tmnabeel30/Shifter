# Shifter - Client Portal for Freelancers

A modern, professional client portal application that helps freelancers manage their client relationships, invoices, projects, and file sharing in one beautiful interface.

## 🚀 Features

### 🔐 Authentication & Onboarding
- **Multi-Step Onboarding**: Guided setup process for new users
- **Role-Based Access**: Choose between Client and Admin access types
- **Profile Setup**: Complete user profile with company information
- **Secure Authentication**: Firebase-powered user management

### 👥 Role-Based Access Control
- **Client Access**: Submit project requests, track progress, manage invoices
- **Admin Access**: Manage all projects, clients, and platform settings
- **Freelancer Access**: Manage clients, projects, and invoices (default)

### 📋 Project Management
- **Project Requests**: Clients can submit detailed project requests
- **Request Management**: Admins can review, approve, or reject requests
- **Project Tracking**: Monitor project progress and status
- **File Sharing**: Secure file upload and sharing system

### 💰 Financial Management
- **Invoice Management**: Create and track invoices
- **Payment Tracking**: Monitor payment status and revenue
- **Budget Management**: Track project budgets and expenses

### 📊 Analytics & Reporting
- **Dashboard Analytics**: Real-time business metrics
- **Project Analytics**: Track project performance
- **Financial Reports**: Revenue and payment analytics

### For Freelancers
- **Dashboard**: Overview of clients, invoices, revenue, and recent activity
- **Client Management**: Add, edit, and manage client information with unique portal URLs
- **Invoice Management**: Create, track, and manage invoices with status tracking
- **Project Management**: Track project progress, timelines, and milestones
- **File Sharing**: Upload and share files with clients securely
- **Settings**: Profile management, billing, notifications, and security settings

### For Clients
- **Client Portal**: Password-protected access to project information
- **Invoice Viewing**: View and download invoices with payment status
- **Project Updates**: Track project progress and timelines
- **File Access**: Download shared files and project assets
- **Professional Interface**: Clean, modern design that reflects professionalism

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shifter-client-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Get your Firebase config and update `src/firebase/config.ts`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. Update the Firebase configuration in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📱 Usage

### Getting Started

1. **Sign up/Login**: Create an account or sign in
2. **Complete Onboarding**: Follow the guided setup process
3. **Choose Access Type**: Select Client or Admin role
4. **Set Up Profile**: Complete your profile information
5. **Start Using**: Access role-specific features

### For Clients

1. **Submit Project Requests**: Create detailed project requests with requirements
2. **Track Requests**: Monitor the status of your project requests
3. **Manage Projects**: View approved projects and track progress
4. **Access Files**: Download project files and assets
5. **View Invoices**: Check invoice status and payment information

### For Admins

1. **Review Requests**: Manage incoming project requests
2. **Approve/Reject**: Make decisions on project requests
3. **Manage Projects**: Oversee all projects and clients
4. **Analytics**: Access comprehensive business analytics
5. **Settings**: Configure platform settings and permissions

### For Freelancers

1. **Add Clients**: Go to Clients page and add your client information
2. **Create Invoices**: Generate professional invoices for your clients
3. **Manage Projects**: Track project progress and timelines
4. **Share Files**: Upload and share project files with clients
5. **Share Portal URL**: Send the unique portal URL to your clients

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom CSS classes
- Component-specific styles

### Branding
Update the following files to customize branding:
- `src/components/Sidebar.tsx` - Logo and navigation
- `src/components/Header.tsx` - Header branding
- `index.html` - Page title and meta tags

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 💰 Revenue Model

The application is designed with a $5/month per client portal revenue model:
- Freelancers pay $5/month for each active client portal
- Clients get free access to their dedicated portal
- Scalable pricing based on number of clients

## 🔒 Security Features

- Firebase Authentication for secure user management
- Role-based access control
- Firestore security rules enforce onboarding completion and per-user data ownership
- Secure file uploads and downloads
- Client portal isolation
- HTTPS enforcement

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Payment integration (Stripe)
- [ ] Time tracking
- [ ] Client messaging system
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] White-label solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@shifter.com
- Documentation: [docs.shifter.com](https://docs.shifter.com)

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [React](https://reactjs.org/) for the frontend framework
