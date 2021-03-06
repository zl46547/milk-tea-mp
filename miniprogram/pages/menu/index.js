// miniprogram/pages/menu/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: 'takeout', // 下单类型
    goodDetailModalVisible: false, // 是否饮品详情模态框
    activeGood: {},  // 当前点击的商品
    cart: [],  // 购物车列表
    cartPopupVisible: false, // 购物车弹框

    goods: [], // 所有商品

    loading: true,
    currentCateId: 6905, // 默认分类
    cateScrollTop: 0,
    menuScrollIntoView: '',
    good: {}, // 当前饮品
    category: {}, // 当前饮品所在分类
    sizeCalcState: false
  },

  showGoodDetailModal (e) {
    // this.data.good = JSON.parse(JSON.stringify({...good, number: 1}));
    // this.data.category = JSON.parse(JSON.stringify(item));
    // this.data.goodDetailModalVisible = true;
    let {good} = e.detail;
    this.setData({
      goodDetailModalVisible: true,
      activeGood: good
    });
  },

  /**
   * 关闭商品详情弹框
   */
  closeGoodDetailModal () {
    this.setData({
      goodDetailModalVisible: false
      // category: {},
      // good: {}
    });
  },

  /**
   * 改变goods
   * @param e
   */
  changeGood (e) {
    let {good} = e.detail;
    this.setData({
      activeGood: good
    });
  },

  /**
   * 添加到购物车
   */
  handleAddToCart (e) {
    let {product} = e.detail;
    let cart = this.data.cart;
    const index = cart.findIndex((item) => {
      if (product.use_property) {
        return (item.id === product.id) && (item.props_text === product.props_text);
      } else {
        return item.id === product.id;
      }
    });
    if (index > -1) {
      cart[index].number += product.number;
    } else {
      cart.push(product);
    }
    this.setData({
      cart
    });
  },

  /**
   * 打开购物车弹框
   */
  openCartPopup () {	// 打开/关闭购物车列表popup
    this.setData({
      cartPopupVisible: true
    });
  },

  /**
   * 清空购物车
   */
  clearCart () {
    this.setData({
      cartPopupVisible: false,
      cart: []
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // async onLoad (e) {
  //   let {orderType} = e;
  //   if (orderType) {
  //     this.setData({
  //       orderType
  //     });
  //   }
  //   console.log(e);
  //   // await this.init()
  // },
  // async init () {	// 页面初始化
  //   this.data.loading = true;
  //   await this.getStore();
  //   this.goods = await this.$api('goods');
  //   this.data.loading = false;
  //   this.cart = wx.getStorageSync('cart') || [];
  // },
  takout () {
    if (this.orderType == 'takeout') {return;}

    if (!this.data.isLogin) {
      wx.navigateTo({url: '/pages/login/login'});
      return;
    }

    wx.navigateTo({
      url: '/pages/address/address?is_choose=true'
    });
  },
  handleMenuTap (id) {	// 点击菜单项事件
    if (!this.data.sizeCalcState) {
      this.calcSize();
    }

    this.data.currentCateId = id;
    // this.$nextTick(() => this.data.cateScrollTop = this.goods.find(item => item.id == id).top)
  },
  handleGoodsScroll ({detail}) {	// 商品列表滚动事件
    if (!this.sizeCalcState) {
      this.calcSize();
    }
    const {scrollTop} = detail;
    let tabs = this.goods.filter((item) => item.top <= scrollTop).reverse();
    if (tabs.length > 0) {
      this.data.currentCateId = tabs[0].id;
    }
  },
  calcSize () {
    let h = 10;

    let view = wx.createSelectorQuery().select('#ads');
    view.fields({
      size: true
    }, (data) => {
      h += Math.floor(data.height);
    }).exec();

    this.goods.forEach((item) => {
      let view = wx.createSelectorQuery().select(`#cate-${item.id}`);
      view.fields({
        size: true
      }, (data) => {
        item.top = h;
        h += data.height;
        item.bottom = h;
      }).exec();
    });
    this.sizeCalcState = true;
  },

  handleReduceFromCart (item, good) {
    const index = this.data.cart.findIndex((item) => item.id === good.id);
    this.data.cart[index].number -= 1;
    if (this.data.cart[index].number <= 0) {
      this.data.cart.splice(index, 1);
    }
  },

  // changePropertyDefault (index, key) { // 改变默认属性值
  //   this.data.good.property[index].values.forEach((value) => this.$set(value, 'is_default', 0));
  //   this.data.good.property[index].values[key].is_default = 1;
  //   this.data.good.number = 1;
  // },
  getGoodSelectedProps (good, type = 'text') {	// 计算当前饮品所选属性
    if (good.use_property) {
      let props = [];
      good.property.forEach(({values}) => {
        values.forEach((value) => {
          if (value.is_default) {
            props.push(type === 'text' ? value.value : value.id);
          }
        });
      });
      return type === 'text' ? props.join('，') : props;
    }
    return '';
  },
  handlePropertyAdd () {
    this.data.good.number += 1;
  },
  handlePropertyReduce () {
    if (this.data.good.number === 1) {return;}
    this.data.good.number -= 1;
  },
  handleAddToCartInModal () {
    const product = Object.assign({}, this.data.good, {props_text: this.getGoodSelectedProps(this.good), props: this.getGoodSelectedProps(this.good, 'id')});
    this.handleAddToCart(this.data.category, product, this.good.number);
    this.closeGoodDetailModal();
  },
  handleCartClear () {	// 清空购物车
    wx.showModal({
      title: '提示',
      content: '确定清空购物车么',
      success: ({confirm}) =>  {
        if (confirm) {
          this.cartPopupVisible = false;
          this.cart = [];
        }
      }
    });
  },
  handleCartItemAdd (index) {
    this.cart[index].number += 1;
  },
  handleCartItemReduce (index) {
    if (this.cart[index].number === 1) {
      this.cart.splice(index, 1);
    } else {
      this.cart[index].number -= 1;
    }
    if (!this.cart.length) {
      this.cartPopupVisible = false;
    }
  },
  toPay () {
    if (!this.isLogin) {
      wx.navigateTo({url: '/pages/login/login'});
      return;
    }

    wx.showLoading({title: '加载中'});
    wx.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)));

    wx.navigateTo({
      url: '/pages/pay/pay'
    });
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
