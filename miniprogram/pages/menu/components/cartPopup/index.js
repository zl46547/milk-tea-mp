// pages/menu/components/cartPopup/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    cartPopupVisible: {
      type: Boolean,
      value: true
    },
    cart: {
      type: Boolean,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 清空购物车
     */
    handleCartClear () {
      wx.showModal({
        title: '提示',
        content: '确定清空购物车么',
        success: ({confirm}) =>  {
          if (confirm) {
            this.triggerEvent('clearCart');
          }
        }
      });
    }
  }
});
