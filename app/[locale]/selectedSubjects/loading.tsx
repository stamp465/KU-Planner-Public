import { PiSelectionPlusLight } from "react-icons/pi";

export default function Loading() {
  return (
    <div className=" flex flex-col w-full h-full justify-center items-center bg-neutral-white gap-2">
      <PiSelectionPlusLight size={48} />
      <span className="loading loading-dots loading-md"></span>
    </div>
  );
}
