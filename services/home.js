import { request } from "../utils/request";
import { config } from "../config/config";

/**
 * 根据loginCode获取openid
 * @param {Object} param 参数
 */
export function getOpenIdByLoginCode(param) {
  return request({
    url: config.getOpenIdByLoginCodeUrl,
    method: "POST",
    data: param,
  });
}

/**
 * 根据openid获取信息
 * @param {Object} param 参数
 */
export function getInfoByOpenId(param) {
  return request({
    url: config.getInfoByOpenIdUrl,
    method: "POST",
    data: param,
  });
}

/**
 * 根据phonecode获取信息
 * @param {Object} param 参数
 */
export function getInfoByPhoneNum(param) {
  return request({
    url: config.getInfoByPhoneNumUrl,
    method: "POST",
    data: param,
  });
}

/**
 * 根据项目信息获取项目
 * @param {Object} param 参数
 */
export function getProject(param) {
  return request({
    url: config.getProjectUrl,
    data: param,
  });
}
