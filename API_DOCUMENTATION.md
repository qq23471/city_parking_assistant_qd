# 智慧城市停车引导与车位共享平台 API 文档（当前前端调用版）

> 依据前端代码 `src/api/http.ts` 与 `src/api/uset.ts` 重新整理。仅包含当前前端实际调用的接口；如后端路径或返回格式不同，请以后端实现为准并同步本文件。

## 基础信息
- **Base URL（前端 axios）**：`http://localhost:8080/api`
- **数据格式**：JSON，UTF-8
- **认证方式**：Bearer Token（登录成功后返回的 `token`，前端存储于 localStorage / sessionStorage，axios 请求拦截器自动加上 `Authorization: Bearer <token>`）

## 通用响应格式（约定）
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```
- `code`：业务状态码，200 为成功
- `message`：业务提示
- `data`：业务数据载体

---

## 1. 用户认证类

### 1.1 登录
- **URL**：`POST /user/login`
- **请求体**
```json
{
  "username": "user123",
  "password": "pass123",
  "rememberMe": true
}
```
- **字段说明**
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 账号/用户名 |
| password | string | 是 | 密码 |
| rememberMe | boolean | 否 | 记住我；前端用于决定 token 存储时长 |

- **成功响应示例**（示例结构，需与后端保持一致）
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt-token-string",
    "userId":  1
  }
}
```

### 1.2 注册
- **URL**：`POST /user/register`
- **请求体**
```json
{
  "username": "newUser",
  "password": "pass123",
  "phone": "13800138000"
}
```
- **字段说明**
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| phone | string | 选填 | 手机号 |

- **成功响应示例**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

### 1.3 获取用户信息
- **URL**：`GET /user/info`
- **请求头**：`Authorization: Bearer <token>`
- **成功响应示例**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "user123",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.png"
  }
}
```

### 1.4 重置密码（手机号）
- **URL**：`POST /user/resetPassword`
- **请求体**
```json
{
  "phone": "13800138000",
  "newPassword": "newPass123"
}
```
- **字段说明**
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| phone | string | 是 | 11 位手机号 |
| newPassword | string | 是 | 新密码 |

- **成功响应示例**
```json
{
  "code": 200,
  "message": "重置成功",
  "data": null
}
```

---

## 2. 认证/错误说明
- **状态码约定**：以 `code` 字段为准，200 成功；其余视后端约定（常见 400/401/403/500）。
- **登录态**：前端把 token 放到 localStorage / sessionStorage，axios 请求拦截器自动附加 `Authorization`。
- **CORS**：前端默认基于 `http://localhost:8080`，如跨域请在后端允许对应 Origin，并放行 OPTIONS 预检。

---

## 3. 待接入 / 预留
- 停车场列表、详情、预约
- 共享车位发布、审核
- 个人中心（预约、共享车位、停车历史）
- 管理员后台相关接口

> 当前前端未直接调用以上接口；接入后请补充对应路径、参数与响应示例。
# 智慧城市停车引导与车位共享平台 API 文档

## 基础信息

- **Base URL**: `https://api.example.com/v1`
- **API 版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用说明

### 请求头

所有请求需要包含以下请求头：

```
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
```

### 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 用户认证模块

### 1.1 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:

```json
{
  "username": "user123",
  "password": "password123",
  "rememberMe": true
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| captcha | string | 是 | 验证码 |
| rememberMe | boolean | 否 | 记住我，默认false |

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "phone": "138****8888",
      "avatar": "https://example.com/avatar.jpg"
    },
    "expiresIn": 86400
  }
}
```

### 1.2 用户注册

**接口地址**: `POST /api/auth/register`

**请求参数**:

```json
{
  "username": "user123",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "13800138000"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，3-20个字符 |
| password | string | 是 | 密码，至少6位 |
| confirmPassword | string | 是 | 确认密码 |
| phone | string | 否 | 手机号 |

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 1
  }
}
```

### 1.3 忘记密码/重置密码

**接口地址**: `POST /api/auth/reset-password`

**请求参数**:

```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null
}
```

### 1.4 管理员登录

**接口地址**: `POST /api/admin/auth/login`

**请求参数**:

```json
{
  "account": "admin",
  "password": "admin123",
  "captcha": "ABCD"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "account": "admin",
      "name": "管理员"
    }
  }
}
```

### 1.5 退出登录

**接口地址**: `POST /api/auth/logout`

**请求头**: 需要 Authorization

**响应示例**:

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

---

## 2. 停车场模块

### 2.1 获取停车场列表

**接口地址**: `GET /api/parking-lots`

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词（名称或地址） |
| type | string | 否 | 类型：public(公共停车场) / shared(共享车位) |
| sortBy | string | 否 | 排序：distance(距离) / price(价格) / available(空闲数) |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| latitude | number | 否 | 用户纬度（用于计算距离） |
| longitude | number | 否 | 用户经度（用于计算距离） |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "市中心商业区停车场",
        "address": "市中心商业街123号",
        "totalSpots": 200,
        "availableSpots": 45,
        "distance": 0.5,
        "price": 8,
        "type": "public",
        "status": "active",
        "latitude": 30.287459,
        "longitude": 120.153576
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2.2 获取停车场详情

