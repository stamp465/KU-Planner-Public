import SelectedSubjects from "@/components/Table/SelectedSubjects";
import Table from "@/components/Table/Table";

export default function TablePage() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto px-4 gap-2 max-w-[1296px] pb-8">
      <Table />
      <SelectedSubjects />
    </div>
  );
}
