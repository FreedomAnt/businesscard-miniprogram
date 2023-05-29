import {
  getOpenIdByLoginCode,
  getInfoByOpenId,
  getInfoByPhoneNum,
} from "../../services/home.js";
import { config } from "../../config/config.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.URL_IMG,
    isLogin: 0,
    stickyBgColor: "transparent",
    openid: "",
    curOpenid: "",
    employee: {},
    department: {},
    company: {},
    projects: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.getInfoByOpenIdFn(options.id);
    } else {
      this.getOpenId();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (this.data.curOpenid && this.data.employee) {
      return {
        path: `/pages/home/index?id=${this.data.curOpenid}`,
        title: `${this.data.employee.name}的名片`,
      };
    }
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function () { },

  /**
   * 获取openid
   */
  getOpenId() {
    const _this = this;
    let openid = wx.getStorageSync("openid");
    if (!openid) {
      wx.login({
        success: function (res) {
          getOpenIdByLoginCode({
            code: res.code,
          }).then((res) => {
            if (res.code === 2000) {
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
   * 根据openid获取信息
   * @param {String} openid
   */
  getInfoByOpenIdFn(openid) {
    const _this = this;
    _this.setData({
      curOpenid: openid,
    });
    getInfoByOpenId({
      openid,
    }).then((res) => {
      if (res.code === 2000) {
        const { employee, department, company, projects } = res.data;
        _this.setData({
          isLogin: 1,
          employee,
          department,
          company,
          projects,
        });
      } else {
        _this.setData({
          isLogin: 2,
        });
        if (res.code === 2012) {
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      }
    });
  },

  /**
   * 点击获取手机号的函数
   */
  getPhoneNumber(e) {
    if (!e.detail.code) {
      return;
    }
    const _this = this;
    getInfoByPhoneNum({
      openid: _this.data.openid,
      code: e.detail.code,
    }).then((res) => {
      if (res.code === 2000) {
        const { employee, department, company, projects } = res.data;
        _this.setData({
          isLogin: 1,
          openid: res.data.openid,
          employee,
          department,
          company,
          projects,
        });
      } else {
        _this.setData({
          isLogin: 2,
        });
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
      }
    });
  },

  /**
   * 复制邮箱
   */
  copyEmail() {
    wx.setClipboardData({
      data: this.data.employee.email,
      success(res) {
        wx.showToast({
          title: "电子邮件已复制",
        });
      },
    });
  },

  /**
   * 跳转网页
   */
  toWeb() {
    wx.navigateTo({
      url: `/pages/website/index?url=${this.data.company.website}`,
    });
  },

  /**
   * 跳转地图
   */
  toMap() {
    wx.openLocation({
      latitude: 29.333552,
      longitude: 104.835784,
      scale: 18,
      name: this.data.company.address,
      address: "点击右侧按钮选择导航方案",
    });
  },

  /**
   * 点击项目事件
   * @param {event} e 事件
   */
  clickProject(e) {
    wx.navigateTo({
      url: `/pages/projectDetail/index?id=${e.currentTarget.dataset.project.id}`,
    });
  },

  /**
   * 拨打电话事件
   * @param {event} e 事件
   */
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.employee.phonenumber,
    });
  },

  /**
   * 保存电话号码事件
   * @param {event} e 事件
   */
  savePhoneCall(e) {
    const _this = this;
    const scope = "scope.addPhoneContact";
    wx.getSetting({
      success(res) {
        const currentScope = res.authSetting[scope];
        if (currentScope === null || currentScope === undefined) {
          wx.authorize({
            scope,
            success() {
              _this.savePhoneCallFn();
            },
          });
        } else if (currentScope === false) {
          wx.showModal({
            title: "保存名片",
            content: "请允许我们添加联系人至通讯录",
            cancelText: "取消",
            confirmText: "去设置",
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting[scope]) {
                      _this.savePhoneCallFn();
                    }
                  },
                });
              }
            },
          });
        } else {
          _this.savePhoneCallFn();
        }
      },
    });
  },

  /**
   * 点击按钮主页
   */
  clickHome() {
    wx.redirectTo({
      url: "/pages/home/index",
    });
  },

  /**
   * 保存电话函数
   */
  savePhoneCallFn() {
    const { name, position, phonenumber, email } = this.data.employee;
    wx.addPhoneContact({
      firstName: name,
      mobilePhoneNumber: phonenumber,
      organization: this.data.company.name,
      title: position,
      email,
    });
  },

  /**
   * 滚动吸顶事件
   * @param {event} e 事件
   */
  onSticky(e) {
    if (e.detail.isFixed) {
      this.setData({
        stickyBgColor: "#003086",
      });
    } else {
      this.setData({
        stickyBgColor: "transparent",
      });
    }
  },
});
