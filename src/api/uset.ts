import http from "./http";
import {
  Result,
  LoginDto,
  LoginVO,
  RegisterDto,
  UserInfoVO,
  ResetPasswordDto,
  UpdateUserInfoDto,
} from "./index";

export const login = (data: LoginDto) => {
  return http.post<Result<LoginVO>>("/user/login", data);
};

export const register = (data: RegisterDto) => {
  return http.post<Result<null>>("/user/register", data);
};

export const getUserInfo = () => {
  return http.get<Result<UserInfoVO>>("/user/info");
};

export const resetPassword = (data: ResetPasswordDto) => {
  return http.post<Result<null>>("/user/resetPassword", data);
};

export const updateUserInfo = (data: UpdateUserInfoDto) => {
  return http.put<Result<UserInfoVO>>("/user/info", data);
};

/**
 * 上传头像
 * @param file 头像文件
 */
export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.post<Result<{ avatarUrl: string }>>("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 更新用户资料
 * @param data 用户资料数据
 */
export const updateProfile = (data: UpdateUserInfoDto) => {
  return http.put<Result<UserInfoVO>>("/user/profile", data);
};
