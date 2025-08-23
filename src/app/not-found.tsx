import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkIcon, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">LinkHub</span>
          </Link>
        </div>

        {/* 404 Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
            <CardTitle className="text-2xl">Profile Not Found</CardTitle>
            <CardDescription>The profile you're looking for doesn't exist or may have been removed.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Double-check the username in the URL or try searching for the profile again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Create Your Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
