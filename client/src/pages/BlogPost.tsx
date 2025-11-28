import { Shield, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">CheapCarInsurancePennsylvania.com</h1>
                  <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
                </div>
              </a>
              <Button asChild>
                <a href="/">Get Free Quote</a>
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
              <div className="h-64 bg-gray-200 rounded mb-8" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">CheapCarInsurancePennsylvania.com</h1>
                  <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
                </div>
              </a>
              <Button asChild>
                <a href="/">Get Free Quote</a>
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/blog">Back to Blog</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CheapCarInsurancePennsylvania.com</h1>
                <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
              </div>
            </a>
            <Button asChild>
              <a href="/">Get Free Quote</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <a
            href="/blog"
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </a>

          {/* Category */}
          {post.category && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center space-x-4 text-muted-foreground mb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "Draft"}
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-2xl mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* CTA */}
          <div className="mt-16 bg-accent/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Save on Car Insurance?</h2>
            <p className="text-muted-foreground mb-6">
              Get personalized quotes from top providers in just 2 minutes.
            </p>
            <Button asChild size="lg">
              <a href="/">Get Your Free Quote Now</a>
            </Button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
