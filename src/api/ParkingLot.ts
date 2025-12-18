import http from "./http";
import {
  ParkingLotQueryDto,
  ParkingLotVO,
  PageVO,
  Result,
  ParkingLotCreateDto,
  ParkingLotUpdateDto,
  PageDto,
} from "./index";

// 获取停车场列表（支持分页）
export const fetchParkingLots = (params?: ParkingLotQueryDto) => {
  return http.post<Result<PageVO<ParkingLotVO>>>("parking_lot/list", params);
};

// 添加停车场
export const createParkingLot = (data: ParkingLotCreateDto) => {
  return http.post<Result<{ id: number }>>("parking_lot/add", data);
};

// 更新停车场
export const updateParkingLot = (data: ParkingLotUpdateDto) => {
  return http.post<Result<null>>("parking_lot/update", data);
};

// 删除停车场
export const deleteParkingLot = (id: number) => {
  return http.delete<Result<null>>(`parking_lot/delete/${id}`);
};
export const getMyParkingLots = (data: PageDto) => {
  return http.post<Result<PageVO<ParkingLotVO>>>("parking_lot/myList", data);
};
