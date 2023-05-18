// 当前环境
export const env = "prod";

// 接口地址
const proxy = {
  local: "http://127.0.0.1:7001",
  prod: "https://darsina.28xr.com/",
};

export const config = {
  URL_IMG: proxy[env],
  getOpenIdByLoginCodeUrl: proxy[env] + "/api/common/getOpenIdByLoginCode",
  getInfoByOpenIdUrl: proxy[env] + "/api/common/getInfoByOpenId",
  getInfoByPhoneNumUrl: proxy[env] + "/api/common/getInfoByPhoneNum",
  getProjectUrl: proxy[env] + "/api/common/getProject",
};
