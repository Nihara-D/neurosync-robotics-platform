# NeuroSync Robotics Platform - Project Manifest

**Project**: NeuroSync Robotics Platform  
**Author**: Nihara Randini (shniharard@gmail.com)  
**License**: CC-BY-NC-4.0  
**Version**: 1.0.0  
**Last Updated**: May 23, 2026

---

## 📁 Directory Structure & File Guide

### Root Documentation Files

```
├── README.md                     [451 lines] Core project documentation
├── CHANGELOG.md                  [242 lines] Version history and roadmap
├── CONTRIBUTING.md               [242 lines] Contribution guidelines
├── INTEGRATION_SUMMARY.md        [376 lines] Integration overview
├── PROJECT_MANIFEST.md           [THIS FILE] Complete file listing
├── LICENSE                       [57 lines]  CC-BY-NC-4.0 legal text
├── ROS2_INTEGRATION.md          Architecture and ROS2 setup guide
├── DEPLOYMENT.md                Deployment instructions for various platforms
└── .gitignore                    Git ignore patterns
```

### Application Code (`app/`)

#### Pages & Layouts
```
app/
├── layout.tsx                    Root layout with metadata
│                               - Updated with proper author attribution
│                               - Removed Vercel Analytics
│                               - Neuromorphic SNN Controller branding
│
├── page.tsx                      Home/landing page [~200 lines]
│                               - Interactive neuromorphic branding
│                               - Feature showcase cards
│                               - Author attribution section
│                               - Footer with contact information
│
├── robots/
│   └── page.tsx                 Fleet overview page
│                               - Robot listing in table and card views
│                               - Quick-access control buttons
│                               - System health summary
│
├── dashboard/
│   ├── page.tsx                 Fleet dashboard
│   │                           - 3 online robots with live stats
│   │                           - Connection quality monitoring
│   │                           - Battery and temperature display
│   │
│   └── [robotId]/
│       └── page.tsx             Individual robot control panel [~215 lines]
│                               - Real-time status indicators
│                               - 6-DOF joint controllers
│                               - Emergency stop button
│                               - Predefined motion library
│                               - Advanced command console
│                               - Real-time telemetry streaming
│
└── api/                         API Routes for backend functionality
    │
    ├── robots/
    │   └── [robotId]/
    │       ├── command/
    │       │   └── route.ts     Command execution endpoint [~213 lines]
    │       │                   - Joint control routing
    │       │                   - Emergency stop handling
    │       │                   - Motion sequence execution
    │       │                   - Raw ROS2 command passthrough
    │       │                   - Error handling and validation
    │       │
    │       └── motions/
    │           └── route.ts     Motion library endpoint [~164 lines]
    │                           - Predefined motion execution
    │                           - Duration control
    │                           - Motion state feedback
    │
    └── ros/
        └── websocket/
            └── route.ts         WebSocket ROS2 bridge [~90 lines]
                               - Real-time connection upgrade
                               - Bidirectional communication
                               - Message routing to controllers
```

### React Components (`components/`)

#### Custom Components
```
components/
│
├── RobotStatus.tsx              [~122 lines] Robot status display
│                               - Connection indicators
│                               - Battery and temperature gauge
│                               - System health metrics
│                               - Real-time updates
│
├── JointController.tsx          [~150 lines] Joint control UI
│                               - Slider input for position
│                               - Numeric input field
│                               - Real-time feedback display
│                               - Send command button
│                               - API integration
│
├── CommandConsole.tsx           [~216 lines] Advanced ROS2 interface
│                               - JSON command input
│                               - Command history
│                               - Real-time feedback
│                               - Format hints and autocomplete
│                               - Available commands list
│
├── PredefinedMotions.tsx        [~139 lines] Motion library UI
│                               - Home Position button
│                               - Ready Position button
│                               - Wave Motion button
│                               - Motion execution state
│                               - Duration display
│
├── theme-provider.tsx           Theme configuration
│                               - Dark/light mode support
│
└── ui/                          shadcn/ui Components (50+ components)
    ├── button.tsx              Button component with variants
    ├── card.tsx                Card layout component
    ├── slider.tsx              Range input slider
    ├── badge.tsx               Status badge component
    ├── input.tsx               Text input field
    ├── table.tsx               Data table component
    ├── tabs.tsx                Tabbed interface
    ├── toast.tsx               Toast notification
    ├── toaster.tsx             Toast container
    ├── dialog.tsx              Modal dialog
    ├── dropdown-menu.tsx       Dropdown menu
    ├── alert.tsx               Alert component
    ├── accordion.tsx           Collapsible accordion
    ├── separator.tsx           Visual separator
    ├── progress.tsx            Progress bar
    ├── skeleton.tsx            Loading skeleton
    ├── spinner.tsx             Loading spinner
    └── [40+ more UI components from Radix UI]
```

