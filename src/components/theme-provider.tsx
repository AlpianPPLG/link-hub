"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  [key: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="linkhub-theme"
      themes={[
        "light",
        "dark",
        "forest",
        "ocean",
        "sunset",
        "galaxy",
        "minimal",
        "custom",
        "system"
      ]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}