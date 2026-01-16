import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

const WebhooksManagement: React.FC = () => {
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    entityType: "all",
    isActive: "yes" as "yes" | "no",
  });

  const { data: webhooks, refetch } = trpc.admin.webhooks.list.useQuery();
  const createMutation = trpc.admin.webhooks.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewWebhook({ name: "", url: "", entityType: "all", isActive: "yes" });
    },
  });
  const updateMutation = trpc.admin.webhooks.update.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.admin.webhooks.delete.useMutation({ onSuccess: () => refetch() });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newWebhook);
  };

  const toggleStatus = (id: number, currentStatus: string) => {
    updateMutation.mutate({
      id,
      data: { isActive: currentStatus === "yes" ? "no" : "yes" },
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">إدارة الـ Webhooks (تصدير تلقائي)</h1>

      {/* Add New Webhook Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">إضافة رابط تصدير جديد</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="اسم الرابط (مثلاً: CRM الخاص بي)"
            className="border p-2 rounded"
            value={newWebhook.name}
            onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="رابط الـ Webhook (URL)"
            className="border p-2 rounded md:col-span-2"
            value={newWebhook.url}
            onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? "جاري الإضافة..." : "إضافة وتفعيل"}
          </button>
        </form>
      </div>

      {/* Webhooks List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">الاسم</th>
              <th className="p-4">الرابط</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {webhooks?.map((webhook) => (
              <tr key={webhook.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{webhook.name}</td>
                <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{webhook.url}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      webhook.isActive === "yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {webhook.isActive === "yes" ? "مفعل" : "متوقف"}
                  </span>
                </td>
                <td className="p-4 space-x-reverse space-x-2">
                  <button
                    onClick={() => toggleStatus(webhook.id, webhook.isActive)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      webhook.isActive === "yes" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  >
                    {webhook.isActive === "yes" ? "إيقاف" : "تشغيل"}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
                        deleteMutation.mutate({ id: webhook.id });
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {webhooks?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  لا يوجد روابط مضافة حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebhooksManagement;
