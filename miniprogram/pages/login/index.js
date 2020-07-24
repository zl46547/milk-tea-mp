// miniprogram/pages/login/index.js
import Member from '../../api/member'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.name = "王二麻子";
    getApp().globalData.favorite = "集邮";
  // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: ({userInfo}) => {
              let member = {
                ...Member,
                ...userInfo
              }
              getApp().globalData.member = member
              this.setData({
                member
              })
            }
          })
        }
      }
    })
  },

  /**
   * 获取用户信息
   * @param e
   * @returns {Promise<void>}
   */
  async getUserInfo(e) {
    const {errMsg, userInfo} = e.detail
    if(errMsg !== "getUserInfo:ok") {
      wx.showModal({
        title: '提示',
        content: '您取消了授权登录，请重新授权',
        showCancel: false
      })
      return false
    } else {
      let member = {
        ...Member,
        ...userInfo
      }
      getApp().globalData.member = member
      this.setData({
        member
      })
      this.onGetOpenid()
    }
  },
  /**
   * 获取openId
   */
  onGetOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        getApp().globalData.openid = res.result.openid
        wx.navigateBack({
          delta: 10,
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateBack({
          delta: 10,
        })
      }
    })
  }
})