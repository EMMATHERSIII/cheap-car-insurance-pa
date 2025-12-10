import { Shield, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CheapCarInsurancePennsylvania.com</h1>
                <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
              </div>
            </Link>
            <Button asChild>
              <Link href="/">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Insurance Blog</h1>
            <p className="text-xl text-muted-foreground">
              Expert tips, guides, and news to help you save money on car insurance in Pennsylvania and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                          {post.category}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : "Draft"}
                          </div>
                        </div>
                        <div className="flex items-center text-primary font-semibold">
                          Read more <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
              <p className="text-muted-foreground mb-8">
                We're working on creating helpful content for you. Check back soon!
              </p>
              <Button asChild>
                <Link href="/">Get Your Free Quote</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Save on Car Insurance?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get personalized quotes from top providers in just 2 minutes.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/">Get Free Quote Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
