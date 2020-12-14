// pages/databaseGuide/databaseGuide.js

const app = getApp()
const db = wx.cloud.database()
Page({

  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },
  // 新增
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('user').add({
      data: {
        userName: 'yh2',
        avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eohXtqak5uoub1r3DgSsKVO07bmSYR95FwkOGKviaNJaLrDILUVicfhruVq2mPwBV2xSVlU2gAyZ1sQ/132",
        city: "Wuhan",
        country: "China",
        gender: 1,
        language: "zh_CN",
        nickName: "yh",
        province: "Hubei"
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          userName: 'yh2'
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  // 查询
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _id: 'b1a52c595fc0d119008492ad68d17b33'
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  // 修改
  onCounterInc: function() {
    const db = wx.cloud.database()
    db.collection('user').doc('0bcbdde05fc0d018005b032c3dcce742').update({
      data: {
        nickName : 'yanghao'
      },
      success: res => {
        wx.showToast({
          title: '修改成功！',
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  // 删除
  onRemove: function() {
    const db = wx.cloud.database()
    db.collection('user').doc('b1a52c595fc0d69a0084e722535673bb').remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          counterId: '',
          count: null,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  bindGetUserInfo(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          wx.getUserInfo({
            success: res => {
              //存用户信息
              //console.log(res.userInfo)
              db.collection('user').add({
                data: {
                  userName: res.userInfo.userName,
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                success: res => {
                  // 在返回结果中会包含新创建的记录的 _id
                  wx.showToast({
                    title: '授权成功！',
                  })
                  //console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '新增记录失败'
                  })
                  //console.error('[数据库] [新增记录] 失败：', err)
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else{
          wx.showToast({
            title: '请点击确认允许授权~',
            icon : 'none'
          })
        }
      } 
    })
  },
  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})
