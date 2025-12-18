# 管理员后台 API 接口文档

## 基础信息

- **Base URL**: `http://localhost:8080/api`
- **认证方式**: Bearer Token（在请求头中添加 `Authorization: Bearer {token}`）
- **数据格式**: JSON

---

## 1. 管理员登录

### 1.1 管理员登录

**接口地址**: `POST /admin/login`

**请求参数**:
```json
{
  "username": "string",      // 管理员账号（必填）
  "password": "string",       // 管理员密码（必填）
  "rememberMe": boolean       // 记住我（必填）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1
  }
}
```

---

## 2. 数据概览

### 2.1 获取数据概览统计

**接口地址**: `GET /admin/dashboard/stats`

**请求头**: 
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalParkingLots": 24,      // 总停车场数
    "totalSpots": 1860,           // 总车位数
    "occupancyRate": 68,          // 占用率（百分比）
    "pendingShared": 5            // 待审核共享车位数
  }
}
```

---

## 3. 停车场管理

### 3.1 获取停车场列表（管理员用）

**接口地址**: `POST /admin/parking_lot/list`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "keyword": "string",        // 搜索关键词（可选，搜索停车场名称或地址）
  "type": 0,                  // 类型筛选（可选，0: 公共停车场, 1: 商务停车场）
  "sortBy": "string",         // 排序方式（可选）
  "pageNum": 1,               // 页码（可选，默认1）
  "pageSize": 10              // 每页数量（可选，默认10）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "市中心商业区停车场",
        "address": "市中心商业街123号",
        "img": "http://example.com/image.jpg",
        "totalSpaces": 200,
        "availableSpaces": 45,
        "type": 0,
        "pricePerHour": 5.0,
        "distance": 1.2
      }
    ],
    "total": 24
  }
}
```

### 3.2 创建停车场

**接口地址**: `POST /parking_lot/add`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "name": "string",           // 停车场名称（必填）
  "address": "string",        // 地址（必填）
  "img": "string",            // 图片URL（可选）
  "totalSpaces": 100,        // 总车位数（必填）
  "availableSpaces": 50,     // 空闲车位数（必填）
  "distance": 1.5,            // 距离（可选，单位：km）
  "type": 0,                  // 类型（必填，0: 公共停车场, 1: 商务停车场）
  "pricePerHour": 5.0        // 每小时价格（必填）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 25
  }
}
```

### 3.3 更新停车场

**接口地址**: `PUT /parking_lot/update/{id}`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "id": 1,                    // 停车场ID（必填）
  "name": "string",           // 停车场名称（必填）
  "address": "string",        // 地址（必填）
  "img": "string",            // 图片URL（可选）
  "totalSpaces": 100,        // 总车位数（必填）
  "availableSpaces": 50,     // 空闲车位数（必填）
  "distance": 1.5,            // 距离（可选，单位：km）
  "type": 0,                  // 类型（必填，0: 公共停车场, 1: 商务停车场）
  "pricePerHour": 5.0        // 每小时价格（必填）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

### 3.4 删除停车场

**接口地址**: `DELETE /parking_lot/delete/{id}`

**请求头**: 
```
Authorization: Bearer {token}
```

**路径参数**:
- `id`: 停车场ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 4. 共享车位审核

### 4.1 获取共享车位审核列表

**接口地址**: `POST /admin/shared_parking/review/list`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "status": 0,                // 状态筛选（可选，0: 待审核, 1: 已通过, 2: 已拒绝）
  "pageNum": 1,               // 页码（可选，默认1）
  "pageSize": 10              // 每页数量（可选，默认10）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "市中心小区A座地下停车场",
        "address": "市中心小区A座",
        "owner": "张三",
        "ownerId": 10,
        "price": 5.0,
        "totalSpaces": 1,
        "availableSpaces": 1,
        "img": "http://example.com/image.jpg",
        "status": 0,
        "submitTime": "2024-01-15T10:30:00",
        "reviewTime": null,
        "reviewNote": null,
        "description": "位于市中心，交通便利，安全可靠"
      }
    ],
    "total": 5
  }
}
```

### 4.2 审核共享车位

**接口地址**: `POST /admin/shared_parking/review`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "id": 1,                    // 共享车位ID（必填）
  "status": 1,                // 审核状态（必填，1: 通过, 2: 拒绝）
  "reviewNote": "string"      // 审核备注（拒绝时必填，通过时可选）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "审核成功",
  "data": null
}
```

---

## 5. 用户举报管理

### 5.1 获取用户举报列表

**接口地址**: `POST /admin/report/list`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "status": 0,                // 状态筛选（可选，0: 待处理, 1: 已处理）
  "type": "string",            // 举报类型筛选（可选，如：虚假信息、价格欺诈、服务问题、其他）
  "pageNum": 1,               // 页码（可选，默认1）
  "pageSize": 10              // 每页数量（可选，默认10）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "data": [
      {
        "id": 1,
        "type": "虚假信息",
        "title": "车位地址与实际不符",
        "content": "该共享车位标注的地址与实际位置相差较远，导致我无法找到车位，浪费了时间。",
        "reporter": "用户A",
        "reporterId": 5,
        "parkingLotId": 10,
        "parkingLotName": "市中心商业区停车场",
        "reportTime": "2024-01-15T14:30:00",
        "status": 0,
        "handleTime": null,
        "handleNote": null
      }
    ],
    "total": 5
  }
}
```

