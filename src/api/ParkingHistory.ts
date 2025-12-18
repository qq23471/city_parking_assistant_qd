import http from "./http";
import {
  Result,
  PageVO,
  ParkingHistoryVO,
  PageDto,
  ParkingHistoryCreateDto,
} from "./index";

export const getParkingHistory = (data: PageDto) => {
  return http.post<Result<PageVO<ParkingHistoryVO>>>(
    "parking/history/list",
    data
  );
};

export const addParkingHistory = (data: ParkingHistoryCreateDto) => {
  return http.post<Result<null>>("parking/history/add", data);
};
