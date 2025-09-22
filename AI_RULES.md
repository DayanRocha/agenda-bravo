# AI Rules for Agenda Bravo Development

## Tech Stack Overview

This app is a Progressive Web App (PWA) for tracking freelance work hours and earnings, built with modern frontend tools for a responsive, offline-capable experience.

- **React 18 with TypeScript**: Core framework for building reusable UI components and managing state; all code must be type-safe.
- **Vite**: Fast build tool and dev server for quick hot-reloading and optimized production builds.
- **Tailwind CSS**: Utility-first CSS framework for styling; integrated with shadcn/ui for consistent design.
- **shadcn/ui**: Pre-built, customizable UI components (e.g., buttons, cards, dialogs) built on Radix UI and Tailwind; ensures accessibility and theming.
- **React Router**: Handles client-side routing; keep all routes defined in src/App.tsx.
- **TanStack Query (React Query)**: Manages server state, caching, and data fetching; use for any API interactions or local data synchronization.
- **Zod + React Hook Form**: Schema-based validation and form handling; required for all user input forms.
- **Lucide React**: Icon library; use for all icons to maintain consistency.
- **Date-fns**: Lightweight date manipulation library; always use with ptBR locale for Brazilian Portuguese formatting.
- **Recharts**: For data visualization charts in reports; keep charts simple and responsive.

## Library Usage Rules

Follow these rules strictly to maintain code consistency, performance, and maintainability. Do not introduce new libraries without explicit approval—stick to the installed stack.

### UI and Styling
- **shadcn/ui**: Use exclusively for all UI components (e.g., Button, Card, Dialog, Select, Calendar). Do not modify shadcn/ui source files; create wrappers if customization is needed. Ensure all components are responsive and accessible.
- **Tailwind CSS**: Apply classes for all layout, spacing, colors, and animations. Use CSS custom properties (e.g., --primary) for theme consistency. Avoid inline styles or custom CSS files unless overriding Tailwind (rarely). Always generate responsive designs with mobile-first approach.
- **Lucide React**: Import and use icons from this library only. Size them appropriately (e.g., h-4 w-4 for small icons) and apply Tailwind classes for color/styling.

### Routing and Navigation
- **React Router**: Define all routes in src/App.tsx. Use ProtectedRoute for authenticated pages. Pages go in src/pages/, components in src/components/. No dynamic routing unless requested.

### Forms and Validation
- **React Hook Form + Zod**: Use for every form (login, registration, data entry). Define Zod schemas for validation. Integrate with shadcn/ui inputs. Handle errors with toast notifications.

### State Management and Data
- **TanStack Query**: For any data fetching, caching, or mutations (e.g., API calls). Use localStorage for offline persistence in this PWA. Wrap the app in QueryClientProvider.
- **React Context**: Use sparingly for global state like auth (AuthContext) or theme. Avoid for local component state—use useState/useReducer.

### Dates and Localization
- **Date-fns**: Handle all date operations (formatting, parsing, manipulation). Always import ptBR locale for Brazilian Portuguese (e.g., format(date, 'PPP', { locale: ptBR })).

### Utilities and Integrations
- **Recharts**: Only for charts in Relatorios.tsx or similar reporting pages. Keep data simple; use ResponsiveContainer for mobile responsiveness.
- **jsPDF**: Use solely for PDF exports in reports. Generate simple, text-based PDFs without complex layouts.
- **Sonner**: For all toast notifications (success, error, info). Integrate via Toaster/Sonner components in App.tsx. Keep messages concise and non-technical.

### PWA and Offline Features
- **Service Worker (built-in)**: Maintain existing service-worker.js for caching and offline support. Do not modify unless enhancing offline sync.
- **LocalStorage**: Persist user data (e.g., registros, auth) for offline use. Sync with TanStack Query when online.

### General Development Rules
- **Components**: Create new files for every component/hook (src/components/ or src/hooks/). Keep files under 100 lines; refactor large ones.
- **No New Dependencies**: Do not add packages without <dyad-add-dependency>. If needed (e.g., for auth/database), suggest Supabase integration first.
- **Error Handling**: Let errors bubble up; use TanStack Query for retries. No excessive try/catch unless requested.
- **Testing and Builds**: Use Vite commands (dev, build). Suggest <dyad-command type="rebuild"> for dependency issues.
- **Code Style**: Follow existing patterns—TypeScript strict, Tailwind classes, no placeholders/TODOs. Keep changes minimal and focused on user requests.

Violating these rules may break the app's PWA features, theming, or performance. Always review imports before changes.