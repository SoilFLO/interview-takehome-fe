![SoilFLO Logo](/src/assets/soilflo-logo.svg)

# Frontend Take-Home Project: Dispatch Dashboard

Welcome, and thank you for taking the time to complete this exercise. This project is designed to be completed in approximately **6 hours - 8 hours**. We don't expect perfection - we want to see how you think, structure code, and make tradeoffs under realistic time constraints. You may use AI tools to help you complete this assignment.

---

## Overview

Build a **Dispatch Dashboard** for managing trucks and their loads. The app allows users to view trucks with summary statistics, drill into a truck's load history, and perform full CRUD on both trucks and loads. A mock API is already wired up using [MSW (Mock Service Worker)](https://mswjs.io/) - you won't need to build or run a backend.

---

## Tech Stack

Please use the following - these mirror our production stack:

| Tool                                     | Purpose                               |
| ---------------------------------------- | ------------------------------------- |
| React + TypeScript                       | UI framework                          |
| TanStack Query (`@tanstack/react-query`) | Server state & data fetching          |
| Ant Design (`antd`)                      | UI component library (see note below) |
| Vitest + React Testing Library           | Testing                               |
| MSW                                      | API mocking (already configured)      |

**Note on UI library:** We use Ant Design in production, and it is already installed. If you are more comfortable with a different component library, you are welcome to use that instead - we care more about how you structure and compose UI than which specific library you reach for.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone <repo-url>
cd interview-takehome-fe
npm install
npm run dev
```

To run tests:

```bash
npm run test
```

---

## Designs

We've included some lo-fi designs for guidance and inspiration. You can follow them 1-2-1, or you can make your own design choices. If you decide to make something drastically different, feel free to add your thoughts and reasoning to your `NOTES.md` file.

[Open the PDF](./design-mockups/fe-take-home-assignment-mockups.pdf)

## The Mock API

The MSW handlers are pre-configured in `src/mocks/handlers.ts`. The following endpoints are available:

### Trucks

| Method   | Endpoint          | Description                                                               |
| -------- | ----------------- | ------------------------------------------------------------------------- |
| `GET`    | `/api/trucks`     | Fetch all trucks with summary stats (loadCount, totalWeight, totalVolume) |
| `GET`    | `/api/trucks/:id` | Fetch a single truck with summary stats                                   |
| `POST`   | `/api/trucks`     | Create a new truck                                                        |
| `PATCH`  | `/api/trucks/:id` | Update a truck (partial update)                                           |
| `DELETE` | `/api/trucks/:id` | Delete a truck and all its loads (cascade)                                |

### Loads

| Method   | Endpoint                     | Description                                                       |
| -------- | ---------------------------- | ----------------------------------------------------------------- |
| `GET`    | `/api/trucks/:truckId/loads` | Fetch all loads for a truck. Supports `?direction=import\|export` |
| `GET`    | `/api/loads/:id`             | Fetch a single load                                               |
| `POST`   | `/api/trucks/:truckId/loads` | Create a load for a truck                                         |
| `PATCH`  | `/api/loads/:id`             | Update a load (partial update)                                    |
| `DELETE` | `/api/loads/:id`             | Delete a load                                                     |

### Data Shapes

```ts
interface Truck {
  id: string;
  name: string;
  licensePlate: string;
  createdAt: string; // ISO date string
}

// Returned by GET /api/trucks and GET /api/trucks/:id
interface TruckSummary extends Truck {
  loadCount: number;
  totalWeight: number | null; // null if no loads have weight values
  totalVolume: number | null; // null if no loads have volume values
}

type LoadDirection = 'import' | 'export';

