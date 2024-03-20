import { FaCircleExclamation } from "react-icons/fa6";

export default function ErrorChip({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="px-2 py-1 bg-accent-error-light rounded flex gap-1 justify-center">
      <div className=" ">
        <FaCircleExclamation
          size={16}
          color="#EC1E2B"
        />
      </div>
      <div className=" text-xs text-accent-error flex flex-col md:flex-row gap-x-1 w-full">
        {children}
      </div>
    </div>
  );
}
