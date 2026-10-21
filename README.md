# JobTrack

A full-stack job application tracking dashboard built with Next.js, React, TypeScript, Tailwind CSS, Hasura GraphQL, and PostgreSQL.

## Features

- Add, view, edit, and delete job applications
- Search applications by company, role, and location
- Filter applications by status
- Dashboard KPI cards for application tracking
- Persistent data storage using PostgreSQL through Hasura GraphQL

## Getting Started

### Prerequisites

- Node.js and npm
- A configured Hasura GraphQL endpoint
- A PostgreSQL database connected to Hasura

### Installation

Install the project dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root with your own configuration:

```env
NEXT_PUBLIC_HASURA_URL=your_hasura_graphql_endpoint
HASURA_ADMIN_SECRET=your_hasura_admin_secret
```

Never commit `.env.local` or expose your Hasura admin secret in client-side code.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Hasura GraphQL
- PostgreSQL (Neon)

## Future Improvements

- Improved loading and error states
- Responsive design refinements
- Deployment and live demo