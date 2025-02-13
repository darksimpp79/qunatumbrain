import type React from "react"
import "./globals.css"
import { ErrorBoundaryClient } from "./components/ErrorBoundary"

export const metadata = {
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundaryClient>{children}</ErrorBoundaryClient>
      </body>
    </html>
  )
}



import './globals.css'