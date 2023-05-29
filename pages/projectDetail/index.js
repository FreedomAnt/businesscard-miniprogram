import { getProject } from "../../services/home.js";
import { config } from "../../config/config.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.URL_IMG,
    isLoad: 0,
    project: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.getProjectInfo(options.id);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function () { },

  getProjectInfo(id) {
    const _this = this;
    getProject({
      id,
    }).then((res) => {
      if (res.code === 2000) {
        _this.setData({
          isLoad: 1,
          project: res.data,
        });
      } else {
        _this.setData({
          isLoad: 2,
        });
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
      }
    });
  },

  /**
   * 预览图片
   * @param {event} e 点击事件
   */
  previewImage(e) {
    wx.previewImage({
      urls: this.data.project.pictures.map((item) => this.data.imgUrl + item),
      current: e.currentTarget.dataset.url,
    });
  },
});
