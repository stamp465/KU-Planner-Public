"use client";

import { Session } from "next-auth";
import SignOutButton from "../SignOutButton";
import { ButtonWidth } from "@/constants/enum";

export default function SignOutForm({ session }: { session: Session }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {`${session.user.idCode} ${session.user.firstNameTh} ${session.user.lastNameTh}`}
      <SignOutButton
        width={ButtonWidth.NotExpand}
        showText={true}
      />
    </div>
  );
}
