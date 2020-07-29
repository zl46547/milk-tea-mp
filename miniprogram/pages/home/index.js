// miniprogram/pages/home/index.js
import request from '../../utils/request';

let app = getApp(); // 这句是引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: null,
    swiperImages: [],
    bannerImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperImages();
    this.getBannerImage();
  },

  /**
   * 获取首页轮播图
   */
  getSwiperImages () {
    request({
      url: '/marketing/advertise/list',
      data: {
        type: 3
      },
      method: 'GET'
    }).then((res) => {
      let {data} = res.data;
      this.setData({
        swiperImages: data[0].images
      });
    });
  },
  getBannerImage () {
    request({
      url: '/marketing/advertise/detail',
      data: {
        is_home_show: 1,
        type: 2
      },
      method: 'GET'
    }).then((res) => {
      let data = res.data[0];
      this.setData({
        bannerImage: data.images[0].image
      });
    });
  },
  integrals () {
    if (!this.data.member) {
      wx.navigateTo({url: '/pages/login/index'});
      return;
    }
    wx.navigateTo({
      url: '/pages/integrals/index'
    });
  },
  packages () {
    wx.navigateTo({
      url: '/pages/packages/index'
    });
  },
  memberCode () {
    if (!this.data.member) {
      wx.navigateTo({url: '/pages/login/index'});
      return;
    }
    wx.navigateTo({
      url: '/pages/memberCode/index'
    });
  },
  invite () {
    wx.navigateTo({
      url: '/pages/invite/index'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (getApp().globalData.member) {
      this.setData({
        member: getApp().globalData.member
      });
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  takeIn () {
    wx.switchTab({
      url: '/pages/menu/index'
    });
  },
  takeOut () {
    if (!this.data.member) {
      wx.navigateTo({url: '/pages/login/index'});
      return false;
    }
    wx.navigateTo({
      url: '/pages/address/address?is_choose=true'
    });
  }
});
