"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Image from "next/image";
import iconKUPlanner from "../../public/Icon.svg";
import Link from "next/link";
import { useScroll } from "@/hook/useScroll";
import { ButtonWidth, StdStatus } from "@/constants/enum";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignOutButton from "@/components/SignOutButton";
import clsx from "clsx";
import { selectedPageAtom } from "@/atom/selectedPageAtom";
import { useAtom } from "jotai";
import { selectedStdStatusAtom } from "@/atom/selectedStdStatusAtom";
import { HiMenuAlt1 } from "react-icons/hi";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [, setSelectedStdStatus] = useAtom(selectedStdStatusAtom);
  const [selectedPage] = useAtom(selectedPageAtom);
  const hiddenScrollY = 56;

  const { lastScrollY } = useScroll();

  const tNavbar = useTranslations("Navbar");
  const tCommon = useTranslations("Common");

  const DropdownNavMenu = () => {
    return (
      <details className="dropdown sm:hidden py-2">
        <summary className=" btn bg-neutral-grey-50">
          <HiMenuAlt1 size={20} />
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-neutral-white rounded w-52">
          {/* <li>
              <LanguageSwitcher />
            </li> */}
          <li>
            <Link
              href="/guide"
              className={clsx("text-base text-primary-green-900", {
                "font-bold": pathname == "/guide",
              })}>
              {tNavbar("Guide")}
            </Link>
          </li>
          <li>
            <Link
              href="/subjects?page=1"
              className={clsx("text-base text-primary-green-900", {
                "font-bold": ["/subjects", "/genEd"].includes(pathname),
              })}>
              {tNavbar("FindClass")}
            </Link>
          </li>
          {session?.user && (
            <li>
              <Link
                href="/stdPlan"
                className={clsx("text-base text-primary-green-900", {
                  "font-bold": pathname == "/stdPlan",
                })}>
                {tNavbar("stdPlan")}
              </Link>
            </li>
          )}

          <li>
            <Link
              href={selectedPage == 1 ? "/selectedSubjects" : "/table"}
              className={clsx("text-base text-primary-green-900", {
                "font-bold": ["/selectedSubjects", "/table"].includes(pathname),
              })}>
              {tNavbar("MakeTable")}
            </Link>
          </li>
        </ul>
      </details>
    );
  };

  const NavMenu = () => {
    return (
      <>
        {pathname !== "/" && (
          <div className="hidden sm:flex sm:items-center gap-4 h-full">
            {/* <LanguageSwitcher /> */}
            <div className="relative h-full flex items-center">
              <Link
                href="/guide"
                className={clsx("text-base text-primary-green-900", {
                  "font-bold": pathname == "/guide",
                })}>
                {tNavbar("Guide")}
              </Link>
              {pathname == "/guide" && (
                <div className="absolute bottom-0 mx-auto h-1 w-full bg-primary-green-900 rounded-t-3xl"></div>
              )}
            </div>

            <div className="relative h-full flex items-center">
              <Link
                href="/subjects?page=1"
                className={clsx("text-base text-primary-green-900", {
                  "font-bold": ["/subjects", "/genEd"].includes(pathname),
                })}>
                {tNavbar("FindClass")}
              </Link>
              {["/subjects", "/genEd"].includes(pathname) && (
                <div className="absolute bottom-0 mx-auto h-1 w-full bg-primary-green-900 rounded-t-3xl"></div>
              )}
            </div>

            {session?.user && (
              <div className="relative h-full flex items-center">
                <Link
                  href="/stdPlan"
                  className={clsx("text-base text-primary-green-900", {
                    "font-bold": pathname == "/stdPlan",
                  })}>
                  {tNavbar("stdPlan")}
                </Link>
                {pathname == "/stdPlan" && (
                  <div className="absolute bottom-0 mx-auto h-1 w-full bg-primary-green-900 rounded-t-3xl"></div>
                )}
              </div>
            )}

            <div className="relative h-full flex items-center">
              <Link
                href={selectedPage == 1 ? "/selectedSubjects" : "/table"}
                className={clsx("text-base text-primary-green-900", {
                  "font-bold": ["/selectedSubjects", "/table"].includes(
                    pathname
                  ),
                })}>
                {tNavbar("MakeTable")}
              </Link>
              {["/selectedSubjects", "/table"].includes(pathname) && (
                <div className="absolute bottom-0 mx-auto h-1 w-full bg-primary-green-900 rounded-t-3xl"></div>
              )}
            </div>
          </div>
        )}

        <div
          className={clsx({
            "flex sm:hidden": pathname === "/" && !session?.user,
          })}>
          {session?.user ? (
            <SignOutButton width={ButtonWidth.NotExpand} />
          ) : (
            <Button
              text={tCommon("Login")}
              onClick={async () => {
                router.replace("/login");
              }}
              width={ButtonWidth.Short}></Button>
          )}
        </div>
      </>
    );
  };

  useEffect(() => {
    // console.log("nav");
    if (session?.user) {
      setSelectedStdStatus(
        session.user.student.studentStatusNameEn as StdStatus
      );
    } else {
      setSelectedStdStatus(null);
    }
  }, [session]);

  return (
    <div
      className={clsx("w-full px-2  top-0 z-40", {
        "shadow-md bg-white fixed": lastScrollY > hiddenScrollY,
        "bg-transparent absolute": lastScrollY <= hiddenScrollY,
      })}>
      <div
        className={clsx("flex justify-between items-center", {
          "sm:max-w-[1296px] sm:mx-auto": pathname !== "/",
          "w-full ": pathname === "/",
        })}>
        <div className="flex gap-2 justify-between items-center">
          <DropdownNavMenu />
          {pathname !== "/" ||
          (pathname === "/" && lastScrollY > hiddenScrollY) ? (
            <Link
              href="/"
              className="">
              <Image
                src={iconKUPlanner}
                width={0}
                height={42}
                alt="KUPlanner"
              />
            </Link>
          ) : (
            <div className=" h-12"></div>
          )}

          {/* <SwitchTheme /> */}
        </div>
        <div className="flex items-center gap-4 h-12">
          <NavMenu />
        </div>
      </div>
    </div>
  );
}
