# simply-recipe-keeper

A mobile-first Progressive Web App (PWA) for saving and organizing your personal recipe collection. Built with React, TypeScript, and Capacitor for cross-platform mobile support.

## Features

- **Add & Manage Recipes** - Store recipes with ingredients, instructions, and metadata
- **Offline Support** - Works without internet via Service Worker (PWA)
- **Mobile-First** - Responsive design optimized for phone usage
- **Local Storage** - Data stored locally on device
- **Dark Mode Ready** - Theme support via shadcn/ui

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- React Hook Form + Zod
- Capacitor (iOS/Android)
- vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
# Install dependencies
bun install
# or: npm install
```

### Development

```bash
# Start development server
bun dev
# or: npm run dev
```

Opens at `http://localhost:5173` by default.

### Build

```bash
# Production build
bun build
# or: npm run build
```

Output in `dist/` directory.

## Scripts Reference

| Command | Description |
|--------|-------------|
| `bun dev` | Start development server |
| `bun build` | Production build |
| `bun build:dev` | Development build |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build locally |
| `bun test` | Run tests |
| `bun test:watch` | Run tests in watch mode |

## Contributing

Contributions are welcome! Please open an issue first to discuss proposed changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.