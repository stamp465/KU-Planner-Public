import { Subject } from "@/model/subject";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function PlanComponent({
  choiceOfSection,
  tableSubjects,
  isSelected = false,
  index,
  onSelected,
}: {
  choiceOfSection: Array<Array<string>>;
  tableSubjects: Array<Subject | null>;
  isSelected?: boolean;
  index: number;
  onSelected: (index: number) => void;
}) {
  const tTablePage = useTranslations("TablePage");
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  const border = clsx("border", {
    "border-primary-green-900": isSelected == true,
    "border-neutral-grey-200": isSelected == false || isSelected == undefined,
  });
  const textColor = clsx({
    "text-primary-green-900": isSelected == true,
    "text-secondary-blue-900": isSelected == false || isSelected == undefined,
  });

  return (
    <div
      className={clsx(
        "px-2 w-full relative rounded hover:bg-neutral-grey-100 hover:cursor-pointer",
        border
      )}
      onClick={() => onSelected(index)}>
      <div className="w-full relative">
        {isSelected ? <SelectedIcon /> : <></>}
        <div
          className={clsx(
            "w-full flex flex-col justify-start items-start py-2 text-base font-bold",
            textColor
          )}>
          <div>{`${tTablePage("Plan")} ${index + 1}`}</div>
          {choiceOfSection.map((setOfSection, index) => {
            const choiceOfSectionThatChoose = choiceOfSection.filter(
              (section) => section.length != 0
            );
            const selectedIndex =
              choiceOfSectionThatChoose.findIndex(
                (section) => section == setOfSection
              ) + 1;
            return (
              <div
                className="text-sm font-normal flex gap-x-1"
                key={`tSubjectsAndSections ${index}`}>
                {selectedIndex !== 0 ? (
                  <p className="font-bold whitespace-nowrap">{`${selectedIndex}.`}</p>
                ) : (
                  <></>
                )}
                <p
                  className={clsx({
                    "line-through": setOfSection.length == 0,
                  })}>
                  {`${tableSubjects[index]?.subjectCode} ${
                    tableSubjects[index]?.subjectNameTH ?? "ไม่พบข้อมูล"
                  } ${
                    setOfSection.length == 0
                      ? ""
                      : `${tSubjectsAndSections("Section")} ${setOfSection.join(
                          ", "
                        )}`
                  }`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SelectedIcon() {
  const tTablePage = useTranslations("TablePage");
  return (
    <div
      className={clsx(
        "text-xs font-bold text-primary-green-900",
        "bg-primary-green-100 px-2 py-1 rounded-b-lg",
        "absolute right-0"
      )}>
      {tTablePage("Selected")}
    </div>
  );
}
