/**
 * request 接口请求公共部分
 * @param {Object} params 请求参数
 */
export function request(params) {
  let { url, header, data, method = "GET" } = params;
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      header,
      dataType: "json",
      success: function (res) {
        resolve(res.data);
      },
      fail: function (res) {
        wx.showToast({
          title: "请求失败!",
          icon: "error",
        });
      },
    });
  });
}