**接口地址**: `GET /api/parking-lots/{id}`

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 停车场ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "市中心商业区停车场",
    "address": "市中心商业街123号",
    "totalSpots": 200,
    "availableSpots": 45,
    "distance": 0.5,
    "price": 8,
    "type": "public",
    "status": "active",
    "latitude": 30.287459,
    "longitude": 120.153576,
    "spotType": "indoor",
    "size": "medium",
    "startTime": "08:00",
    "endTime": "20:00",
    "contact": "138****8888",
    "description": "车位位置便利，靠近小区入口，24小时监控。",
    "images": ["https://example.com/image1.jpg"]
  }
}
```

### 2.3 预约车位

**接口地址**: `POST /api/reservations`

**请求头**: 需要 Authorization

**请求参数**:

```json
{
  "parkingLotId": 5,
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 3
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parkingLotId | number | 是 | 停车场ID |
| date | string | 是 | 预约日期，格式：YYYY-MM-DD |
| time | string | 是 | 预约时间，格式：HH:mm |
| duration | number | 是 | 停车时长（小时） |

**响应示例**:

```json
{
  "code": 200,
  "message": "预约成功",
  "data": {
    "id": 1,
    "parkingLotId": 5,
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 3,
    "cost": 12,
    "status": "pending"
  }
}
```

### 2.4 取消预约

**接口地址**: `DELETE /api/reservations/{id}`

**请求头**: 需要 Authorization

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 预约ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "取消成功",
  "data": null
}
```

---

## 3. 共享车位模块

### 3.1 发布共享车位

**接口地址**: `POST /api/shared-parking`

**请求头**: 需要 Authorization

**请求参数**:

```json
{
  "name": "阳光小区A栋地下车库",
  "address": "阳光小区A栋地下车库",
  "spotType": "indoor",
  "size": "medium",
  "hourlyPrice": 4,
  "dailyPrice": 30,
  "startTime": "08:00",
  "endTime": "20:00",
  "availableDays": ["1", "2", "3", "4", "5"],
  "contact": "138****8888",
  "description": "车位位置便利，靠近小区入口，24小时监控。"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 车位名称 |
| address | string | 是 | 详细地址 |
| spotType | string | 是 | 车位类型：indoor(室内) / outdoor(室外) / underground(地下) |
| size | string | 是 | 车位大小：small(小型) / medium(中型) / large(大型) |
| hourlyPrice | number | 是 | 每小时价格（元） |
| dailyPrice | number | 否 | 每日价格（元） |
| startTime | string | 是 | 开始时间，格式：HH:mm |
| endTime | string | 是 | 结束时间，格式：HH:mm |
| availableDays | array | 是 | 可用日期：["0","1",...,"6"] (0=周日) |
| contact | string | 是 | 联系方式 |
| description | string | 否 | 备注说明 |

**响应示例**:

```json
{
  "code": 200,
  "message": "提交成功，等待审核",
  "data": {
    "id": 1,
    "status": "pending"
  }
}
```

### 3.2 获取我的共享车位列表

**接口地址**: `GET /api/shared-parking/my`

**请求头**: 需要 Authorization

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "我的私家车位",
        "address": "阳光小区A栋地下车库",
        "price": 4,
        "startTime": "08:00",
        "endTime": "20:00",
        "status": "approved",
        "isActive": true,
        "totalEarnings": 156,
        "reservationCount": 12,
        "rejectReason": null
      }
    ]
  }
}
```

### 3.3 编辑共享车位

**接口地址**: `PUT /api/shared-parking/{id}`

**请求头**: 需要 Authorization

**请求参数**: 同发布共享车位

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

### 3.4 启用/暂停共享车位

**接口地址**: `PATCH /api/shared-parking/{id}/status`

**请求头**: 需要 Authorization

**请求参数**:

```json
{
  "isActive": true
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 3.5 删除共享车位

**接口地址**: `DELETE /api/shared-parking/{id}`

**请求头**: 需要 Authorization

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 4. 个人中心模块

### 4.1 获取我的预约列表

**接口地址**: `GET /api/reservations/my`

**请求头**: 需要 Authorization

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态：pending / confirmed / active / completed / cancelled |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "parkingId": 5,
        "parkingName": "张先生私家车位",
        "address": "阳光小区A栋地下车库",
        "date": "2024-01-15",
        "time": "14:00",
        "duration": 3,
        "cost": 12,
        "status": "confirmed"
      }
    ],
    "total": 10
  }
}
```

---

## 5. 管理员模块

### 5.1 数据概览

**接口地址**: `GET /api/admin/dashboard/overview`

**请求头**: 需要 Authorization (管理员权限)

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalParkingLots": 24,
    "totalSpots": 1860,
    "occupancyRate": 68,
    "pendingShared": 5,
    "recentActivities": [
      {
        "icon": "🅿️",
        "title": "新增停车场：市中心商业区停车场",
        "time": "2小时前"
      }
    ]
  }
}
```

### 5.2 获取停车场列表（管理员）

**接口地址**: `GET /api/admin/parking-lots`

