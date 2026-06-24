# React Cognito Hosted UI Editor

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A **modern, fast, and focused AWS Cognito Hosted UI URL editor** built with **React, TypeScript, Vite, and Tailwind CSS**.
It helps developers quickly parse, edit, and generate Cognito OAuth/OIDC authorization URLs.

👉 **Live Demo:** [React Cognito Hosted UI Editor](https://hanoj-budime.github.io/react-cognito-hosted-ui-editor/)

## High-Level Overview

This app is a single-page utility tool for AWS Cognito Hosted UI links.

- Input: paste an existing Hosted UI URL
- Parse: automatically extracts query parameters into form fields
- Edit: update response type, client ID, redirect URI, scopes, and identity provider
- Generate: rebuilds a valid URL with correct encoding
- Output: copy the URL or open it in a new tab

The codebase is structured under `code/` with Vite as the build/dev tool and React + TypeScript for UI and logic.

## Features

- Parse existing Cognito Hosted UI URLs
- Edit OAuth/OIDC parameters in a guided form
- Multi-select scope chips (`openid`, `email`, `phone`, `profile`, `aws.cognito.signin.user.admin`)
- Generate properly encoded URL output
- Copy-to-clipboard with feedback
- Open generated URL in a new tab
- Dark mode toggle
- Mobile-friendly responsive layout

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS + PostCSS
- Vitest (test runner available via scripts)

## Project Structure

```text
react-cognito-hosted-ui-editor/
├─ code/
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  ├─ types.d.ts
│  │  └─ styles/index.css
│  ├─ public/favicon.svg
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.ts
└─ README.md
```

## Getting Started

```bash
cd code
npm install
npm run dev
```

Open: `http://localhost:5173/react-cognito-hosted-ui-editor/`

## Scripts

Run from `code/`:

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run deploy` - Build and publish `dist` using `gh-pages`

## Deployment

This project is configured for GitHub Pages with base path:

- `/react-cognito-hosted-ui-editor/`

If the repository name changes, update the `base` value in `code/vite.config.ts`.
