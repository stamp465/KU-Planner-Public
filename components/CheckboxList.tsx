interface checkBoxList<T> {
  checkData: T;
  checkList: Array<T>;
  setCheckList: (value: T) => void;
  text: string;
}

export default function CheckBoxList({
  checkData,
  checkList,
  setCheckList,
  text,
}: checkBoxList<any>) {
  return (
    <div className="flex items-center gap-2 text-primary-green-900">
      <input
        type="checkbox"
        className="checkbox checkbox-xs rounded-sm checkbox-success"
        checked={checkList.includes(checkData)}
        onChange={(e) => {
          if (e.target.checked) {
            setCheckList([...checkList, checkData]);
          } else {
            setCheckList(checkList.filter((checkF) => checkF != checkData));
          }
        }}
      />
      {text}
    </div>
  );
}
