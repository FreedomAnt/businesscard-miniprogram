import { getOpenIdByLoginCode, getInfoByOpenId, getInfoByPhoneNum } from "../../services/home.js";
import { config } from "../../config/config.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.URL_IMG,
    isLogin: false,
    openid: '',
    employee: {},
    department: {},
    company: {},
    projects: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this;
    let openid = wx.getStorageSync("openid");
    if (!openid) {
      wx.login({
        success: function (res) {
          getOpenIdByLoginCode({
            code: res.code,
          }).then((res) => {
            if (res.code == 2000) {
              openid = res.data.openid;
              wx.setStorageSync("openid", res.data.openid);
              _this.setData({
                openid,
              });
              _this.getInfoByOpenIdFn(openid);
            } else {
              wx.showToast({
                title: res.msg,
                icon: "none",
              });
            }
          });
        },
      });
    } else {
      _this.setData({
        openid,
      });
      _this.getInfoByOpenIdFn(openid);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  /**
   * 根据openid获取信息
   * @param {String} openid
   */
  getInfoByOpenIdFn(openid) {
    const _this = this;
    getInfoByOpenId({
      openid,
    }).then((res) => {
      if (res.code == 2000) {
        const { employee, departmentInfo, projects } = res.data;
        _this.setData({
          isLogin: true,
          employee,
          department: departmentInfo,
          company: departmentInfo.company,
          projects
        });
      } else if (res.code == 2012) {

      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
      }
    });
  },

  /**
   * 点击获取手机号的函数
   */
  getPhoneNumber(e) {
    const _this = this;
    getInfoByPhoneNum({
      openid: _this.data.openid,
      code: e.detail.code,
    }).then((res) => {
      if (res.code == 2000) {
        const { employee, departmentInfo, projects } = res.data;
        _this.setData({
          isLogin: true,
          openid: res.data.openid,
          employee,
          department: departmentInfo,
          company: departmentInfo.company,
          projects
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
      }
    });
  }
});
