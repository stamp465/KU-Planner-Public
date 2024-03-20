import { FaHome } from "react-icons/fa";

export default function Loading() {
  return (
    <div className=" flex flex-col w-full h-full justify-center items-center bg-neutral-white gap-2">
      <FaHome size={48} />
      <span className="loading loading-dots loading-md"></span>
    </div>
  );
}
