import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Vote, TrendingUp, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-blue-600">AlxPolly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and participate in polls with ease. Get real-time results 
            and insights from your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polls">
              <Button size="lg" className="text-lg px-8 py-3">
                Explore Polls
              </Button>
            </Link>
            <Link href="/create-poll">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Create Poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Voting</h3>
              <p className="text-gray-600">
                Simple and intuitive voting interface for all your polls
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                See results update instantly as people vote
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Build engagement and gather feedback from your audience
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in or create an account to start creating and voting on polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose AlxPolly?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Secure</div>
              <div className="text-gray-600">Privacy Protected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Instant</div>
              <div className="text-gray-600">Real-time Updates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Mobile</div>
              <div className="text-gray-600">Responsive Design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