### 5.2 获取举报详情

**接口地址**: `GET /admin/report/{id}`

**请求头**: 
```
Authorization: Bearer {token}
```

**路径参数**:
- `id`: 举报ID

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "type": "虚假信息",
    "title": "车位地址与实际不符",
    "content": "该共享车位标注的地址与实际位置相差较远，导致我无法找到车位，浪费了时间。",
    "reporter": "用户A",
    "reporterId": 5,
    "parkingLotId": 10,
    "parkingLotName": "市中心商业区停车场",
    "reportTime": "2024-01-15T14:30:00",
    "status": 0,
    "handleTime": null,
    "handleNote": null
  }
}
```

### 5.3 处理举报

**接口地址**: `POST /admin/report/handle`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "id": 1,                    // 举报ID（必填）
  "handleNote": "string"     // 处理备注（可选）
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

### 5.4 删除举报

**接口地址**: `DELETE /admin/report/{id}`

**请求头**: 
```
Authorization: Bearer {token}
```

**路径参数**:
- `id`: 举报ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 6. 数据报表

### 6.1 获取统计数据

**接口地址**: `POST /admin/statistics/overview`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "timeRange": "month",       // 时间范围（可选，today/week/month/year）
  "startDate": "2024-01-01",  // 开始日期（可选，格式：YYYY-MM-DD）
  "endDate": "2024-01-31"     // 结束日期（可选，格式：YYYY-MM-DD）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalParkings": 12450,   // 总停车次数
    "avgOccupancy": 68,       // 平均占用率（百分比）
    "totalRevenue": 186750,   // 总收入
    "sharedCount": 156        // 共享车位数
  }
}
```

### 6.2 获取每日停车流量

**接口地址**: `POST /admin/statistics/daily_flow`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "timeRange": "month",       // 时间范围（可选，today/week/month/year）
  "startDate": "2024-01-01",  // 开始日期（可选，格式：YYYY-MM-DD）
  "endDate": "2024-01-31"     // 结束日期（可选，格式：YYYY-MM-DD）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "date": "2024-01-01",
      "count": 120
    },
    {
      "date": "2024-01-02",
      "count": 145
    }
  ]
}
```

### 6.3 获取热门时段统计

**接口地址**: `POST /admin/statistics/peak_hours`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "timeRange": "month",       // 时间范围（可选，today/week/month/year）
  "startDate": "2024-01-01",  // 开始日期（可选，格式：YYYY-MM-DD）
  "endDate": "2024-01-31"     // 结束日期（可选，格式：YYYY-MM-DD）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "time": "08:00-10:00",
      "count": 450
    },
    {
      "time": "10:00-12:00",
      "count": 320
    }
  ]
}
```

### 6.4 获取车位使用率趋势

**接口地址**: `POST /admin/statistics/occupancy_trend`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "timeRange": "month",       // 时间范围（可选，today/week/month/year）
  "startDate": "2024-01-01",  // 开始日期（可选，格式：YYYY-MM-DD）
  "endDate": "2024-01-31"     // 结束日期（可选，格式：YYYY-MM-DD）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "period": "第1周",
      "rate": 65
    },
    {
      "period": "第2周",
      "rate": 68
    }
  ]
}
```

### 6.5 获取停车场使用排行

**接口地址**: `POST /admin/statistics/parking_lot_rank`

**请求头**: 
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "timeRange": "month",       // 时间范围（可选，today/week/month/year）
  "startDate": "2024-01-01",  // 开始日期（可选，格式：YYYY-MM-DD）
  "endDate": "2024-01-31"     // 结束日期（可选，格式：YYYY-MM-DD）
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "市中心商业区停车场",
      "address": "市中心商业街123号",
      "usage": 2340
    },
    {
      "id": 2,
      "name": "购物中心停车场",
      "address": "万达广场",
      "usage": 1890
    }
  ]
}
```

---

## 7. 车位实时状态

### 7.1 获取所有停车场的实时状态

**接口地址**: `GET /admin/parking/status`

**请求头**: 
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "市中心商业区停车场",
      "address": "市中心商业街123号",
      "totalSpots": 200,
      "availableSpots": 45,
      "status": "active",
      "occupancyRate": 77.5
    },
    {
      "id": 2,
      "name": "火车站停车场",
      "address": "火车站广场",
      "totalSpots": 150,
      "availableSpots": 12,
      "status": "active",
      "occupancyRate": 92.0
    }
  ]
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，token无效或已过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项

1. 所有需要认证的接口都必须在请求头中携带 `Authorization: Bearer {token}`
2. 时间格式统一使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss`
3. 日期格式使用：`YYYY-MM-DD`
4. 分页参数 `pageNum` 从 1 开始
5. 所有金额单位统一为元（人民币）
6. 距离单位统一为公里（km）
7. 占用率、使用率等百分比数据，前端显示时需要加上 `%` 符号

---

## 接口测试建议

### 使用 Postman 或类似工具测试

1. 首先调用登录接口获取 token
2. 将 token 添加到后续所有请求的请求头中
3. 按照接口文档逐个测试各个功能

### 测试顺序建议

1. 管理员登录
2. 获取数据概览统计
3. 获取停车场列表
4. 创建/更新/删除停车场
5. 获取共享车位审核列表
6. 审核共享车位
7. 获取用户举报列表
8. 处理举报
9. 获取统计数据
10. 获取车位实时状态
