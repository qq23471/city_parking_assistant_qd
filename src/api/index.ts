export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoginDto {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginVO {
  token: string;
  id: number;
}

export interface RegisterDto {
  username: string;
  password: string;
  phone?: string;
}

export interface UserInfoVO {
  id?: number;
  username?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ResetPasswordDto {
  phone: string;
  newPassword: string;
}

export interface UpdateUserInfoDto {
  username?: string;
  phone?: string;
  avatar?: string;
}

// Parking Lot 查询 DTO
export interface ParkingLotQueryDto {
  keyword?: string;
  type?: number;
  sortBy?: string;
  pageNum?: number;
  pageSize?: number;
}

// Parking Lot 返回 VO
export interface ParkingLotVO {
  id: number;
  name: string;
  address: string;
  img: string;
  totalSpaces: number;
  availableSpaces: number;
  type: number;
  pricePerHour: number;
  distance?: number;
}

export interface PageVO<T> {
  data: T[];
  total: number;
}

// 停车场创建/更新 DTO
export interface ParkingLotCreateDto {
  name: string;
  address: string;
  img?: string;
  totalSpaces: number;
  availableSpaces: number;
  distance?: number;
  type: number; // 0: 公共, 1: 商务
  pricePerHour: number;
}

export interface ParkingLotUpdateDto extends ParkingLotCreateDto {
  id: number;
}
export interface AppointmenDto {
  parkingLotId: number;
  date: string;
  time: string;
  duration: number;
  cost: number;
}
export interface AppointmenVO {
  id: number;
  parkingId: number;
  parkingName: string;
  address: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: number;
}
export interface PageDto {
  pageNum?: number;
  pageSize?: number;
}

// 停车历史记录 VO
export interface ParkingHistoryVO {
  id: number;
  parkingId: number;
  parkingName: string;
  address: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  routeInfo?: string;
}

// 停车历史记录创建 DTO
export interface ParkingHistoryCreateDto {
  parkingId?: number;
  parkingName: string;
  address: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  routeInfo?: string;
}

// ========== 管理员相关接口 ==========

// 数据概览统计 VO
export interface DashboardStatsVO {
  totalParkingLots: number; // 总停车场数
  totalSpots: number; // 总车位数
  occupancyRate: number; // 占用率（百分比）
  pendingShared: number; // 待审核共享车位数
  pendingReports: number; // 待处理举报数
}

// 最近活动 VO
export interface ActivityVO {
  id: number;
  type: "report" | "parking" | "shared" | "audit" | "system";
  title: string;
  time: string;
  icon?: string;
}

// 共享车位审核查询 DTO
export interface SharedParkingReviewQueryDto extends PageDto {
  status?: number; // 0: 待审核, 1: 已通过, 2: 已拒绝
}

// 共享车位审核 VO
export interface SharedParkingReviewVO {
  id: number;
  name: string;
  address: string;
  owner: string; // 发布者用户名
  ownerId: number; // 发布者ID
  price: number;
  totalSpaces: number;
  availableSpaces: number;
  img?: string;
  status: number; // 0: 待审核, 1: 已通过, 2: 已拒绝
  submitTime: string; // 提交时间
  reviewTime?: string; // 审核时间
  reviewNote?: string; // 审核备注（拒绝原因）
  description?: string; // 描述
}

// 共享车位审核操作 DTO
export interface SharedParkingReviewDto {
  id: number;
  status: number; // 1: 通过, 2: 拒绝
  reviewNote?: string; // 拒绝原因（拒绝时必填）
}

// 用户举报查询 DTO
export interface ReportQueryDto extends PageDto {
  status?: number; // 0: 待处理, 1: 已处理
  type?: string; // 举报类型
}

// 用户举报 VO
export interface ReportVO {
  id: number;
  type: string; // 举报类型：虚假信息、价格欺诈、服务问题、其他
  content: string;
  reporterId: number; // 举报人ID
  parkingLotId?: number; // 关联的停车场ID
  reportTime: string; // 举报时间
  status: number; // 0: 待处理, 1: 已处理
  handleTime?: string; // 处理时间
  handleNote?: string; // 处理备注
}

// 举报处理 DTO
export interface ReportHandleDto {
  id: number;
  handleNote?: string; // 处理备注
}

// 统计数据查询 DTO
export interface StatisticsQueryDto {
  timeRange?: string; // 时间范围：today, week, month, year
}

// 统计数据 VO
export interface StatisticsVO {
  totalParkings: number; // 总停车次数
  avgOccupancy: number; // 平均占用率（百分比）
  totalRevenue: number; // 总收入
  sharedCount: number; // 共享车位数
}

// 每日停车流量 VO
export interface DailyFlowVO {
  date: string; // 日期
  count: number; // 停车次数
}

// 热门时段统计 VO
export interface PeakHourVO {
  time: string; // 时段，如 "08:00-10:00"
  count: number; // 停车次数
}

// 车位使用率趋势 VO
export interface OccupancyTrendVO {
  period: string; // 时间段标识
  rate: number; // 使用率（百分比）
}

// 停车场使用排行 VO
export interface ParkingLotRankVO {
  id: number;
  name: string;
  address: string;
  usage: number; // 使用次数
}

// 停车场实时状态 VO
export interface ParkingStatusVO {
  id: number;
  name: string;
  address: string;
  totalSpots: number; // 总车位数
  availableSpots: number; // 空闲车位数
  status: string; // active: 运营中, maintenance: 维护中
  occupancyRate: number; // 占用率（百分比）
}
