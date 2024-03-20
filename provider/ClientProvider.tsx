"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Subject } from "@/model/subject";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { GenEdList } from "@/interface/GenEd";
import { allGenEdAtom } from "@/atom/allGenEdAtom";

export default function CLientProviders({
  children,
  session,
  subjects,
  genEd,
}: {
  children: React.ReactNode;
  session: any;
  subjects: Array<Subject>;
  genEd: Map<string, GenEdList>;
}) {
  const [mounted, setMounted] = useState(false);
  const [allSubjects, setAllSubjects] = useAtom(allSubjectsAtom);
  const [allGenEd, setAllGenEd] = useAtom(allGenEdAtom);

  useEffect(() => {
    setAllSubjects(
      subjects.map((subject) => {
        return new Subject(subject);
      })
    );
    setAllGenEd(genEd);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
