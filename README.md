# Vidinfra CDN Dashboard

A modern, responsive admin dashboard for managing CDN distributions built with Next.js 15, TypeScript, and shadcn/ui.

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Table**: Sortable, filterable, and paginated distributions table
- **Advanced Filtering**:
  - CNAME search with debounced input
  - Status filter (Active, suspend, Provisioning)
  - Date range picker for creation dates
- **Real-time Updates**: URL state management with nuqs
- **Modern UI**: Clean, professional design matching the Figma specifications
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: states and loading indicators
- **Theme**: Dark and Light theme change

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: @tanstack/react-query
- **Table Management**: @tanstack/react-table
- **URL State**: nuqs
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Live Link

[https://vidinfra-dashboard.vercel.app/distributions](https://vidinfra-dashboard.vercel.app/distributions)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Abdur-Shobur/vidinfra-dashboard.git
cd vidinfra-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

```bash
NEXT_PUBLIC_API_BASE_URL=https://api-staging.tenbyte.io/cdn
```

4. Run the development server:

```bash
npm run dev
```

5. Build and run

```bash
npm run build
npm run start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

7. For to typescript check

```
npm run type-check
```
