# Next.js Food Delivery App

A modern food delivery application built with Next.js 15, featuring real-time restaurant search, order management, and a seamless checkout experience.

## 🚀 Features

- **Authentication** - Secure user authentication with NextAuth
- **Restaurant Discovery** - Browse and search restaurants
- **Shopping Cart** - Real-time cart management with Zustand
- **Order Management** - Track and manage orders
- **User Profiles** - Personalized user experiences
- **Responsive Design** - Mobile-first UI with HeroUI components

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (Canary)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Vercel Postgres](https://vercel.com/storage/postgres)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [@heroui/react](https://heroui.com/)
- **Linting:** [Biome](https://biomejs.dev/)

## 🚦 Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file:

```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## 🧱 Project Structure

```
src/
├── app/
│   ├── (main)/        # Main application routes
│   ├── lib/           # Utility functions, hooks, etc.
│   ├── ui/            # UI components
│   └── providers.tsx  # App providers
├── middleware.ts      # NextAuth middleware
└── ...
```

## 🛠️ Development

```bash
# Run development server
npm run dev

# Type checking
npm run tsc

# Linting
npm run lint

# Formatting
npm run format
```

## 🧪 Testing

Playwright smoke tests live in `e2e/`. They start the dev server automatically.

```bash
npx playwright install chromium   # once
npm run test:e2e
```

Without any configuration, only the logged-out tests run (redirects, home page, search, restaurant page). Optional environment variables, which can also go in a gitignored `.env.e2e.local` file that the Playwright config loads automatically:

| Variable | Effect |
|---|---|
| `E2E_EMAIL`, `E2E_PASSWORD` | Run the logged-in tests. Use a dedicated test account |
| `E2E_ALLOW_WRITES=1` | Also run the checkout test, which **creates a real order** |
| `E2E_BASE_URL` | Test a deployment (e.g. a Vercel preview) instead of localhost |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Needed when the preview has Vercel deployment protection |

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeroUI Documentation](https://heroui.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
