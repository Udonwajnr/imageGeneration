import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "AI Image Generator - Create Stunning Images with AI",
  description:
    "Generate beautiful AI images with advanced prompts and customization options",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className="font-sans">
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange> */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
