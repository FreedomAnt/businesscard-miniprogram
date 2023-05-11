/**
 * request 接口请求公共部分
 * @param {Object} params 请求参数
 */
export function request(params) {
  let { url, headers, data, method = "GET" } = params;
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      header: {
        // token: wx.getStorageSync("token"),
        // "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      dataType: "json",
      // responseType: "text",
      success: function (res) {
        resolve(res.data);
      }
    });
  })
}
