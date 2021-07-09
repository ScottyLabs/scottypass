import { ErrorDetailTypes, ErrorTypes } from "../../_enums/errorTypes";

export class SiteError {
  status: ErrorTypes;
  detail: ErrorDetailTypes;
  msg: string;

  constructor(status: ErrorTypes, detail: ErrorDetailTypes, msg: string) {
    this.status = status;
    this.msg = msg;
    this.detail = detail;
  }
}