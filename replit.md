# Overview

This is a professional-grade backtesting engine for algorithmic trading strategies with advanced queue-aware market microstructure simulation. The application provides a comprehensive platform for developing, testing, and analyzing trading algorithms with realistic NQ futures market simulation capabilities. It features a sophisticated web interface with multiple specialized tabs for strategy development, market data replay, performance analysis, queue position tracking, latency modeling, and machine learning integration.

## Recent Major Enhancements (August 2025)
- **Queue-Aware Trading Engine**: Complete queue position tracking and realistic order book dynamics
- **NQ Futures Specialization**: Optimized for NQ futures trading in the 23770-23800 price range
- **Interactive Strategy Development**: Real-time code compilation with dynamic parameter modification
- **Advanced Market Simulation**: Realistic order book imbalance calculations and fill probability modeling
- **Comprehensive Risk Management**: Dynamic position limits with queue-aware execution logic

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React using TypeScript and follows a modern component-based architecture. Key decisions include:

- **UI Framework**: Uses shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with a monochrome design theme (black/white/grays) optimized for professional trading environments
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Layout Pattern**: Professional trading interface with fixed layout sections (top bar, left sidebar, main content, right inspector, console log)

## Backend Architecture
The server uses Express.js with WebSocket support for real-time features:

- **API Design**: RESTful endpoints for CRUD operations on strategies, datasets, backtest runs, and trades
- **Real-time Communication**: WebSocket server for live market data simulation and backtest progress updates
- **Data Validation**: Zod schemas shared between client and server for type safety
- **Storage Abstraction**: IStorage interface allowing pluggable storage implementations (currently in-memory with database-ready schema)

## Data Storage Solutions
The application is designed for PostgreSQL with Drizzle ORM:

- **ORM Choice**: Drizzle ORM for type-safe database operations with minimal runtime overhead
- **Schema Design**: Normalized schema with separate tables for strategies, datasets, backtest runs, trades, and market data
- **Migration Strategy**: Drizzle Kit for schema migrations and database evolution
- **Current Implementation**: In-memory storage for development with production-ready PostgreSQL schema

## Key Features Architecture

### Strategy Development
- **Interactive Code Editor**: Monospaced editor with syntax highlighting for JavaScript-based trading strategies
- **Dynamic Parameter Configuration**: Real-time parameter modification with queue threshold controls
- **Real-time Compilation Pipeline**: Live strategy validation and compilation feedback with error display
- **Queue-Aware Logic**: Built-in support for order book imbalance calculations and queue position estimation
- **NQ Futures Templates**: Pre-configured strategies optimized for NQ futures trading (23770-23800 range)

### Market Data Simulation
- **Enhanced MBO (Market By Order) Replay**: Granular order book reconstruction with realistic NQ market dynamics
- **Advanced Queue Position Tracking**: Real-time queue rank estimation with fill probability modeling
- **Dynamic Pricing Simulation**: Live price movement within 23770-23800 NQ range with realistic volume patterns
- **Latency Modeling**: Configurable latency profiles with queue-aware execution delays
- **Market Microstructure**: Order book imbalance calculations and depth-weighted volume analysis

### Performance Analytics
- **Real-time Charting**: Custom canvas-based charting for equity curves and performance metrics
- **Risk Metrics**: Comprehensive calculation of Sharpe ratio, maximum drawdown, hit rates, and profit factors
- **Trade Analysis**: Detailed trade-by-trade breakdown with slippage and queue position data

### WebSocket Integration
- **Live Updates**: Real-time market data streaming and backtest progress updates
- **Bidirectional Communication**: Client can send commands (start/stop backtests) via WebSocket
- **Connection Management**: Automatic reconnection handling and connection state monitoring

## Design Patterns

### Component Organization
- **Atomic Design**: UI components organized from basic atoms (inputs, buttons) to complex organisms (full tabs)
- **Tab-based Architecture**: Main content area uses tab switching pattern for different analysis modes
- **Provider Pattern**: React Context for global state (toast notifications, theming)

### Data Flow
- **Unidirectional Data Flow**: Props down, events up pattern throughout the component hierarchy
- **Server State Caching**: TanStack Query handles caching, background updates, and optimistic updates
- **WebSocket State**: Separate hook (useWebSocket) manages real-time connection state

# External Dependencies

## Core Technologies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **TypeScript**: Type safety throughout the entire stack
- **Node.js/Express**: Backend runtime and web framework
- **Vite**: Modern build tool and development server

## Database & ORM
- **PostgreSQL**: Production database (configured via DATABASE_URL environment variable)
- **Drizzle ORM**: Type-safe database operations and schema management
- **@neondatabase/serverless**: Serverless-optimized PostgreSQL driver

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Consistent icon system
- **Inter & JetBrains Mono**: Professional typography (sans-serif and monospace)

## Real-time Features
- **WebSocket (ws)**: Native WebSocket implementation for real-time communication
- **TanStack Query**: Server state management and caching

## Development Tools
- **Vite Plugins**: Runtime error overlay and development enhancements
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development server

## Trading-Specific Libraries
The application is designed to integrate with financial data providers and trading APIs, though specific integrations are abstracted behind the storage interface for flexibility.