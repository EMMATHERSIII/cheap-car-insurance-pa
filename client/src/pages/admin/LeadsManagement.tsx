import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Trash2, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function LeadsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading, refetch } = trpc.admin.leads.list.useQuery({
    page,
    limit: 50,
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    month: month === "all" ? undefined : parseInt(month),
    year: parseInt(year),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const bulkUpdateStatusMutation = trpc.admin.leads.bulkUpdateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "leads", "list"] });
    },
  });

  const bulkDeleteMutation = trpc.admin.leads.bulkDelete.useMutation({
    onSuccess: () => {
      toast.success("Leads deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "leads", "list"] });
    },
  });

  const handleExport = async () => {
    try {
      const exportData = await trpc.admin.leads.export.query({
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined,
        month: month === "all" ? undefined : parseInt(month),
        year: parseInt(year),
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `leads_export_${year}_${month}.xlsx`);
      toast.success("Leads exported successfully");
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedIds(data.data.map((lead) => lead.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      sent: "secondary",
      failed: "destructive",
      contacted: "outline",
      converted: "default",
      archived: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الـ Leads</h1>
          <p className="text-muted-foreground mt-2">إدارة جميع طلبات عروض أسعار التأمين</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
            <Download className="ml-2 h-4 w-4" />
            تصدير Excel
          </Button>
          <Button onClick={() => refetch()}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الفلاتر والبحث</CardTitle>
          <CardDescription>ابحث عن الـ Leads حسب التاريخ، الحالة، أو المعلومات الشخصية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-8"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="contacted">تم التواصل</SelectItem>
                <SelectItem value="converted">تم التحويل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="كل الأشهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأشهر</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString("ar-EG", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                {["2024", "2025", "2026"].map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => {
              setSearch("");
              setStatus("");
              setMonth("all");
              setYear(new Date().getFullYear().toString());
            }}>إعادة تعيين</Button>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-sm font-medium">{selectedIds.length} مختار</span>
              <Select onValueChange={(v) => bulkUpdateStatusMutation.mutate({ ids: selectedIds, status: v })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تحديث الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">تم التواصل</SelectItem>
                  <SelectItem value="converted">تم التحويل</SelectItem>
                  <SelectItem value="archived">أرشفة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="destructive" size="sm" onClick={() => {
                if (confirm("هل أنت متأكد من حذف المختار؟")) bulkDeleteMutation.mutate({ ids: selectedIds });
              }}>
                <Trash2 className="ml-2 h-4 w-4" />
                حذف المختار
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === data?.data?.length && data?.data?.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>التواصل</TableHead>
                <TableHead>السيارة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(lead.id)}
                      onCheckedChange={(checked) => handleSelectOne(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.firstName} {lead.lastName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{lead.email}</div>
                    <div className="text-xs text-muted-foreground">{lead.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.vehicleYear} {lead.vehicleType}
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(lead.createdAt).toLocaleDateString("ar-EG")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            عرض {data.pagination.total} نتائج
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>السابق</Button>
            <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= data.pagination.totalPages}>التالي</Button>
          </div>
        </div>
      )}
    </div>
  );
}
