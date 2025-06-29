import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ProfileProvider } from "@/contexts/profile-context"
import { Toaster } from "@/components/ui/sonner"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CogniWeave - Your Web, Reimagined for Your Mind",
  description: "A revolutionary AI fabric that transforms web content in real-time to match your cognitive needs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ProfileProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
