import { Student } from "./student";

export class UserData {
  loginName: string;
  userType: string;
  idCode: string;
  titleTh: string;
  titleEn: string;
  firstNameTh: string;
  firstNameEn: string;
  middleNameTh: string;
  middleNameEn: string;
  lastNameTh: string;
  lastNameEn: string;
  avatar: string;
  gender: string;
  student: Student;

  constructor(secionJson: any) {
    this.loginName = secionJson["loginName"];
    this.userType = secionJson["userType"];
    this.idCode = secionJson["idCode"];
    this.titleTh = secionJson["titleTh"];
    this.titleEn = secionJson["titleEn"];
    this.firstNameTh = secionJson["firstNameTh"];
    this.firstNameEn = secionJson["firstNameEn"];
    this.middleNameTh = secionJson["middleNameTh"];
    this.middleNameEn = secionJson["middleNameEn"];
    this.lastNameTh = secionJson["lastNameTh"];
    this.lastNameEn = secionJson["lastNameEn"];
    this.avatar = secionJson["avatar"];
    this.gender = secionJson["gender"];
    this.student = secionJson["student"];
  }
}
