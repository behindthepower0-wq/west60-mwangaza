import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Edit Team Member
        </h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <TeamMemberForm initialData={member} />
      </div>
    </div>
  );
}
