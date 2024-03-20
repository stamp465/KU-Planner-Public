"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const tLanguage = useTranslations("Language");

  return (
    <button
      className=" hover:text-white"
      onClick={() => {
        if (pathname.includes("/en"))
          router.replace("/th" + pathname.slice(3, pathname.length));
        else router.replace("/en" + pathname);
      }}>
      <div className="text-xl">
        {pathname.includes("/en") ? tLanguage("TH") : tLanguage("EN")}
      </div>
    </button>
  );
};

export default LanguageSwitcher;
