import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.dashboard.stats.useQuery();
  const { data: user } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      icon: Users,
      description: "All time leads",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Express Leads",
      value: stats?.totalExpressLeads || 0,
      icon: TrendingUp,
      description: "Quick quote requests",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Contact Messages",
      value: stats?.totalContactMessages || 0,
      icon: Mail,
      description: "Customer inquiries",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Blog Posts",
      value: stats?.totalBlogPosts || 0,
      icon: FileText,
      description: "Published articles",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "New Leads Today",
      value: stats?.newLeadsToday || 0,
      icon: Clock,
      description: "Received today",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Express Leads Today",
      value: stats?.newExpressLeadsToday || 0,
      icon: CheckCircle,
      description: "Quick quotes today",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/leads"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Leads</div>
              <div className="text-sm text-muted-foreground">View and manage all leads</div>
            </a>
            <a
              href="/admin/express-leads"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Express Leads</div>
              <div className="text-sm text-muted-foreground">Quick quote requests</div>
            </a>
            <a
              href="/admin/contact-messages"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Contact Messages</div>
              <div className="text-sm text-muted-foreground">Customer inquiries</div>
            </a>
            <a
              href="/admin/blog"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Blog Management</div>
              <div className="text-sm text-muted-foreground">Create and edit blog posts</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Platform status and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/settings"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">System Settings</div>
              <div className="text-sm text-muted-foreground">Configure platform settings</div>
            </a>
            <a
              href="/admin/email-templates"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Email Templates</div>
              <div className="text-sm text-muted-foreground">Manage email templates</div>
            </a>
            <a
              href="/admin/activity-logs"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Activity Logs</div>
              <div className="text-sm text-muted-foreground">View admin activity history</div>
            </a>
            <a
              href="/admin/import-jobs"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Import Jobs</div>
              <div className="text-sm text-muted-foreground">Bulk import history</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