### Utilities & Hooks (`lib/`)

```
lib/
│
├── types.ts                     [~99 lines] TypeScript type definitions
│                               - Robot interface definition
│                               - Joint configuration types
│                               - Command payload structures
│                               - Telemetry data types
│                               - API response types
│
├── mock-data.ts                 [~112 lines] Demo robot data
│                               - Manipulator Alpha (6-DOF)
│                               - Mobile Base Beta (2-DOF)
│                               - Dual-Arm Gamma (multi-DOF)
│                               - Realistic telemetry simulation
│
├── store.ts                     [~54 lines] Zustand state management
│                               - Global robot state
│                               - Connection status tracking
│                               - Command queue management
│                               - Telemetry buffering
│
├── useRosConnection.ts          [~189 lines] WebSocket connection hook
│                               - Auto-reconnection logic
│                               - Message batching
│                               - Keepalive heartbeat
│                               - Connection status monitoring
│                               - Real-time state sync
│
└── utils.ts                     Utility functions
                               - Class name merging (cn)
                               - Common helpers
```

### Configuration Files

```
├── package.json                 Project metadata and dependencies
│                               - Updated with author info
│                               - CC-BY-NC-4.0 license
│                               - GitHub repository link
│                               - Proper keywords
│
├── tsconfig.json               TypeScript configuration
├── next.config.mjs             Next.js configuration
├── tailwind.config.ts          Tailwind CSS 4 configuration
├── postcss.config.mjs          PostCSS configuration
├── components.json             shadcn/ui configuration
└── pnpm-lock.yaml             Locked dependencies
```

### Styling

```
styles/
└── globals.css                 Global styles
                               - Tailwind CSS v4 import
                               - Design tokens
                               - CSS variables
                               - Theme configuration
```

### Static Assets

```
public/
├── icon.svg                   Favicon SVG
├── icon-light-32x32.png      Light mode icon
├── icon-dark-32x32.png       Dark mode icon
└── apple-icon.png            Apple touch icon
```

---

## 📊 Code Statistics

### File Counts by Type
- **TypeScript/TSX**: 70+ files
- **Configuration**: 8 files
- **Documentation**: 8 files
- **CSS/Styling**: 2 files
- **Assets**: 4 files
- **Total**: 90+ files

### Lines of Code (Approximate)
- **Frontend Components**: ~2,500 lines
- **API Routes**: ~467 lines
- **Hooks & Utilities**: ~440 lines
- **Documentation**: ~1,500 lines
- **Configuration**: ~200 lines
- **Total**: ~5,100 lines

### Component Breakdown
- **shadcn/ui Components**: 50+
- **Custom Components**: 4
- **Pages**: 5
- **API Routes**: 3

---

## 🔄 Data Flow

### User Interaction Flow
```
User Action (Web UI)
    ↓
React Component (e.g., JointController)
    ↓
State Update (Zustand Store)
    ↓
API Call (/api/robots/[robotId]/command)
    ↓
Command Processing & Validation
    ↓
ROS2 Bridge (WebSocket/HTTP)
    ↓
Robot Hardware Execution
```

