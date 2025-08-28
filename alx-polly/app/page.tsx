import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container py-16">
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
              <button className="btn btn-default btn-lg">Explore Polls</button>
            </Link>
            <Link href="/create-poll">
              <button className="btn btn-outline btn-lg">Create Poll</button>
            </Link>
            <Link href="/auth">
              <button className="btn btn-outline btn-lg">Sign In</button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center p-6">
            <div className="card-content pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗳️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Voting</h3>
              <p className="text-gray-600">
                Simple and intuitive voting interface for all your polls
              </p>
            </div>
          </div>

          <div className="card text-center p-6">
            <div className="card-content pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                See results update instantly as people vote
              </p>
            </div>
          </div>

          <div className="card text-center p-6">
            <div className="card-content pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Build engagement and gather feedback from your audience
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-header text-center">
              <h2 className="card-title">Get Started</h2>
              <p className="card-description">
                Choose an action to begin your polling journey
              </p>
            </div>
            <div className="card-content">
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/polls">
                  <button className="btn btn-outline w-full h-20 text-lg">
                    Browse Polls
                  </button>
                </Link>
                <Link href="/create-poll">
                  <button className="btn btn-outline w-full h-20 text-lg">
                    Create Poll
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="btn btn-outline w-full h-20 text-lg">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
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
