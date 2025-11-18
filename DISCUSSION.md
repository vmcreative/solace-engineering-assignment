# DISCUSSION.md

## Overview

This document is a quick walkthrough of how I approached the Solace Candidate Assignment — what the brief asked for, what I built, why I made certain decisions, and what I’d do next if this were a real feature inside Solace. My goal was to deliver something clear, reliable, and pleasant to use without drifting into unnecessary engineering gymnastics.

---

## 1. Initial Brief

The core requirements were intentionally light:

- Render a list of advocates  
- Add filtering + sorting  
- (Optional) Plug in a Postgres database  
- Keep things user-friendly  

The starter project returned a static array, and database integration was optional. I supported **both** to keep the project flexible and realistic.

---

## 2. Technical Approach

### API

I expanded `/api/advocates` into a full query endpoint:

- Search (partial + exact match)
- Name modes (first, last, or both)
- City, degree, and specialty filters
- Min years of experience
- Sorting + pagination

The API automatically detects whether Postgres is available. If not, it falls back to the mock dataset but uses the **same filtering/sorting logic** for consistent behavior.

### Client

On the frontend:

- Initial fetch on mount  
- Debounced refetches when filters change  
- Controlled inputs that maintain focus  
- Only the table body updates when data changes  
- Stable `_id` generated via a SHA-256 hash  

This keeps the UI responsive and prevents unnecessary redraws.

---

## 3. Progressive Enhancements

While not required, I added quality-of-life upgrades:

- Debounced queries for smooth typing  
- Dropdowns with outside-click + ESC close  
- Auto-collapsing specialties with fade + “More/Less”  
- “No results” empty state  
- One-time fade-in animation  
- Memoized FilterBar to protect input focus  
- Optional full Postgres support with GIN indexing  

These refinements make the UI feel stable and thoughtful without overshooting the scope.

---

## 4. Design Philosophy

### Keep the UX calm

Filters shouldn’t fight the user. Search shouldn’t lose focus. The table shouldn’t jump around. Everything should feel obvious.

### Be explicit and readable

I added clear comments describing:

- Debounce behavior  
- Fallback logic  
- Shared server/client filtering  

A reviewer should be able to open any file and immediately understand what’s happening.

### Stay aligned with Solace’s visual tone

The Tailwind setup uses soft greens, opals, and golds, serif display type, rounded corners, and subtle shadows — enough to feel intentional without overpowering the assignment.

### Progressive enhancement over magic

Works without a DB.  
Works better with one.  
Nothing breaks either way.

---

## 5. Time Limitations & Tradeoffs

A few intentionally deferred areas:

- Server-side pagination UI  
- Advanced fuzzy search  
- Sticky interactions / column resizing  
- Global state management (not needed here)  
- Overly complex animations or libraries  

The goal was clarity and polish, not heavy architecture.

---

## 6. Potential Next Steps

### Backend

- Fuzzy name search (Levenshtein/metaphone)  
- Caching for expensive queries  
- Advocate detail endpoint  

### Frontend

- Persist filter state in URL  
- Table virtualization for large datasets  
- Saved searches / quick filters  
- Improved specialty taxonomy UI  

### Tooling

- Unit tests for filter logic  
- Integration tests for the API  
- Storybook for isolated component development  

---

## Closing Notes

I built this to feel like a real feature that could live in the Solace codebase: reliable, readable, visually cohesive, and user-focused. The optional enhancements were less about “doing more” and more about demonstrating how I think about UX, structure, and maintainability.