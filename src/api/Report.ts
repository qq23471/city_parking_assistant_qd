import http from "./http";
import { Result } from "./index";

/**
 * 用户举报提交 DTO
 */
export interface CreateReportDto {
  parkingLotId: number;
  type: string; // 举报类型：虚假信息 / 价格欺诈 / 服务问题 / 安全隐患 / 其他
  content: string; // 举报内容/描述
}

/**
 * 提交用户举报
 */
export const createReport = (data: CreateReportDto) => {
  return http.post<Result<null>>("/report/add", data);
};
