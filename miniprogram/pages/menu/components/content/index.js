// pages/menu/components/content/index.js
import request from '../../../../utils/request';
import {APP_ID} from '../../../../utils/constant';
import { throttle} from '../../../../utils/tools';

Component({
  lifetimes: {
    attached: function () {
      this.getGoodsList();
      this.getAdvLIst();
    }
  },
  observers: {
    'cart': function( obj) {
      this.menuCartNum()
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cart:{
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: [],
    currentCateId: 6387,
    cateScrollTop: 0,
    sizeCalcState: false,
    goodCartNum: 0  // 购物车数量
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 点击菜单项事件
     * @param e
     */
    handleMenuTap (e) {
      let {id} = e.currentTarget.dataset;
      if (!this.data.sizeCalcState) {
        this.calcSize();
        return false;
      }
      let cateScrollTop = this.data.goods.find((item) => item.id === id).top;
      this.setData({
        currentCateId: id,
        cateScrollTop
      });
    },

    /**
     * 获取每个分类内容的高度
     */
    calcSize () {
      let h = 10;
      // wx.createSelectorQuery()
      // 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。
      // 获取轮播图的高度
      let view = this.createSelectorQuery().select('#ads');
      view.fields({
        size: true
      }, (data) => {
        h += Math.floor(data.height);
      }).exec();

      // 获取每一个分类项的高度
      let newGoods = this.data.goods.map((item) => {
        let view = this.createSelectorQuery().select(`#cate-${item.id}`);
        view.fields({
          size: true
        }, (data) => {
          item.top = h;
          h += data.height;
          item.bottom = h;
        }).exec();
        return item;
      });
      this.setData({
        sizeCalcState: true,
        goods: newGoods
      });
    },

    /**
     * 获取轮播图数据
     * @returns {boolean}
     */
    getAdvLIst () {
      let store = wx.getStorageSync('STORE');
      if (!store) {
        wx.showToast({
          title: '未获取到店铺信息！',
          icon: 'none',
          mask: true,
          duration: 2000
        });
        return false;
      }
      request({
        url: '/marketing/advertise/ads',
        data: {
          show_place: 1,
          appid: APP_ID
        },
        header: {
          'multi-store-id': store.id
        },
        method: 'GET'
      }).then((res) => {
        // console.log(res);
        if (res.data) {
          this.setData({
            advImages: res.data.images
          });
        }
      });
    },

    /**
     * 获取商品列表页面
     */
    getGoodsList () {
      request({
        url: '/cy/v3/goods/index',
        data: {
          type: 1,
          appid: APP_ID
        },
        method: 'GET'
      }).then((res) => {
        if (res.data) {
          let result = res.data.data;
          this.setData({
            goods: result.filter((item, index) => index < 3)
          }, () => {
            this.calcSize();
          });
        }
      });
    },

    /**
     * 商品列表滚动事件
     * @param detail
     */
    handleGoodsScroll: throttle(function ({detail}) {
      if (!this.data.sizeCalcState) {
        this.calcSize();
      }
      const {scrollTop} = detail;
      let tabs = this.data.goods.filter((item) => item.top <= scrollTop).reverse();
      if (tabs.length > 0) {
        this.setData({
          currentCateId: tabs[0].id
        });
      }
    }),

    /**
     * 展示商品详情接口
     * @param e
     */
    showGoodDetailModal (e) {
      let {good,cateid} = e.currentTarget.dataset
      let newGood = {
        ...good,
        cateId:cateid,
        number: 1
      }
      this.triggerEvent('showModal', {good:newGood});
    },
    /**
     * 左侧菜单加购数量
     * @returns {function(*): T | number}
     */
    menuCartNum() {
      let {cart,goods} = this.data
      let newGoods = goods.map(item=>{
        item.cartNum = this.data.cart.reduce((acc, cur) => {
          console.log(cur.cateId,item.id)
          if(cur.cateId === item.id) {
            return acc += cur.number
          }
          return acc
        }, 0)
        return item
      })
      this.setData({
        goods:newGoods
      })
    },
  }
});
