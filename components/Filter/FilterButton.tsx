import Button from "@/components/Button";
import FilterModal from "./FilterModal";
import { FaFilter } from "react-icons/fa6";
import { ButtonWidth } from "@/constants/enum";

export default function FilterButton() {
  return (
    <>
      <a href="#filter_modal">
        <Button
          width={ButtonWidth.NotExpand}
          fullHeight={true}>
          <div className=" text-neutral-white">
            <FaFilter />
          </div>
        </Button>
      </a>
      <FilterModal />
    </>
  );
}
