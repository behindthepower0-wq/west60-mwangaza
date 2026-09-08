import type { Metadata } from "next";
import { LocationsManager } from "@/components/admin/LocationsManager";

export const metadata: Metadata = { title: "Locations | CMS" };

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6">
      <LocationsManager />
    </div>
  );
}
