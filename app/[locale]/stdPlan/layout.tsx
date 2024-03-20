import { Suspense } from "react";
import Loading from "./loading";

export default function stdPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
