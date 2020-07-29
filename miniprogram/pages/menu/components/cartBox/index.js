// pages/menu/components/cartBox/index.js
import {MIN_PRICE} from '../../../../utils/constant';

Component({
  observers: {
    'cart': function (obj) {
      this.getCartGoodsNumber();
      this.getCartGoodsPrice();
      this.getPayStatus();
      this.getSpread();
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    cart: {
      type: Array,
      value: []
    },
    orderType: {
      type: String,
      value: 'takeout'
    },
    goodDetailModalVisible: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsNumber: 0,
    goodsPrice: 0,
    spread: 0,
    payStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 计算购物车总数
     * @returns { number}
     */
    getCartGoodsNumber () {
      let goodsNumber =  this.data.cart.reduce((acc, cur) => acc + cur.number, 0);
      this.setData({goodsNumber});
    },

    /**
     * 计算购物车总价
     */
    getCartGoodsPrice () {
      let goodsPrice = this.data.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
      this.setData({goodsPrice});
    },

    /**
     * 是否达到起送价
     * @returns {boolean}
     */
    getPayStatus () {
      let payStatus =  !!(this.data.orderType === 'takeout' && (this.data.goodsPrice > MIN_PRICE));
      this.setData({
        payStatus
      });
    },

    /**
     * 差多少元起送
     * @returns {number}
     */
    getSpread () {
      if (this.data.orderType !== 'takeout') {return;}
      let spread =  parseFloat((MIN_PRICE - this.data.goodsPrice).toFixed(2));
      this.setData({
        spread
      });
    }
  }
});
