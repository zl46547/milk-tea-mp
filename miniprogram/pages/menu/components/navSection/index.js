// pages/menu/components/navSection/index.js
Component({
  lifetimes: {
    attached: function () {
      try {
        let store = wx.getStorageSync('STORE');
        if (store) {
          this.setData({
            store
          });
        }
      } catch (e) {
        // Do something when catch error
      }
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    orderType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    store: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    takout () {
      if (this.data.orderType === 'takeout') {return;}

      if (!getApp().globalData.member) {
        wx.navigateTo({url: '/pages/login/login'});
        return;
      }

      wx.navigateTo({
        url: '/pages/address/address?is_choose=true'
      });
    }
  }
});