### Real-Time Update Flow
```
Robot Hardware
    ↓
ROS2 Node
    ↓
WebSocket/API Response
    ↓
useRosConnection Hook
    ↓
Zustand Store Update
    ↓
React Re-render
    ↓
User Interface Update (Real-time)
```

---

## 🚀 Key Technologies

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **State Management** | Zustand |
| **UI Components** | Radix UI (50+ components) |
| **Visualization** | Recharts |
| **HTTP Client** | Fetch API |
| **WebSocket** | Native Browser WebSocket |
| **Package Manager** | pnpm |
| **Node.js** | 18+ |

---

## 📋 Dependencies Summary

### Production Dependencies
- **Next.js Ecosystem**: next, react, react-dom, next-themes
- **UI Libraries**: @radix-ui/*, lucide-react, shadcn components
- **Form Handling**: react-hook-form, @hookform/resolvers
- **State Management**: zustand
- **Charting**: recharts
- **Styling**: tailwind-merge, clsx, class-variance-authority
- **Authentication**: next-auth
- **Database**: @supabase/supabase-js
- **Validation**: zod
- **Utilities**: date-fns, embla-carousel-react

### Development Dependencies
- **TypeScript**: typescript, @types/node, @types/react
- **Build Tools**: @tailwindcss/postcss, postcss, autoprefixer
- **Linting**: eslint

---

## 📖 Documentation Index

| Document | Purpose | Length |
|----------|---------|--------|
| **README.md** | Main project guide | 451 lines |
| **CHANGELOG.md** | Version history & roadmap | 242 lines |
| **CONTRIBUTING.md** | Contribution guidelines | 242 lines |
| **INTEGRATION_SUMMARY.md** | Integration overview | 376 lines |
| **ROS2_INTEGRATION.md** | ROS2 setup & architecture | ~250 lines |
| **DEPLOYMENT.md** | Deployment instructions | ~340 lines |
| **PROJECT_MANIFEST.md** | This file | ~350 lines |
| **LICENSE** | CC-BY-NC-4.0 text | 57 lines |

**Total Documentation**: ~2,300 lines

---

## ✅ Quality Checklist

- ✓ TypeScript strict mode enabled
- ✓ All components properly typed
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Accessibility features (ARIA labels, semantic HTML)
- ✓ Error handling and validation
- ✓ Real-time updates with mock data
- ✓ API routes with proper error responses
- ✓ WebSocket connection management
- ✓ State management with Zustand
- ✓ Component composition and reusability
- ✓ Code comments and documentation
- ✓ Git history preserved
- ✓ No v0/Vercel branding remaining
- ✓ Author attribution complete
- ✓ CC-BY-NC-4.0 license applied

---

## 🔐 Security Features

- ✓ Input validation on all API endpoints
- ✓ Error handling without exposing stack traces
- ✓ CORS-ready API design
- ✓ Type-safe command routing
- ✓ Mock data prevents accidental hardware commands
- ✓ Authentication framework ready (next-auth configured)
- ✓ Environment variables support (.env.local)

---

## 🚦 Next Steps for Deployment

1. **Configure Environment**
   - Create `.env.local` with ROS2 bridge settings
   - Set up database credentials (Supabase)
   - Configure authentication

2. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

3. **Connect to Real Robots**
   - Configure ROS2 bridge host/port
   - Set `USE_MOCK_DATA=false`
   - Ensure ROS2 nodes are running

4. **Deploy**
   - Vercel: `vercel`
   - Docker: See DEPLOYMENT.md
   - Self-hosted: See DEPLOYMENT.md

---

## 📞 Contact & Support

**Author**: Nihara Randini  
**Email**: shniharard@gmail.com  
**GitHub**: [@Nihara-D](https://github.com/Nihara-D)  
**Repository**: https://github.com/Nihara-D/neuromorphic-snn-controller-research-env

---

**Generated**: May 23, 2026  
**Version**: 1.0.0  
**License**: CC-BY-NC-4.0
