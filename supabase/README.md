# Supabase Database Schema for Polling Application

This directory contains the SQL schema for the Supabase database used in the Alx-Polly polling application.

## Schema Overview

The database schema consists of the following tables:

1. **profiles** - Extends Supabase Auth with additional user information
2. **polls** - Stores poll information including title, description, and settings
3. **poll_options** - Stores the options for each poll
4. **votes** - Records votes cast by users or anonymous visitors

## Entity Relationships

- A **user** can create multiple **polls**
- A **poll** has multiple **poll_options**
- A **user** can cast **votes** on **poll_options**
- Anonymous users can also cast **votes** if the poll allows it

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in
2. Create a new project
3. Note your project URL and anon key for configuration

### 2. Run the Schema SQL

There are two ways to set up the database schema:

#### Option 1: Using the Supabase Dashboard

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `schema.sql` from this directory
3. Paste into a new SQL query and run it

#### Option 2: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Push the schema:
   ```bash
   supabase db push
   ```

### 3. Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Row Level Security (RLS) Policies

The schema includes RLS policies to ensure data security:

- Users can only view their own profiles
- Anyone can view public polls
- Users can only create, update, and delete their own polls
- Users can vote on public polls
- Users can delete their own votes

## Database Functions

The schema includes a `get_poll_results` function that returns aggregated vote counts for a poll's options.

## TypeScript Types

TypeScript types for the database schema are available in `app/types/database.ts`. These types should be used when interacting with the Supabase client to ensure type safety.