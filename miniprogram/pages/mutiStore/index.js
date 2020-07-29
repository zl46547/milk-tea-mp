// miniprogram/pages/mutiStore/index.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    markers: [],
    multiStore: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.getLocation({
      success: (res) => {
        let {longitude, latitude} = res;
        this.setData({
          longitude,
          latitude,
          markers: [{
            iconPath: '/images/location.png',
            id: 0,
            latitude,
            longitude,
            width: 30,
            height: 30
          }]
        });
        this.getStoreList(longitude, latitude);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
  },

  /**
   * 视野发生变化时
   * @param e
   */
  regionChange (e) {
    if (e.type === 'end') {
      this.getCenterLocation();
    }
  },

  /**
   * 获取当前地图中心的经纬度
   */
  getCenterLocation () {
    this.mapCtx.getCenterLocation({
      success: (res) => {
        this.translateMarker(res);
      }
    });
  },

  /**
   * 平移marker，带动画
   * @param latitude
   * @param longitude
   */
  translateMarker: function ({latitude, longitude}) {
    this.mapCtx.translateMarker({
      markerId: 0,
      duration: 500,
      destination: {
        latitude,
        longitude
      },
      success: () => {
        this.getStoreList(longitude, latitude);
      }
    });
  },

  /**
   * 获取店铺列表
   * @param longitude
   * @param latitude
   */
  getStoreList (longitude, latitude) {
    request({
      url: '/cy/v2/home/multiStoreListForV11',
      data: {
        page: 1,
        type: 1,
        longitude,
        latitude,
        appid: 'wxab7430e6e8b9a4ab'
      },
      method: 'GET'
    }).then((res) => {
      let {multiStore} = res.data;
      this.setData({
        multiStore
      });
    });
  },

  /**
   * 去下单
   */
  toOrder (e) {
    let {store, ordertype} = e.target.dataset;
    wx.setStorage({
      key: 'STORE',
      data: store
    });
    wx.navigateTo({
      url: `/pages/menu/index?orderType=${ordertype}`
    });
  }
});
