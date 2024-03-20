import { StdStatus } from "@/constants/enum";

export function stringToNumber(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const num = parseInt(value);
  if (isNaN(num)) return null;
  return num;
}

export function stringToJSONArray(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  let result;
  try {
    result = JSON.parse(value);
    return Array.isArray(result) ? result : null;
  } catch {
    return null;
  }
}

export function stringToBoolean(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return false;
  let result;
  try {
    result = JSON.parse(value);
    return result as boolean;
  } catch {
    return false;
  }
}

export function getSelectedStdStatusLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  const value = localStorage.getItem("selectedStdStatus");
  if (value === null || value === undefined || value === "") return null;
  let result;
  try {
    result = JSON.parse(value);
    return typeof result === "string" ? (result as StdStatus) : null;
  } catch {
    return null;
  }
}

export function getSelectedPageLocalStorage() {
  if (typeof window === "undefined") {
    return 1;
  }
  const value = localStorage.getItem("selectedPage");
  if (value === null || value === undefined || value === "") return 1;
  let result;
  try {
    result = JSON.parse(value);
    return typeof result === "number" && (result === 1 || result === 2)
      ? result
      : 1;
  } catch {
    return 1;
  }
}

export function getLocalStorageToArrayOfString(localStorageKey: string) {
  if (typeof window === "undefined") {
    return [];
  }
  const value = localStorage.getItem(localStorageKey);
  if (value === null || value === undefined || value === "") return [];
  let result;
  try {
    result = JSON.parse(value);
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export function CSVToJSON(csvString: string, delimiter = ","): object[] {
  const lines = csvString.trim().replaceAll("\r", "").split("\n");
  const headers = lines[0].split(delimiter);

  const jsonArray: object[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");

    const entry: { [key: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = currentLine[j];
    }

    jsonArray.push(entry);
  }

  return jsonArray;
}
