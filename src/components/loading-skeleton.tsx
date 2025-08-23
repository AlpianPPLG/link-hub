import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="flex-1">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LinksSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
