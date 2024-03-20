import Image from "next/image";
import login from "../../../public/guide/login.svg";
import subjects from "../../../public/guide/subjects.svg";
import plan from "../../../public/guide/plan.svg";
import table from "../../../public/guide/table.svg";
import { IoIosWarning } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";
import Link from "next/link";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

export default async function Guide() {
  const session = await getServerSession(authOptions);

  return (
    <main className="px-4 pb-8 container mx-auto w-full md:max-w-[1296px]">
      <div className="flex flex-col gap-2">
        {/* Alert */}
        {!session?.user && (
          <div
            role="alert"
            className="p-4 rounded-lg border-2 border-accent-warning bg-accent-warning-light text-sm sm:text-base">
            <div className="flex items-center gap-x-2">
              <IoIosWarning
                size={24}
                color="#FFC107"
              />
              <div>
                <span>{`เพื่อการใช้งานระบบที่ราบรื่น `}</span>
                <span>
                  <Link
                    href="/login"
                    className="">
                    <span className="font-bold hover:underline">{`กรุณาเข้าสู่ระบบ`}</span>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}

        <div
          role="alert"
          className="p-4 rounded-lg border-2 border-accent-warning bg-accent-warning-light text-sm sm:text-base">
          <div className="flex items-center gap-x-2">
            <IoIosWarning
              size={24}
              color="#FFC107"
            />
            <div>
              <span>{`ระบบจะบันทึกข้อมูลของท่านก็ต่อเมื่อท่าน`}</span>
              <span className="font-bold">{`กดปุ่มออกจากระบบ`}</span>
              <span>{`หรือ`}</span>
              <span className="font-bold">{`กดปุ่มบันทึกแบบร่าง`}</span>
              <span>{`เท่านั้น`}</span>
            </div>
          </div>
        </div>
        <div
          role="alert"
          className="p-4 rounded-lg border-2 border-accent-info bg-accent-info-light  text-sm sm:text-base">
          <div className="flex items-start gap-x-2">
            <FaCircleInfo
              size={24}
              color="#2196F3"
            />
            <div>
              <div>{`ระบบหลักของเว็บไซต์นี้จะมี`}</div>
              <ol className="list-decimal list-inside	">
                <li>
                  <span>{`ระบบดูแผนการเรียน `}</span>
                  <span>
                    <Link
                      href="/stdPlan"
                      className="">
                      <span className="font-bold hover:underline">{`ไปดูแผนการเรียนของท่าน`}</span>
                    </Link>
                  </span>
                </li>
                <li>
                  <span>{`ระบบจัดตารางเรียน จะเป็นการเลือกวิชา จัดลำดับความสำคัญ และสร้างตารางเรียน `}</span>
                  <span>
                    <Link
                      href="/selectedSubjects"
                      className="">
                      <span className="font-bold hover:underline">{`ไปจัดตารางเรียน`}</span>
                    </Link>
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* tab list */}
        <div
          role="tablist"
          className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-xs xs:text-sm sm:text-base md:text-xl px-2 sm:px-6 font-bold text-neutral-black"
            aria-label={"เข้าสู่ระบบ"}
            defaultChecked={true}
          />
          <div
            role="tabpanel"
            className="tab-content py-4">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-lg font-bold self-start">{`คู่มือ หน้าเข้าสู่ระบบ`}</div>
              <Image
                src={login}
                width={1024}
                height={0}
                alt="login"
                className="rounded-md border-2 border-primary-green-900"
              />
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-xs xs:text-sm sm:text-base md:text-xl px-2 sm:px-6 font-bold text-neutral-black"
            aria-label={"ค้นหารายวิชา"}
          />
          <div
            role="tabpanel"
            className="tab-content py-4">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-lg font-bold self-start">{`คู่มือ หน้าค้นหารายวิชา`}</div>
              <Image
                src={subjects}
                width={1024}
                height={0}
                alt="subjects"
                className=""
              />
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-xs xs:text-sm sm:text-base md:text-xl px-2 sm:px-6 font-bold text-neutral-black"
            aria-label={"แผนการเรียน"}
            defaultChecked={true}
          />
          <div
            role="tabpanel"
            className="tab-content py-4">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-lg font-bold self-start">{`คู่มือ หน้าแผนการเรียน`}</div>
              <Image
                src={plan}
                width={1024}
                height={0}
                alt="plan"
                className=""
              />
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-xs xs:text-sm sm:text-base md:text-xl px-2 sm:px-6 font-bold text-neutral-black"
            aria-label={"จัดตารางเรียน"}
            defaultChecked={true}
          />
          <div
            role="tabpanel"
            className="tab-content py-4">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="text-lg font-bold self-start">{`คู่มือ หน้าจัดตารางเรียน`}</div>
              <Image
                src={table}
                width={1024}
                height={0}
                alt="table"
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
