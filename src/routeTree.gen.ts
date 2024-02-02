// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SignInLazyImport = createFileRoute('/sign-in')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SignInLazyRoute = SignInLazyImport.update({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/sign-in.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      preLoaderRoute: typeof SignInLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  SignInLazyRoute,
])