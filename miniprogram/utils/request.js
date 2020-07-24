const host = 'https://webapi.qmai.cn/web';
const QM_USER_TOKEN = "Xa9zrvYjshc40-UNjmEOi0YNZfJznjcuWubIuM76ohOB5-ULsbza4DvWoH2P6blz";
const QM_FROM = "wechat";
function request({url, data = {}, method = "GET", defaultLoading = true}) {
    return new Promise((resolve, reject) => {
        if (defaultLoading) {
            wx.showLoading({
                title: 'loading',
                mask:true,
            });
        }
        let errRequest = false;
        let errMsg = "请求失败，请稍后再试";
        wx.request({
            url: host + url,
            data: data,
            method: method,
            header: {
                'Qm-User-Token':QM_USER_TOKEN,
                'Qm-From':QM_FROM,
            },
            success: function (res) {
                if (res.statusCode === 200) {
                    if (res.data.status === false) {
                        errMsg = errCode(res.data.code) || res.data.message || '未知错误';
                        errRequest = true;
                        reject(res.data);
                    } else {
                        resolve(res.data);
                    }
                } else {
                    errMsg = errCode(res.statusCode) || '网络通信异常，请稍后重试';
                    errRequest = true;
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                console.log(err);
                errRequest = true;
                reject(err);
            },
            complete: function () {
                if (defaultLoading) {
                    wx.hideLoading();
                }
                if (errRequest) {
                    wx.showToast({
                        title: errMsg,
                        icon: 'none',
                        mask: true,
                        duration: 2000
                    })
                }
            }
        })
    })
}

//报错信息映射
function errCode(errCode){
    let errMsg='';
    switch (errCode) {
        case 400: errMsg = '请求参数错误！'; break;
        case 401: errMsg = '权限不足！系统已记录本次操作，请勿尝试越权操作！'; break;
        case 403: errMsg = '禁止访问！'; break;
        case 404: errMsg = '请求地址错误!'; break;
        case 500: case 502: case 503: errMsg = '抱歉，系统服务繁忙，请稍后重试！'; break;
        case 504: errMsg = '请求超时，您的网络环境不稳定，请稍后重试！'; break;
        case 58000:errMsg = '业务繁忙，请稍后再试！';break;
        default: errMsg = '';
    }
    return errMsg;
}

export default request