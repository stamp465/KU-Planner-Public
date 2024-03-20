import "./globals.css";
import { Noto_Sans_Thai } from "next/font/google";
import Navbar from "./navbar";
import { useLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Provider from "@/provider/Provider";

const notoSan = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai"],
});

export const metadata = {
  title: "KU Planner",
  description: "Planner Class Table for your role",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  return import(`../../messages/${params.locale}.json`)
    .then(function (messages) {
      return (
        <html
          lang={locale}
          className="bg-nofill">
          <Provider>
            <body
              className={`${notoSan.className} h-full bg-neutral-white text-black`}>
              <NextIntlClientProvider
                locale={params.locale}
                messages={JSON.parse(JSON.stringify(messages))}>
                <Navbar />
                <div className=" h-screen pt-20">{children}</div>
              </NextIntlClientProvider>
            </body>
          </Provider>
        </html>
      );
    })
    .catch((error) => notFound());
}
