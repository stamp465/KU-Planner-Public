import Button from "@/components/Button";
import { ButtonWidth } from "@/constants/enum";
import Link from "next/link";
import { MdFindInPage } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-2">
      <MdFindInPage size={96} />

      <div className="text-3xl font-bold text-primary-green-900">
        Not Found Page
      </div>
      <div className="text-xl text-primary-green-700 text-center">
        Could not find requested resource
      </div>

      <Link href="/">
        <Button
          text={"Return Home"}
          // onClick={async () => {
          //   router.replace("/");
          // }}
          width={ButtonWidth.Short}></Button>
      </Link>
    </div>
  );
}
