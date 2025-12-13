import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  image_url: string | null;
  published_at: string;
}

interface BlogSearchProps {
  posts: BlogPost[];
  onPostSelect?: (post: BlogPost) => void;
}

export default function BlogSearch({ posts, onPostSelect }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [posts]);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((p) => {
      if (p.tags) {
        p.tags.split(",").forEach((tag) => {
          tagsSet.add(tag.trim());
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Filter posts based on search criteria
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;

      const matchesTags =
        selectedTags.length === 0 ||
        (post.tags &&
          selectedTags.some((tag) =>
            post.tags.toLowerCase().includes(tag.toLowerCase())
          ));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags, posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search articles by title or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-3 text-base"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {(searchQuery || selectedCategory || selectedTags.length > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-700"
        >
          Clear all filters
        </Button>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Found <span className="font-semibold">{filteredPosts.length}</span>{" "}
        article{filteredPosts.length !== 1 ? "s" : ""}
      </div>

      {/* Search Results */}
      <div className="grid gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onPostSelect?.(post)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  {post.tags &&
                    post.tags.split(",").slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No articles found matching your search.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-2"
            >
              Clear filters and try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