**请求头**: 需要 Authorization (管理员权限)

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 状态：active / maintenance / closed |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例**: 同 2.1

### 5.3 添加停车场

**接口地址**: `POST /api/admin/parking-lots`

**请求头**: 需要 Authorization (管理员权限)

**请求参数**:

```json
{
  "name": "新停车场",
  "address": "地址信息",
  "totalSpots": 100,
  "status": "active"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

### 5.4 更新停车场

**接口地址**: `PUT /api/admin/parking-lots/{id}`

**请求头**: 需要 Authorization (管理员权限)

**请求参数**: 同添加停车场

### 5.5 删除停车场

**接口地址**: `DELETE /api/admin/parking-lots/{id}`

**请求头**: 需要 Authorization (管理员权限)

### 5.6 获取共享车位审核列表

**接口地址**: `GET /api/admin/shared-parking/review`

**请求头**: 需要 Authorization (管理员权限)

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态：pending / approved / rejected |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "阳光小区A栋地下车库",
        "address": "阳光小区A栋地下车库",
        "owner": "张先生",
        "price": 4,
        "availableTime": "08:00-20:00",
        "status": "pending",
        "createdAt": "2024-01-10T10:00:00Z"
      }
    ]
  }
}
```

### 5.7 审核共享车位

**接口地址**: `POST /api/admin/shared-parking/{id}/review`

**请求头**: 需要 Authorization (管理员权限)

**请求参数**:

```json
{
  "action": "approve",
  "reason": "审核通过"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| action | string | 是 | approve(通过) / reject(拒绝) |
| reason | string | 否 | 拒绝原因（拒绝时必填） |

**响应示例**:

```json
{
  "code": 200,
  "message": "审核成功",
  "data": null
}
```

### 5.8 获取用户举报列表

**接口地址**: `GET /api/admin/reports`

**请求头**: 需要 Authorization (管理员权限)

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态：pending / resolved |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "type": "虚假信息",
        "content": "该车位信息不实",
        "reporter": "用户A",
        "reportedAt": "2024-01-10T10:00:00Z",
        "status": "pending"
      }
    ]
  }
}
```

### 5.9 处理举报

**接口地址**: `POST /api/admin/reports/{id}/resolve`

**请求头**: 需要 Authorization (管理员权限)

**请求参数**:

```json
{
  "action": "resolve",
  "note": "已处理"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "处理成功",
  "data": null
}
```

### 5.10 删除举报

**接口地址**: `DELETE /api/admin/reports/{id}`

**请求头**: 需要 Authorization (管理员权限)

### 5.11 提交举报

**接口地址**: `POST /api/reports`

**请求头**: 需要 Authorization

**请求参数**:

```json
{
  "parkingLotId": 1,
  "type": "虚假信息",
  "content": "该车位信息不实",
  "contact": "138****8888"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parkingLotId | number | 是 | 停车场ID |
| type | string | 是 | 举报类型：虚假信息 / 价格欺诈 / 服务问题 / 其他 |
| content | string | 是 | 举报内容 |
| contact | string | 否 | 联系方式 |

---

## 6. 数据统计模块

### 6.1 获取统计数据

**接口地址**: `GET /api/admin/statistics`

**请求头**: 需要 Authorization (管理员权限)

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 统计类型：daily(每日) / weekly(每周) / monthly(每月) |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dailyTraffic": [
      {
        "date": "2024-01-10",
        "count": 120
      }
    ],
    "hotHours": [
      {
        "hour": 9,
        "count": 45
      }
    ],
    "occupancyTrend": [
      {
        "date": "2024-01-10",
        "rate": 68
      }
    ],
    "parkingLotRanking": [
      {
        "parkingLotId": 1,
        "parkingLotName": "市中心商业区停车场",
        "usageCount": 500
      }
    ]
  }
}
```

---

## 7. 验证码模块

### 7.1 获取验证码

**接口地址**: `GET /api/captcha`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "captchaId": "uuid-string",
    "captchaImage": "data:image/png;base64,..."
  }
}
```

**说明**: 前端也可以使用客户端生成的验证码，此接口为可选。

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 1001 | 用户名或密码错误 |
| 1002 | 验证码错误 |
| 1003 | 用户不存在 |
| 1004 | 密码错误 |
| 1005 | Token已过期 |
| 2001 | 停车场不存在 |
| 2002 | 车位已满 |
| 2003 | 预约时间冲突 |
| 3001 | 共享车位不存在 |
| 3002 | 共享车位审核中，无法编辑 |
| 3003 | 共享车位已拒绝，无法编辑 |
| 4001 | 无权限访问 |
| 5001 | 服务器内部错误 |

---

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. Token 有效期默认为 7 天，可通过 `rememberMe` 参数延长
3. 时间格式统一使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ssZ`
4. 日期格式：`YYYY-MM-DD`
5. 价格单位为人民币（元），保留两位小数
6. 距离单位为公里（km），保留一位小数
7. 分页参数：page 从 1 开始，pageSize 默认 10，最大 100

---

## 更新日志

- **v1.0.0** (2024-01-10): 初始版本，包含所有基础功能接口


