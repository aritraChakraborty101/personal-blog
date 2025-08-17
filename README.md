# Aritra's Personal Blog 📝

A modern, full-stack personal blog built with React, TypeScript, and Supabase. Features a clean design with admin capabilities for content management and a public interface for readers.

🌐 **Live Demo**: [https://aritrachakraborty101.github.io/personal-blog/](https://aritrachakraborty101.github.io/personal-blog/)

## ✨ Features

### 🌍 Public Features
- **Clean Blog Interface**: Modern, responsive design for optimal reading experience
- **Category Filtering**: Browse posts by technology, tutorials, projects, and more
- **Post Interactions**: Like posts and leave comments (requires account)
- **SEO Friendly**: Optimized URLs with slug-based routing
- **Mobile Responsive**: Seamless experience across all devices

### 🔐 User Features
- **Authentication**: Secure sign-up and login with Supabase Auth
- **Role-based Access**: Three-tier system (Anonymous, User, Admin)
- **Comment System**: Engage with posts through comments
- **User Dashboard**: Personalized dashboard for logged-in users

### ⚡ Admin Features
- **Content Management**: Create, edit, and manage blog posts
- **Rich Post Editor**: Full-featured editor with categories and featured images
- **Draft System**: Save drafts and publish when ready
- **Analytics**: Track post views and engagement
- **Category Management**: Organize content with dynamic categories

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing with hash router for GitHub Pages

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & user management
  - File storage

### Hosting & Deployment
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated CI/CD pipeline

## 📊 Database Schema

The application uses a comprehensive database schema:

```sql
-- Users (handled by Supabase Auth)
-- profiles: User roles and metadata
-- posts: Blog posts with status, slugs, and metadata
-- categories: Post categorization
-- post_categories: Many-to-many relationship
-- comments: User comments with approval system
-- post_likes: Like tracking
-- post_views: Analytics and view tracking
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Authentication/     # Auth components
│   ├── admin/             # Admin-only components
│   ├── pages/             # Page components
│   ├── Navbar.tsx         # Dashboard navigation
│   ├── PublicNavbar.tsx   # Public site navigation
│   ├── Sidebar.tsx        # Admin sidebar
│   └── Footer.tsx         # Site footer
├── layout/
│   ├── MainLayout.tsx     # Authenticated layout
│   └── PublicLayout.tsx   # Public site layout
├── hooks/
│   ├── useAuthSession.ts  # Authentication hook
│   └── useUserRole.ts     # Role management hook
├── context/               # React context providers
└── App.tsx               # Main application component
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/aritraChakraborty101/personal-blog.git
cd personal-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL scripts in your Supabase SQL editor:
- Create tables (posts, categories, comments, etc.)
- Set up Row Level Security policies
- Create database views for optimized queries

### 5. Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```

## 🚀 Deployment

The project is configured for GitHub Pages deployment:

1. **Automated Deployment**: Push to `main` branch triggers GitHub Actions
2. **Hash Routing**: Uses HashRouter for GitHub Pages compatibility
3. **Base URL**: Configured for `/personal-blog/` path

## 🎨 Customization

### Styling
- Built with Tailwind CSS for easy customization
- Consistent color scheme using gray/neutral tones
- Responsive design with mobile-first approach

### Content Management
- Admin interface for easy content creation
- Category system for post organization
- Rich text editing capabilities

### Features to Add
- [ ] Search functionality
- [ ] RSS feed
- [ ] Newsletter subscription
- [ ] Social media sharing
- [ ] Dark mode toggle
- [ ] Comment moderation dashboard

## 🤝 Contributing

This is a personal blog project, but suggestions and feedback are welcome! Feel free to:

1. Open an issue for bugs or feature requests
2. Submit pull requests for improvements
3. Share feedback on the user experience

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Aritra Chakraborty**
- Email: [aritra.chakraborty@g.bracu.ac.bd](mailto:aritra.chakraborty@g.bracu.ac.bd)
- LinkedIn: [linkedin.com/in/aritra-chakraborty-555715228](https://linkedin.com/in/aritra-chakraborty-555715228)
- GitHub: [@aritraChakraborty101](https://github.com/aritraChakraborty101)

---

⭐ **Star this repository if you found it helpful!**

*Built with ❤️ by Aritra Chakraborty*
