import { LoginDto, Result, UserInfoVO } from "./index";
import http from "./http";
import {
  DashboardStatsVO,
  SharedParkingReviewQueryDto,
  SharedParkingReviewVO,
  SharedParkingReviewDto,
  PageVO,
  ReportQueryDto,
  ReportVO,
  ReportHandleDto,
  StatisticsQueryDto,
  StatisticsVO,
  DailyFlowVO,
  PeakHourVO,
  OccupancyTrendVO,
  ParkingLotRankVO,
  ParkingStatusVO,
  ParkingLotQueryDto,
  ParkingLotVO,
  ActivityVO,
} from "./index";

/**
 * 管理员登录
 */
export const Login = (data: LoginDto) => {
  return http.post<Result<{ token: string; id: number }>>("/admin/login", data);
};

// ========== 数据概览 ==========

/**
 * 获取数据概览统计
 */
export const getDashboardStats = () => {
  return http.get<Result<DashboardStatsVO>>("/admin/dashboard/stats");
};

/**
 * 获取最近活动记录
 */
export const getRecentActivities = () => {
  return http.get<Result<ActivityVO[]>>("/admin/dashboard/activities");
};

// ========== 停车场管理 ==========

/**
 * 获取停车场列表（管理员用，支持分页和筛选）
 */
export const getAdminParkingLots = (params?: ParkingLotQueryDto) => {
  return http.post<Result<PageVO<ParkingLotVO>>>(
    "/admin/parking_lot/list",
    params
  );
};

export const getUserInfo = (id: number) => {
  return http.get<Result<UserInfoVO>>(`/admin/user/${id}`);
};
// ========== 用户举报管理 ==========

/**
 * 获取用户举报列表
 */
export const getReports = (params?: ReportQueryDto) => {
  return http.post<Result<PageVO<ReportVO>>>("/admin/report/list", params);
};

/**
 * 获取举报详情
 */
export const getReportDetail = (id: number) => {
  return http.get<Result<ReportVO>>(`/admin/report/${id}`);
};

/**
 * 处理举报（标记为已处理）
 */
export const handleReport = (data: ReportHandleDto) => {
  return http.post<Result<null>>("/admin/report/handle", data);
};

/**
 * 删除举报
 */
export const deleteReport = (id: number) => {
  return http.delete<Result<null>>(`/admin/report/${id}`);
};

// ========== 数据报表 ==========

/**
 * 获取统计数据
 */
export const getStatistics = (params?: StatisticsQueryDto) => {
  return http.post<Result<StatisticsVO>>("/admin/statistics/overview", params);
};

/**
 * 获取每日停车流量
 */
export const getDailyFlow = (params?: StatisticsQueryDto) => {
  return http.post<Result<DailyFlowVO[]>>(
    "/admin/statistics/daily_flow",
    params
  );
};

/**
 * 获取热门时段统计
 */
export const getPeakHours = (params?: StatisticsQueryDto) => {
  return http.post<Result<PeakHourVO[]>>(
    "/admin/statistics/peak_hours",
    params
  );
};

/**
 * 获取车位使用率趋势
 */
export const getOccupancyTrend = (params?: StatisticsQueryDto) => {
  return http.post<Result<OccupancyTrendVO[]>>(
    "/admin/statistics/occupancy_trend",
    params
  );
};

/**
 * 获取停车场使用排行
 */
export const getParkingLotRank = (params?: StatisticsQueryDto) => {
  return http.post<Result<ParkingLotRankVO[]>>(
    "/admin/statistics/parking_lot_rank",
    params
  );
};

// ========== 车位实时状态 ==========

/**
 * 获取所有停车场的实时状态
 */
export const getParkingStatus = () => {
  return http.get<Result<ParkingStatusVO[]>>("/admin/parking/status");
};
