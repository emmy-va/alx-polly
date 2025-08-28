# AlxPolly - Modern Polling Application

A full-featured polling application built with Next.js 15, TypeScript, Tailwind CSS, and Prisma. Create, share, and participate in polls with real-time results and beautiful UI.

## ✨ Features

- **User Authentication**: Secure login/signup with email/password and social providers (Google, GitHub)
- **Poll Creation**: Create polls with multiple options, descriptions, and settings
- **Voting System**: Vote on polls with real-time updates
- **Real-time Results**: See results update instantly as people vote
- **Poll Management**: Set end dates, visibility, and multiple vote options
- **Responsive Design**: Beautiful UI that works on all devices
- **Search & Filter**: Find polls easily with search functionality
- **User Profiles**: Track your created polls and voting history

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **UI Components**: Custom component library with Radix UI primitives

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd alx-polly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Optional: Social login providers
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_ID=""
   GITHUB_SECRET=""
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The app uses SQLite by default for development. The database will be created automatically when you run `npx prisma db push`.

### Database Schema

- **Users**: Authentication and profile information
- **Polls**: Poll details, settings, and metadata
- **PollOptions**: Individual options for each poll
- **Votes**: User votes on poll options
- **Sessions**: Authentication sessions

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password**: Traditional registration and login
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account

To enable social login providers, add your OAuth credentials to the environment variables.

## 📱 Usage

### Creating a Poll

1. Sign in to your account
2. Click "Create Poll" button
3. Fill in poll details:
   - Title and description
   - Add poll options (2-10 options)
   - Set end date (optional)
   - Configure visibility and voting settings
4. Click "Create Poll"

### Voting on Polls

1. Browse available polls on the main page
2. Click "Vote" on your preferred option
3. View real-time results
4. See how your vote affects the overall results

### Managing Your Polls

- View all polls you've created
- See voting statistics and results
- Manage poll settings and visibility

## 🎨 Customization

### Styling

The app uses Tailwind CSS with a custom design system. You can customize:

- Color scheme in `tailwind.config.ts`
- Component styles in individual component files
- Global styles in `app/globals.css`

### Components

The UI is built with reusable components in the `components/ui/` directory:

- `Button`: Various button styles and variants
- `Input`: Form input fields with icon support
- `Card`: Content containers with headers and content areas
- `Tabs`: Tabbed interface components

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma db push` - Push database changes
- `npx prisma studio` - Open database browser

### Project Structure

```
alx-polly/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── create-poll/       # Poll creation page
│   ├── polls/             # Polls listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── polls/             # Poll-related components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/alx-polly/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Poll categories and tags
- [ ] Advanced analytics and charts
- [ ] Email notifications
- [ ] Poll sharing and embedding
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced poll types (ranked choice, etc.)

---

Built with ❤️ using Next.js and modern web technologies.
