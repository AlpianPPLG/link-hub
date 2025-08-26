"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkIcon, Users, Zap, BarChart3, UserPlus, Settings, Share2, TrendingUp, Palette, Shield, Smartphone, Globe, Video, Briefcase, GraduationCap, Camera, Music, Code, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">LinkHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">One Link to Rule Them All</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create a beautiful landing page that houses all of your links and connect with your audience with just one
            link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your LinkHub
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>Create your personalized link page in minutes. No coding required.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Your links load instantly with our optimized infrastructure.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Track Performance</CardTitle>
              <CardDescription>Get insights on your link clicks and audience engagement.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with LinkHub in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Step 1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sign Up Free</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your account in seconds. No credit card required to get started.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Step 2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Customize</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add your links, choose themes, and personalize your profile to match your brand.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Step 3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Share & Track</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your unique link and watch your engagement grow with detailed analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Who It's For Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Who It's For</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perfect for anyone who wants to showcase their online presence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
              <CardHeader className="pb-4">
                <Camera className="h-12 w-12 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
                <CardTitle className="text-lg">Content Creators</CardTitle>
                <CardDescription className="text-sm">
                  YouTubers, TikTokers, and influencers showcasing all their content in one place.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="pb-4">
                <Briefcase className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-lg">Professionals</CardTitle>
                <CardDescription className="text-sm">
                  Consultants, freelancers, and entrepreneurs building their personal brand.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="pb-4">
                <GraduationCap className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle className="text-lg">Students</CardTitle>
                <CardDescription className="text-sm">
                  Showcasing portfolios, projects, and academic achievements in one hub.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <CardHeader className="pb-4">
                <Music className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-lg">Artists</CardTitle>
                <CardDescription className="text-sm">
                  Musicians, designers, and creatives sharing their work and social presence.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create the perfect link-in-bio experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Features list */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Beautiful Themes</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose from 8 stunning themes or create your own custom design with unlimited colors and styles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track clicks, views, and engagement with detailed insights to optimize your content strategy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect all your social media platforms with beautifully designed icons and seamless integration.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mobile Optimized</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Lightning-fast loading on all devices with responsive design that looks perfect everywhere.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side - Visual showcase */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">JD</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h3>
                    <p className="text-gray-600 dark:text-gray-400">@johndoe</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Content Creator & Designer</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-900 dark:text-blue-100 font-medium">🎥 My YouTube Channel</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">2.1k clicks</span>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <span className="text-green-900 dark:text-green-100 font-medium">💼 Portfolio</span>
                        <span className="text-xs text-green-600 dark:text-green-400">856 clicks</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-900 dark:text-purple-100 font-medium">📧 Contact Me</span>
                        <span className="text-xs text-purple-600 dark:text-purple-400">423 clicks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📷</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🐦</span>
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📺</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Got questions? We've got answers. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Is LinkHub really free to use?",
                answer: "Yes! LinkHub offers a generous free plan that includes unlimited links, basic analytics, and access to all our beautiful themes. You can upgrade to premium for advanced features like custom CSS and detailed analytics."
              },
              {
                question: "How do I customize my LinkHub profile?",
                answer: "Once you sign up, you can customize your profile from the dashboard. Choose from 8 pre-designed themes, upload your avatar, add your bio, and arrange your links in any order. You can also add custom colors and even custom CSS for complete control."
              },
              {
                question: "Can I track how many people click my links?",
                answer: "Absolutely! LinkHub provides detailed analytics showing total clicks, clicks per link, visitor insights, and engagement trends. You can even export your analytics data for further analysis."
              },
              {
                question: "Is my LinkHub profile mobile-friendly?",
                answer: "Yes! All LinkHub profiles are fully responsive and optimized for mobile devices. Your profile will look stunning on smartphones, tablets, and desktops with lightning-fast loading times."
              },
              {
                question: "Can I use my own domain name?",
                answer: "Currently, all profiles use the format linkhub.com/username. Custom domain support is on our roadmap and will be available in future updates. You'll be notified when this feature becomes available."
              },
              {
                question: "How secure is my data with LinkHub?",
                answer: "Your data security is our top priority. We use industry-standard encryption, secure authentication, and regular security audits. Your information is stored safely and never shared with third parties without your consent."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                      {faq.question}
                    </CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to get started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of creators who trust LinkHub with their online presence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Your Free Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 LinkHub. Built with Next.js and love.</p>
        </div>
      </footer>
    </div>
  )
}
