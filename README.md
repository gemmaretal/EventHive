# EventHive

EventHive is a Next.js 14 application for organizing and participating in event group buying.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI v6
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gemmaretal/EventHive.git
cd EventHive
```

2. Install dependencies:

```bash
yarn install
```

3. Copy the environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

### Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint to check code quality
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn test` - Run Jest tests
- `yarn test:watch` - Run tests in watch mode
- `yarn typecheck` - Run TypeScript type checking
- `yarn migrate` - Run database migrations (placeholder)
- `yarn seed` - Seed the database (placeholder)

### Testing

Run the test suite:

```bash
yarn test
```

Run tests in watch mode during development:

```bash
yarn test:watch
```

### Building for Production

Build the application:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## Project Structure

```
EventHive/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with MUI theme
│   ├── page.tsx           # Homepage
│   └── __tests__/         # Page tests
├── src/                   # Source files
│   └── theme.ts           # MUI theme configuration
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI workflow
├── .husky/                # Git hooks
├── .env.example           # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── jest.config.js         # Jest configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL database connection string
- `NEXTAUTH_URL` - Application URL for NextAuth
- `NEXTAUTH_SECRET` - Secret key for NextAuth sessions
- `NEXT_PUBLIC_SITE_NAME` - Public site name
- `RECOMMENDATION_WEIGHTS` - JSON configuration for recommendation engine

## Git Hooks

This project uses Husky to run pre-commit hooks:

- Linting and formatting are automatically run on staged files before each commit
- This ensures code quality and consistency across the codebase

## CI/CD

GitHub Actions workflow runs on every push and pull request:

1. ESLint checks
2. TypeScript type checking
3. Jest tests
4. Production build

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `yarn test`
4. Ensure linting passes: `yarn lint`
5. Ensure type checking passes: `yarn typecheck`
6. Commit your changes (pre-commit hooks will run automatically)
7. Push your branch and create a pull request

## License

MIT
