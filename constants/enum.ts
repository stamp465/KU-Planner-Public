//* Default Enum
export enum SectionType {
  Lecture = "Lecture",
  Laboratory = "Laboratory",
}

export const sectionTypeStringToSectionType = (sectionType: string) => {
  if (sectionType === "16902") return SectionType.Laboratory;
  else return SectionType.Lecture;
};

export enum StdStatus {
  Regular = "Regular",
  RegularInternational = "RegularInternational",
  Special = "Special",
  SpecialInternational = "SpecialInternational",
}

export const listOfSortedStdStatus = (value: Array<StdStatus>) => {
  const stdStatusOrder = Object.values(StdStatus);
  return value.sort(
    (a, b) => stdStatusOrder.indexOf(a) - stdStatusOrder.indexOf(b)
  );
};

export const sectionCodeToStdStatus = (sectionCode: number) => {
  if (sectionCode < 90) return StdStatus.Regular;
  else if (sectionCode < 100) return StdStatus.RegularInternational;
  else if (sectionCode < 400) return StdStatus.Special;
  else return StdStatus.SpecialInternational;
};

export enum DayType {
  Sun = "Sun",
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
  None = "None",
}

export const listOfSortedDays = (value: Array<DayType>) => {
  const dayOrder = Object.values(DayType);
  return value.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
};

export const dayThaiToEnum = (value: string) => {
  switch (value) {
    case "วันอาทิตย์":
      return DayType.Sun;
    case "วันจันทร์":
      return DayType.Mon;
    case "วันอังคาร":
      return DayType.Tue;
    case "วันพุธ":
      return DayType.Wed;
    case "วันพฤหัสบดี":
      return DayType.Thu;
    case "วันศุกร์":
      return DayType.Fri;
    case "วันเสาร์":
      return DayType.Sat;
    default:
      return DayType.None;
  }
};

export const dayEngToEnum = (value: string) => {
  switch (value) {
    case "SUN":
      return DayType.Sun;
    case "MON":
      return DayType.Mon;
    case "TUE":
      return DayType.Tue;
    case "WED":
      return DayType.Wed;
    case "THU":
      return DayType.Thu;
    case "FRI":
      return DayType.Fri;
    case "SAT":
      return DayType.Sat;
    default:
      return DayType.None;
  }
};

export enum FilterMode {
  And = "And",
  Or = "Or",
}

//* Button Enum
export enum ButtonWidth {
  Short = "Short",
  Medium = "Medium",
  Long = "Long",
  Expand = "Expand",
  NotExpand = "NotExpand",
}

export enum ButtonType {
  Normal = "Normal",
  Disable = "Disable",
  Outline = "Outline",
  Blank = "Blank",
}

//* Chip Enum
export enum ChipType {
  Normal = "Normal",
  Section = "Section",
  Day = "Day",
}

//* useScroll
export enum ScrollDirection {
  Up = "Up",
  Down = "Down",
}

export enum ErrorType {
  CodeError = "CodeError",
  Unauthorized = "Unauthorized",
  Unexpected = "Unexpected",
}

// Name Component Type Enum
export enum NameComponentType {
  Order = "Order",
  Search = "Search",
  Favorite = "Favorite",
  Hint = "Hint",
}

// Gen Ed Subject Type Enum
export enum GenEdType {
  Wellness = "Wellness",
  Entrepreneurship = "Entrepreneurship",
  LanguageAndCommunication = "LanguageAndCommunication",
  Aesthetics = "Aesthetics",
  ThaiCitizenAndGlobalCitizen = "ThaiCitizenAndGlobalCitizen",
}

// Enum for check subject learn pass ?
export enum SubjectPassType {
  Pass = "Pass",
  Fail = "Fail",
  Now = "Now",
}
