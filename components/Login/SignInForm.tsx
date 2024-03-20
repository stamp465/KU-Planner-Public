"use client";

import { useTranslations } from "next-intl";
import { getSession, signIn } from "next-auth/react";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import { ButtonType, ButtonWidth } from "../../constants/enum";
import TextField from "@/components/TextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorChip from "../ErrorChip";
import { apiGetPlan } from "@/service/api-get-plan";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { useAtom } from "jotai";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";
import clsx from "clsx";
import { apiCheckGrade } from "@/service/api-check-grade";
import { selectedPageAtom } from "@/atom/selectedPageAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";

export default function SignInForm() {
  const tLogin = useTranslations("Login");
  const tCommon = useTranslations("Common");
  const router = useRouter();

  const username = useRef("");
  const password = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const [, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const [, setChoiceOfSectionDB] = useAtom(choiceOfSectionDBAtom);
  const [, setSelectedPage] = useAtom(selectedPageAtom);
  const [, setSelectedChoiceOfSection] = useAtom(selectedChoiceOfSectionAtom);
  async function getUserPlan(
    loginName: string | null,
    accessToken: string | null
  ) {
    const { data, status } = await apiGetPlan(loginName, accessToken);
    const userPlan = data.data;
    // console.log(userPlan);
    setFavoriteSubjects(userPlan.favoriteSubjects);
    setSearchSubjects(userPlan.searchSubjects);
    setOrderSubjects(userPlan.orderSubjects);
    setChoiceOfSectionDB(userPlan.choiceOfSection);
    setSelectedChoiceOfSection(null);
    if (userPlan.choiceOfSection) {
      setSelectedPage(2);
    } else {
      setSelectedPage(1);
    }
  }

  const onLogin = async () => {
    // console.log("onLogin");
    setError("");
    const result = await signIn("credentials", {
      username: username.current,
      password: password.current,
      redirect: false,
      // callbackUrl: "/",
    });
    // console.log(result);
    if (result?.ok && result?.error == null) {
      const session = await getSession();
      // console.log(session?.user.loginName, session?.token.accesstoken);
      await getUserPlan(session?.user.loginName, session?.token.accesstoken);
      router.refresh();
      router.push("/");
    } else {
      setIsLoading((prev) => false);
      if (result?.error?.includes("500")) {
        setError("500");
      } else {
        setError("404");
      }
    }
  };

  return (
    <form
      className="form-control flex flex-col gap-2 "
      onSubmit={async (e) => {
        e.preventDefault();
        if (!isLoading) {
          setIsLoading((prev) => true);
          onLogin();
        }
      }}>
      <div
        role="alert"
        className="p-4 rounded-lg border-2 border-accent-warning bg-accent-warning-light text-sm sm:text-base">
        {`ในปัจจุบัน ระบบจะแสดงผลข้อมูลได้ดีและมีประสิทธิภาพ เมื่อผู้ใช้งานเป็นนิสิตวิศวกรรมคอมพิวเตอร์ ที่ใช้แผนการเรียนปี 2560`}
      </div>
      <TextField
        type="text"
        placeholder={tLogin("HintUsername")}
        labelText={tLogin("TitleUsername")}
        onChange={(textFieldUsername) => {
          username.current = textFieldUsername;
        }}></TextField>
      <TextField
        type="password"
        placeholder={tLogin("HintPassword")}
        labelText={tLogin("TitlePassword")}
        onChange={(textFieldPassword) => {
          password.current = textFieldPassword;
        }}></TextField>
      {error.length != 0 && (
        <ErrorChip>{tLogin(`ServerError${error}`)}</ErrorChip>
      )}
      {isLoading ? (
        <Button
          type={ButtonType.Disable}
          width={ButtonWidth.Expand}>
          {
            <span
              className={clsx(
                "loading loading-dots loading-md text-neutral-white"
              )}></span>
          }
        </Button>
      ) : (
        <Button
          text={tCommon("Login")}
          width={ButtonWidth.Expand}></Button>
      )}

      <Link
        className="text-sm text-secondary-blue-900 self-end hover:underline"
        href={"https://accounts.ku.ac.th/private/login"}>
        {tLogin("ForgotPassword")}
      </Link>
    </form>
  );
}
