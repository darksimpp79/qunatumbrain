"use client"

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import type React from "react"

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export function ErrorBoundaryClient({ children }: { children: React.ReactNode }) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
}

