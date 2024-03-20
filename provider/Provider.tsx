import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import CLientProviders from "./ClientProvider";
import { apiServerGetAllSubjects } from "@/service/api-server-get-all-subjects";
import { apiServerGetAllGenEd } from "@/service/api-server-get-all-gen-ed";

export default async function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const subjects = await apiServerGetAllSubjects();
  const allGenEd = await apiServerGetAllGenEd();
  // console.log(subjects);
  return (
    <CLientProviders
      session={session}
      subjects={subjects}
      genEd={allGenEd}>
      {children}
    </CLientProviders>
  );
}
