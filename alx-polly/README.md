# AlxPolly - Modern Polling Application

A full-featured polling application built with Next.js 15, TypeScript, and Tailwind CSS. Create, share, and participate in polls with a beautiful and intuitive interface.

## ✨ Features

- **User Authentication**: Login and registration forms (ready for backend integration)
- **Poll Creation**: Create polls with multiple options, descriptions, and settings
- **Poll Voting**: Interactive voting interface with real-time results visualization
- **Poll Discovery**: Browse and search through available polls
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern UI**: Built with custom UI components for consistent design

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom component library
- **Forms**: React state management (ready for form libraries)

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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
alx-polly/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── create-poll/       # Poll creation page
│   ├── polls/             # Polls listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── layout/            # Layout components
│   │   └── navigation.tsx
│   ├── polls/             # Poll-related components
│   │   ├── poll-card.tsx
│   │   ├── polls-list.tsx
│   │   └── create-poll-form.tsx
│   └── ui/                # UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── tabs.tsx
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🔐 Authentication

The app includes placeholder authentication forms ready for backend integration:

- **Login Form**: Email and password fields
- **Registration Form**: Name, email, password, and confirm password
- **Form Validation**: Ready for validation libraries
- **State Management**: Loading states and form handling

## 📊 Poll Management

### Creating Polls
- Title and description
- Multiple poll options (2-10)
- End date setting
- Visibility controls
- Dynamic option management

### Viewing Polls
- Poll cards with voting interface
- Real-time vote visualization
- Search and filtering
- Responsive grid layout

### Voting System
- Interactive voting buttons
- Progress bars for results
- Vote percentage calculations
- User-friendly interface

## 🎨 UI Components

Built with custom components for consistent design:

- **Button**: Multiple variants and sizes
- **Input**: Form inputs with proper styling
- **Card**: Content containers with headers
- **Tabs**: Tabbed interface for organizing content

## 🚀 Next Steps

To complete the application, you'll need to:

1. **Backend Integration**
   - Set up a database (PostgreSQL, MySQL, or MongoDB)
   - Create API endpoints for authentication
   - Implement poll CRUD operations
   - Add voting functionality

2. **Authentication System**
   - Integrate with NextAuth.js or similar
   - Add social login providers
   - Implement session management

3. **Real-time Features**
   - Add WebSocket support for live voting
   - Implement real-time result updates
   - Add notifications for new polls

4. **Advanced Features**
   - Poll categories and tags
   - User profiles and poll history
   - Poll sharing and embedding
   - Advanced analytics and charts

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create your component in the appropriate directory
2. Import and use the existing UI components
3. Follow the existing naming conventions
4. Add proper TypeScript interfaces

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system defined in `tailwind.config.ts`
- Use CSS variables for consistent theming
- Ensure responsive design for all components

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing code structure
2. Review the component implementations
3. Ensure all dependencies are properly installed
4. Check the browser console for errors

---

Built with ❤️ using Next.js and modern web technologies.
