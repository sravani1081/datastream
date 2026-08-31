# DataStream — Production-Grade Data Streaming & Pipeline Platform

> Stream. Transform. Understand.

DataStream is a local-first enterprise data streaming, visual DAG pipeline orchestration, schema registry, data quality, and ML feature platform built for processing real-time and batch workloads entirely in the browser.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation
Clone or extract the repository and install dependencies:

```bash
npm install
```

### Development Server
Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the DataStream platform.

---

## 🏗️ Production Build & Verification

### Production Build
Compile the production Next.js application:

```bash
npm run build
```

### Run Unit & Integration Tests
Execute the Vitest test suite:

```bash
npm test
```

### Automated Compliance Verification Gate
Run the 100% compliance verification scanner:

```bash
npm run compliance
```

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS (Enterprise Dark Theme design system)
- **State & Storage**: LocalStorage, IndexedDB, In-Memory State
- **Testing**: Vitest (`vitest run`)
- **Icons**: Lucide React (`lucide-react`)
- **Utility**: `clsx`, `tailwind-merge`, `uuid`

---

## 🎯 Primary Features

1. **Dashboard & Metrics Console**: Real-time throughput (events/sec), processing latency (P95/P99), active pipeline statuses, data volume, error rates, and compliance scores.
2. **Visual DAG Pipeline Builder**: Drag-and-drop visual canvas supporting 20+ node types (`Source`, `Stream`, `Filter`, `Map`, `Transform`, `Join`, `Aggregate`, `Window`, `Deduplicate`, `Sort`, `Sample`, `Validate`, `Enrich`, `Split`, `Merge`, `Feature`, `Quality Check`, `Output`).
3. **Streaming Simulator & Windowing**: Pub/Sub topic partition simulator, consumer group lag tracker, tumbling/sliding/session windows, event-time watermarks, allowed lateness router, and backpressure rate simulator.
4. **Data Quality & Schema Evolution**: Schema registry with backward/forward compatibility detector, 30+ quality validation rules, quarantined rejected records inspector, and Data Contract SLAs.
5. **Interactive Lineage & Impact Analysis**: End-to-end dataset and column-level lineage graph with transitive impact analysis for field changes.
6. **Game Telemetry & Controlled AST SQL**: Deterministic seed generator for game telemetry (players, sessions, matches, economy transactions), AST SQL query engine (`SELECT`, `WHERE`, `ORDER BY`, `LIMIT`), and 80/20 train/test ML dataset builder.
7. **Observability & Cost Estimator**: Searchable log explorer (TRACE, DEBUG, INFO, WARN, ERROR), alert rules engine, synthetic cloud cost estimator, security audit trail, and team task kanban.

---

## 🔒 Security & Local-First Guarantees

- **100% Credential-Free**: Requires zero API keys (No OpenAI, AWS, Supabase, Azure, or Redis credentials required).
- **Zero `.env` Files**: Operates without environment secrets or runtime credentials.
- **Local State**: All data streams, DAG executions, and datasets execute locally within the browser engine.
