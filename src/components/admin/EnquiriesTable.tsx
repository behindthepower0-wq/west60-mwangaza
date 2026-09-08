"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Search,
  Eye,
  Trash2,
  Loader2,
  X,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  property: { name: string; slug: string } | null;
}

interface EnquiriesTableProps {
  enquiries: EnquiryRow[];
  total: number;
  page: number;
  totalPages: number;
  currentQuery: string;
  currentStatus: string;
}

const STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "CLOSED"];

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-amber-100 text-amber-800",
    FOLLOW_UP: "bg-purple-100 text-purple-800",
    CONVERTED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}

function buildUrl(query: string, status: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin/enquiries${qs ? `?${qs}` : ""}`;
}

export function EnquiriesTable({
  enquiries,
  total,
  page,
  totalPages,
  currentQuery,
  currentStatus,
}: EnquiriesTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [viewing, setViewing] = useState<EnquiryRow | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl(searchQuery.trim(), currentStatus, 1));
  };

  const handleStatusFilter = (status: string) => {
    router.push(buildUrl(currentQuery, status, 1));
  };

  const handleStatusChange = async (id: string, status: string) => {
    setSavingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch {
      setError("Failed to update status. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete enquiry");
      if (viewing?.id === id) setViewing(null);
      router.refresh();
    } catch {
      setError("Failed to delete enquiry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleWhatsApp = (row: EnquiryRow) => {
    const lines = [
      `Hello ${row.name},`,
      `This is West 60 Mwangaza Properties following up on your enquiry${row.property ? ` about ${row.property.name}` : ""}.`,
      row.message ? `\nYour message: "${row.message.slice(0, 500)}"` : "",
      `\nKindly reach us for any questions.`,
    ];
    const phone = row.phone || "0711400933";
    window.open(getWhatsAppUrl(phone, lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, subject or message..."
            className="form-input pl-9 text-sm w-full"
          />
        </form>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Status:</span>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="form-input text-sm bg-white w-auto"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div className="admin-card p-0 overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="text-center py-20">
            <Mail size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No enquiries found</h3>
            <p className="text-sm text-gray-400">
              {total === 0
                ? "When users contact you, their messages will appear here."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Contact", "Property / Subject", "Status", "Date", "Message", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{e.name}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a
                          href={`mailto:${e.email}`}
                          className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600"
                        >
                          <Mail size={12} /> {e.email}
                        </a>
                        {e.phone && (
                          <a
                            href={`tel:${e.phone}`}
                            className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600"
                          >
                            <Phone size={12} /> {e.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                      {e.property ? (
                        <Link
                          href={`/properties/${e.property.slug}`}
                          target="_blank"
                          className="hover:text-primary-600 flex items-center gap-1"
                        >
                          {e.property.name}
                          <ExternalLink size={11} className="text-gray-400" />
                        </Link>
                      ) : (
                        e.subject || "-"
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={e.status}
                          disabled={savingId === e.id}
                          onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer border border-transparent focus:outline-none focus:ring-1 focus:ring-primary-400 ${statusBadgeClass(
                            e.status
                          )}`}
                          title="Update status"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {savingId === e.id && (
                          <Loader2 size={12} className="animate-spin text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(e.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {e.message}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewing(e)}
                          className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleWhatsApp(e)}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Contact via WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          disabled={deletingId === e.id}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete enquiry"
                        >
                          {deletingId === e.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {enquiries.length} of {total} enquiries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                router.push(buildUrl(currentQuery, currentStatus, page - 1))
              }
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() =>
                router.push(buildUrl(currentQuery, currentStatus, page + 1))
              }
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Enquiry Details
              </h3>
              <button
                onClick={() => setViewing(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">{viewing.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(viewing.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-medium ${statusBadgeClass(
                    viewing.status
                  )}`}
                >
                  {viewing.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <a
                  href={`mailto:${viewing.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                >
                  <Mail size={14} className="text-gray-400" /> {viewing.email}
                </a>
                {viewing.phone && (
                  <a
                    href={`tel:${viewing.phone}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                  >
                    <Phone size={14} className="text-gray-400" /> {viewing.phone}
                  </a>
                )}
              </div>

              {(viewing.property || viewing.subject) && (
                <div className="p-3 rounded-xl bg-gray-50 text-sm">
                  {viewing.property ? (
                    <>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Property
                      </p>
                      <Link
                        href={`/properties/${viewing.property.slug}`}
                        target="_blank"
                        className="font-semibold text-primary-700 hover:text-secondary-600 flex items-center gap-1"
                      >
                        {viewing.property.name}
                        <ExternalLink size={12} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Subject
                      </p>
                      <p className="font-medium text-gray-700">{viewing.subject}</p>
                    </>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Message
                </p>
                <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {viewing.message}
                </div>
              </div>

              {viewing.notes && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {viewing.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => handleWhatsApp(viewing)}
                className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:shadow-lg flex items-center gap-2"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={15} /> WhatsApp Client
              </button>
              <button
                onClick={() => setViewing(null)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}