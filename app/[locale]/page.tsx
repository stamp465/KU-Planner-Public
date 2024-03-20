import { useTranslations } from "next-intl";
import titleKUPlanner from "../../public/title.svg";
import example1 from "../../public/example1.svg";
import example2 from "../../public/example2.svg";
import backgroudBlur from "../../public/backgroud_blur.svg";
import Image from "next/image";
import Button from "@/components/Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import Link from "next/link";
import { authOptions } from "@/utils/auth";
import { getServerSession, Session } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <GetTranslations session={session} />;
}

function GetTranslations({ session }: { session: Session | null }) {
  const tNavbar = useTranslations("Navbar");
  const tCommon = useTranslations("Common");

  return (
    <main className="w-full h-full">
      <div className="z-20 absolute top-0 left-0 w-full sm:h-full flex flex-col justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-8 px-4">
          <div className="pt-16 sm:px-0">
            <Image
              src={titleKUPlanner}
              width={480}
              height={0}
              alt="KUPlanner Title"
              className="animate-fade-up animate-once bg-transparent"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="hidden sm:flex flex-col gap-4 relative h-80 animate-fade-down animate-once">
              <div className="ml-20 flex items-end gap-2">
                <Image
                  src={example2}
                  width={240}
                  height={0}
                  alt="Title3"
                  className="rounded-md"
                />
                <div className="text-2xl font-bold whitespace-nowrap">{`ปรับเปลี่ยนได้ และบันทึกได้`}</div>
              </div>
              <div className="absolute bottom-0 flex items-end gap-2">
                <Image
                  src={example1}
                  width={240}
                  height={0}
                  alt="Title2"
                  className="rounded-md"
                />
                <div className="text-2xl font-bold whitespace-nowrap">{`จัดตารางได้ง่ายๆ เพียงแค่เลือกวิชา`}</div>
              </div>
            </div>

            <div className="sm:hidden flex flex-col gap-4 items-center animate-fade-down animate-once">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={example2}
                  width={240}
                  height={0}
                  alt="Title3"
                  className="rounded-md"
                />
                <div className="text-xl font-bold whitespace-nowrap">{`ปรับเปลี่ยนได้ และบันทึกได้`}</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={example1}
                  width={240}
                  height={0}
                  alt="Title2"
                  className="rounded-md"
                />
                <div className="text-xl font-bold whitespace-nowrap">{`จัดตารางได้ง่ายๆ เพียงแค่เลือกวิชา`}</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 my-6 sm:my-12 animate-fade-up animate-once">
              <div className="flex flex-wrap gap-x-4">
                <Link href="/guide">
                  <Button
                    width={ButtonWidth.Medium}
                    bgColor="bg-primary-green-300 hover:bg-primary-green-100">
                    <div className="text-2xl font-bold">{tNavbar("Guide")}</div>
                  </Button>
                </Link>
                {!session?.user && (
                  <Link
                    href="/login"
                    className="hidden sm:block">
                    <Button
                      width={ButtonWidth.Medium}
                      bgColor="bg-neutral-white hover:bg-primary-green-50">
                      <div className="text-2xl font-bold">
                        {tCommon("Login")}
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4 ">
                <Link href="/subjects">
                  <Button
                    text={tNavbar("FindClass")}
                    width={ButtonWidth.Short}></Button>
                </Link>
                {session?.user && (
                  <Link href="/stdPlan">
                    <Button
                      text={tNavbar("stdPlan")}
                      width={ButtonWidth.Short}></Button>
                  </Link>
                )}
                <Link href="/selectedSubjects">
                  <Button
                    text={tNavbar("MakeTable")}
                    width={ButtonWidth.Short}></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-t sm:bg-gradient-to-l from-primary-green-900 overflow-x-hidden">
        <Image
          src={backgroudBlur}
          width={480}
          height={0}
          alt="KUPlanner Title"
          className="hidden z-10 sm:block sm:absolute top-0 right-0 sm:w-full sm:h-full bg-transparent animate-fade-left animate-once"
        />
        <Image
          src={backgroudBlur}
          width={480}
          height={0}
          alt="KUPlanner Title"
          className="hidden z-10 sm:block sm:absolute top-0 left-10 sm:w-full sm:h-full bg-transparent animate-fade-left animate-once"
        />
      </div>
    </main>
  );
}
