import { GiBookPile } from "react-icons/gi";

export default function Loading() {
  return (
    <div className=" flex flex-col w-full h-full justify-center items-center bg-neutral-white gap-2">
      <GiBookPile size={48} />
      <div className="loading loading-dots loading-md"></div>
    </div>
  );
}
