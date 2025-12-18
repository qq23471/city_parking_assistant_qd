import http from "./http";
import { AppointmenDto, PageDto, PageVO, Result } from ".";
import { AppointmenVO } from ".";

export const addAppointment = (data: AppointmenDto) => {
  return http.post<Result<number>>("appointmen/add", data);
};
export const SureAppointment = (Id: number) => {
  return http.post<Result<null>>("appointmen/sure", { id: Id });
};
export const getAppointment = (data: PageDto) => {
  return http.post<Result<PageVO<AppointmenVO>>>("appointmen/list", data);
};
