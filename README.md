# ScentTwin

A mobile-first perfume recommendation PWA built with Angular and Supabase.

## Overview

ScentTwin is a modern, privacy-first perfume discovery app that:
- Uses optional selfie analysis (client-side processing only)
- Collects preferences via engaging lifestyle quiz
- Recommends perfumes using intelligent cohort-based scoring
- Gamifies reveal mechanics with micro-tasks
- Links to external research (Fragrantica)
- Implements ethical freemium monetization
- Prioritizes user privacy (no raw images stored)

## Technology Stack

- **Frontend**: Angular 18+ (standalone components)
- **Backend**: Supabase (Postgres, Auth, Edge Functions, Storage)
- **Styling**: Angular Material + Custom CSS (mobile-first)
- **State Management**: Angular Signals
- **PWA**: @angular/pwa with service workers

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Build

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Environment Setup

1. Create a Supabase project at https://supabase.com
2. Copy `src/environments/environment.ts.example` to `src/environments/environment.ts`
3. Add your Supabase URL and anon key

## Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, guards, models
│   ├── shared/         # Reusable components, pipes, directives
│   ├── features/       # Feature modules (lazy-loaded)
│   └── app.component.* # Root component
├── assets/             # Images, icons, static files
└── environments/       # Environment configurations
```

## Features

- 🎨 Modern, flashy mobile-first UI
- 🔒 Privacy-first architecture
- 📱 Progressive Web App (installable)
- 🎭 Client-side image processing
- 🎯 Intelligent recommendation engine
- 💎 Gamified unlock mechanics
- 🌙 Dark mode support

## License

Proprietary - All rights reserved
