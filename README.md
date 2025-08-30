# Hundee 🎯

A beautiful goal tracker app where users complete "100 of anything" - from pushups to pages read, sketches to songs learned.

## Features

- **Simple Goal Creation**: Create goals with the format "100 of [X]"
- **Visual Progress Tracking**: See your progress with both a progress bar and 100-block grid
- **Social Sharing**: Generate beautiful share cards when you complete goals
- **Hundee Wall**: Public feed of completed goals from the community
- **Clean Design**: Modern, responsive UI built with shadcn/ui and TailwindCSS
- **Privacy-First**: No tracking, no ads, just pure goal tracking
- **Transactional Sign-up**: User accounts and profiles are created atomically

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hundee.git
   cd hundee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. **Run database migrations**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase/migrations/20250705210620_dusty_torch.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Database Schema

The app uses three main tables:

- **profiles**: User profiles linked to Supabase auth
- **goals**: User goals with progress tracking
- **goal_updates**: History of progress changes

Row Level Security (RLS) is enabled for all tables to ensure data privacy.

## Deployment

### Deploy to Netlify

1. **Connect your GitHub repository** to Netlify
2. **Set environment variables** in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; no `NEXT_PUBLIC_` prefix)
   The sign-up API route requires `SUPABASE_SERVICE_ROLE_KEY`, so keep this key secret on the server.
3. **Deploy settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
4. **Deploy** - Netlify will automatically build and deploy your app

### Supabase Configuration

1. **Authentication Settings**:
   - Enable email/password authentication
   - Disable email confirmation (or configure SMTP)
   - Set your site URL in authentication settings

2. **Database Policies**:
   - All necessary RLS policies are created by the migration script
   - Users can only access their own data
   - Public goals are viewable by everyone

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The application checks for these variables at startup and will throw a descriptive error if any are missing.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy Policy

Hundee is built with privacy in mind:

- **No tracking**: We don't use analytics or tracking cookies
- **No ads**: The app is completely ad-free
- **Minimal data**: We only collect what's necessary for the app to function
- **Your data**: You own your data and can delete it anytime
- **Open source**: The code is open for anyone to inspect

## Contact

- **Email**: hello@endurotech.ventures
- **Website**: [hundee.app](https://hundee.app)
- **GitHub**: [github.com/endurotech/hundee](https://github.com/endurotech/hundee)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and auth by [Supabase](https://supabase.com/)
- Deployed on [Netlify](https://netlify.com/)
- Icons by [Lucide](https://lucide.dev/)
- Created by [Enduro Tech Ventures LLC](https://endurotech.ventures)

---

**Start your journey to 100 today!** 🚀