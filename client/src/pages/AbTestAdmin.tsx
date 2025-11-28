import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, TrendingUp, Eye, CheckCircle, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AbTestAdmin() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: "",
    headline: "",
    subheadline: "",
    ctaText: "",
    description: "",
  });

  const { data: analytics, refetch: refetchAnalytics } = trpc.abtest.getAnalytics.useQuery();
  const createVariant = trpc.abtest.createVariant.useMutation({
    onSuccess: () => {
      toast.success("Variant created successfully");
      setIsCreateDialogOpen(false);
      setNewVariant({ name: "", headline: "", subheadline: "", ctaText: "", description: "" });
      refetchAnalytics();
    },
    onError: () => {
      toast.error("Failed to create variant");
    },
  });

  const updateVariant = trpc.abtest.updateVariant.useMutation({
    onSuccess: () => {
      toast.success("Variant updated successfully");
      refetchAnalytics();
    },
    onError: () => {
      toast.error("Failed to update variant");
    },
  });

  const deleteVariant = trpc.abtest.deleteVariant.useMutation({
    onSuccess: () => {
      toast.success("Variant deleted successfully");
      refetchAnalytics();
    },
    onError: () => {
      toast.error("Failed to delete variant");
    },
  });

  const handleCreateVariant = () => {
    if (!newVariant.name || !newVariant.headline || !newVariant.ctaText) {
      toast.error("Please fill in all required fields");
      return;
    }
    createVariant.mutate(newVariant);
  };

  const handleToggleActive = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "yes" ? "no" : "yes";
    updateVariant.mutate({ id, isActive: newStatus });
  };

  const handleSetDefault = (id: number) => {
    // First, unset all defaults
    analytics?.forEach((variant) => {
      if (variant.isDefault === "yes") {
        updateVariant.mutate({ id: variant.variantId, isDefault: "no" });
      }
    });
    // Then set the new default
    setTimeout(() => {
      updateVariant.mutate({ id, isDefault: "yes" });
    }, 100);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      deleteVariant.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">A/B Test Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze landing page variants
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Variant</DialogTitle>
                <DialogDescription>
                  Create a new landing page variant to test
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Variant Name *</Label>
                  <Input
                    id="name"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    placeholder="e.g., Aggressive Headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline *</Label>
                  <Input
                    id="headline"
                    value={newVariant.headline}
                    onChange={(e) => setNewVariant({ ...newVariant, headline: e.target.value })}
                    placeholder="e.g., Pennsylvania Drivers Are Overpaying"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Input
                    id="subheadline"
                    value={newVariant.subheadline}
                    onChange={(e) => setNewVariant({ ...newVariant, subheadline: e.target.value })}
                    placeholder="e.g., Get cheaper insurance in 2 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Button Text *</Label>
                  <Input
                    id="ctaText"
                    value={newVariant.ctaText}
                    onChange={(e) => setNewVariant({ ...newVariant, ctaText: e.target.value })}
                    placeholder="e.g., Get Free Quote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Internal Description</Label>
                  <Textarea
                    id="description"
                    value={newVariant.description}
                    onChange={(e) => setNewVariant({ ...newVariant, description: e.target.value })}
                    placeholder="Notes about this variant..."
                  />
                </div>
                <Button onClick={handleCreateVariant} className="w-full">
                  Create Variant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.reduce((sum, v) => sum + v.views, 0) || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.reduce((sum, v) => sum + v.conversions, 0) || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics && analytics.length > 0
                  ? (
                      analytics.reduce((sum, v) => sum + v.conversionRate, 0) / analytics.length
                    ).toFixed(2)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variants List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Variants</h2>
          {analytics && analytics.length > 0 ? (
            <div className="grid gap-4">
              {analytics.map((variant) => (
                <Card key={variant.variantId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{variant.variantName}</CardTitle>
                          {variant.isDefault === "yes" && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                              DEFAULT
                            </span>
                          )}
                          {variant.isActive === "no" && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                              INACTIVE
                            </span>
                          )}
                        </div>
                        <CardDescription className="mt-2">
                          <strong>Headline:</strong> {variant.headline}
                          <br />
                          <strong>CTA:</strong> {variant.ctaText}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(variant.variantId, variant.isActive)}
                        >
                          {variant.isActive === "yes" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(variant.variantId)}
                          disabled={variant.isDefault === "yes"}
                        >
                          Set Default
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(variant.variantId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="text-2xl font-bold">{variant.views}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                        <p className="text-2xl font-bold">{variant.conversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">{variant.conversionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No variants yet. Create your first variant to start A/B testing!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
