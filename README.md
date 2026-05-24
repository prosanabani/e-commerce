# Hyper Turbo

> [!NOTE]
> Hyper Turbo is a modern, highly-opinionated monorepo starter template designed for building full-stack web and mobile applications with maximum speed and developer experience.

## Branches and Usage

This repository is designed with a branch-based structure, where different branches provide various starting points depending on your project needs.

- **`main`**: The core monorepo template containing Next.js, Expo, and Tanstack Start apps with shared packages.
- *(More branches will be documented here as they are added, such as `with-supabase`, `with-clerk`, etc.)*

**Each branch has its own specific setup and usage instructions.** Please make sure to check the `README.md` on the specific branch you are using for the most accurate documentation.

## Installation

> [!NOTE]
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

To initialize an app using the `hyper-turbo` starter, you can use this repository as a template.

Click the **Use this template** button on GitHub to create a new repository based on `hyper-turbo`.

Alternatively, clone it directly using Git:

```bash
git clone https://github.com/prosanabani/hyper-turbo.git my-app
cd my-app
pnpm install
```

## About

Hyper Turbo is the perfect starter repo to get you running with a cutting-edge stack in a monorepo setup.

It uses [Turborepo](https://turborepo.com) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  │   ├─ Expo SDK 54
  │   ├─ React Native 0.81 using React 19
  │   ├─ Navigation using Expo Router
  │   ├─ Tailwind CSS v4 using NativeWind v5
  │   └─ Typesafe API calls using tRPC
  ├─ nextjs
  │   ├─ Next.js 15
  │   ├─ React 19
  │   ├─ Tailwind CSS v4
  │   └─ E2E Typesafe API Server & Client
  └─ tanstack-start
      ├─ Tanstack Start v1 (rc)
      ├─ React 19
      ├─ Tailwind CSS v4
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  │   └─ tRPC v11 router definition
  ├─ auth
  │   └─ Authentication using better-auth.
  ├─ db
  │   └─ Typesafe db calls using Drizzle & Supabase
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ tailwind
  │   └─ shared tailwind theme and configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@repo` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@repo` to something like `@my-company` or `@project-name`.

## Quick Start

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 2. Generate Auth Schema

This project uses [Better Auth](https://www.better-auth.com) for authentication.

```bash
# Generate the Better Auth schema
pnpm --filter @repo/auth generate
```

### 3. Start Development

To start all apps and packages in development mode:

```bash
pnpm dev
```

For Expo specific instructions (iOS Simulator or Android Emulator), please see the documentation within the `apps/expo` directory.

### 4. Adding UI components or packages

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

To add a new package, simply run `pnpm turbo gen init` in the monorepo root.

## Architecture & FAQs

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other client apps, should only add the `api` package as a dev dependency for type-safety.

## Deployment

### Web Apps (Next.js & Tanstack Start)

Web apps can be deployed easily to platforms like Vercel. Select the `apps/nextjs` or `apps/tanstack-start` folder as the root directory, set your environment variables, and deploy.

### Mobile App (Expo)

Use EAS (Expo Application Services) to build and deploy your React Native application. Refer to the Expo documentation for a complete guide on building and submitting your app to the App Store and Google Play.

## Acknowledgements

This template was originally cloned from and heavily inspired by the excellent [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) repository. Big thanks to the creators and maintainers of the T3 stack!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
