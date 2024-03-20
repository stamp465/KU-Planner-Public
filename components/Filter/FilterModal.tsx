import FilterRightSide from "./FilterRightSide";

export default function FilterModal() {
  return (
    <div
      className="modal text-primary-green-900"
      id="filter_modal">
      <div className="modal-box max-w-[720px] rounded bg-neutral-white">
        <FilterRightSide
          onClick={() => {
            // console.log("click");
          }}
          isExpanded={true}
        />
      </div>
    </div>
  );
}