interface Load {
  id: string;
  truckId: string;
  timestamp: string; // ISO date string - when the load was recorded
  direction: LoadDirection;
  weight: number | null; // Weight in tonnes. At least one of weight or volume required.
  volume: number | null; // Volume in m3. At least one of weight or volume required.
}
```

---

## Requirements

### Core Features (Required)

**Truck List**

- Display all trucks in a list or table, showing name and license plate.
- Show summary stats per truck: load count, total weight (tonnes), and total volume (m3). If a truck has no loads with weight or volume values, display `-` rather than `0`.

**Add Truck**

- A form (modal or drawer) with `name` and `licensePlate` fields - both required.
- On success, the truck list should update without a full page reload.

**Edit Truck**

- Allow editing a truck's name and/or license plate.
- Changes should be reflected immediately in the list.

**Delete Truck**

- Delete with a confirmation step.
- Deleting a truck cascades to all its loads - the API handles this automatically.

**Load List**

- Clicking a truck (or a button/link on the row) shows that truck's loads.
- This can be a separate panel, drawer, modal, or a master-detail split - your choice.
- Loads are sorted newest first.
- Show the timestamp, direction (Import / Export), weight, and volume for each load.

**Filter Loads by Direction**

- Allow filtering the load list by direction: All / Import / Export.

**Add Load**

- A form to add a load to the selected truck.
- Required fields: `timestamp`, `direction`.
- At least one of `weight` (tonnes) or `volume` (m3) must be provided - show appropriate validation.

**Edit Load**

- Allow editing any fields on an existing load.
- The same weight/volume validation applies.

**Delete Load**

- Delete a load with a confirmation step.

**Loading & Error States**

- Show meaningful loading indicators while data is being fetched.
- Show a user-friendly error message if a request fails.

---

### Testing (Required)

Write tests using **Vitest** and **React Testing Library**. Tests should cover meaningful user-facing behaviour - the quantity and coverage is up to you.

---

### Bonus (Optional)

These are not required. If you have time, use this as an opportunity to show us what you care about. Some areas to consider:

- Improving the user experience
- Improving the developer experience
- Improving performance
- Improving the architecture
- Improving the test coverage or test infrastructure
- Improving the overall code quality or maintainability

There are no wrong answers here - we are more interested in the reasoning behind your choices than the choices themselves. If you tackle anything in this section, briefly mention it in your `NOTES.md`.

---

## Project Structure

The starter repo has the following structure. You are free to reorganize it, but please explain any significant structural changes in your `NOTES.md`.

```
src/
  types/
    index.ts          # Truck, Load, and related types (pre-defined)
  mocks/
    handlers.ts       # MSW request handlers (pre-configured - do not modify)
    browser.ts        # MSW browser setup
    server.ts         # MSW Node setup for tests
  __tests__/
    example.test.tsx  # Starter tests + renderWithQueryClient helper
  App.tsx
  main.tsx
  setupTests.ts
```

---

## What We're Looking For

| Area                       | What we evaluate                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React component design** | Are components focused, reusable, and well-composed? Are props typed clearly?                                                                                     |
| **TypeScript**             | Is the code properly typed? Are `any` types avoided? Are types shared and reused well?                                                                            |
| **TanStack Query**         | Are queries and mutations used correctly? Is the cache invalidated/updated appropriately? Are dependent queries (loads depending on selected truck) handled well? |
| **State management**       | Is server state kept in TanStack Query and UI state kept in React? Is state colocated appropriately?                                                              |
| **Testing**                | Are tests meaningful? Do they cover real behaviour? Are they well-structured and readable?                                                                        |
| **UI quality**             | Is the app intuitive and reasonably polished? Are edge cases handled gracefully?                                                                                  |
| **Code quality**           | Is the code readable and consistent?                                                                                                                              |

---

## Submission

1. Push your work to a **private GitHub repository**.
2. Invite `@EdinK1` and `@RadderTim` as a collaborator.
3. Include a brief `NOTES.md` (or update the one in the repo) covering:
   - Any assumptions you made.
   - What you would do differently with more time.
   - Any tradeoffs you made consciously.

Please do **not** submit a public repository.

---

## Questions?

If anything is unclear, please don't hesitate to reach out. We'd rather you ask than spend time going down the wrong path.

Good luck - we're looking forward to seeing your work!
