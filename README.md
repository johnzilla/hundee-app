# Hundee 🎯

A beautiful goal tracker app where users complete "100 of anything" - from pushups to pages read, sketches to songs learned.

## Features

- **Simple Goal Creation**: Create goals with the format "100 of [X]"
- **Visual Progress Tracking**: See your progress with both a progress bar and 100-block grid
- **Social Sharing**: Generate beautiful share cards when you complete goals
- **Hundee Wall**: Public feed of goals from the community (in-progress and completed)
- **Profile Visibility**: Toggle to control whether your goals appear on the Hundee Wall
- **Clean Design**: Modern, responsive UI built with shadcn/ui and TailwindCSS
- **Privacy-First**: No tracking, no ads, just pure goal tracking
- **Transactional Sign-up**: User accounts and profiles are created atomically
- **Email Verification & Password Reset**: Users confirm their email and can request password resets

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify (with @netlify/plugin-nextjs)
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
   - Run the SQL files in order:
     1. `supabase/migrations/20250705210620_dusty_torch.sql` (initial schema)
     2. `supabase/migrations/20250708120000_add_is_public_to_profiles.sql` (profile visibility)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

### Password Reset & Email Verification

- Use the `/api/password-reset` route to request a password reset email.
- The `PasswordReset` component handles both sending reset requests and updating passwords after following the emailed link.
- Users can resend confirmation emails through the `ResendVerification` component.

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
3. **Deploy settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - The `@netlify/plugin-nextjs` plugin handles API routes as serverless functions
4. **Deploy** - Netlify will automatically build and deploy your app

### Supabase Configuration

1. **Authentication Settings**:
   - Enable email/password authentication
   - Enable email confirmation
   - Configure SMTP (we use [Resend](https://resend.com) with `smtp.resend.com:465`)
   - Set your site URL and redirect URLs in authentication settings

2. **Database Policies**:
   - All necessary RLS policies are created by the migration scripts
   - Users can only access their own data
   - Public goals are viewable by everyone
   - Profile creation trigger auto-creates profiles on user signup

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - enables CAPTCHA verification on sign-up
HCAPTCHA_SECRET=your_hcaptcha_secret_key
NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_hcaptcha_site_key
```

The application checks for required variables at startup and will throw a descriptive error if any are missing.

The sign-up API route is rate limited to 5 requests per minute per IP and will perform hCaptcha verification when `HCAPTCHA_SECRET` is set. You must also set `NEXT_PUBLIC_HCAPTCHA_SITEKEY` to render the client widget.

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
- Created by [Enduro Tech Ventures LLC](https://www.endurotechventures.com)

---

**Start your journey to 100 today!** 🚀
