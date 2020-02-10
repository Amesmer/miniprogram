import wepy from 'wepy'

const baseURL='https://www.zhengzhicheng.cn/api/public/v1'
/* 
弹框提示一个无图标的Toast 消息
@str 要提示的消息内容默认值
将方法挂载到wepy上
*/
wepy.baseToast = function(str="获取数据失败") {
    wepy.showToast({
        title:str,
        icon:'none',
        duration:1500
    })
}

/* 
发起get请求的API
@url 请求的地址,为相对路径,必须以 / 开头
@data 请求的参数对象
*/ 
wepy.get = function(url,data={}){
    return wepy.request({
        url: baseURL+url,
        method: 'GET',
        data
    })
}

wepy.post = function(url,data={}){
    return wepy.request({
        url: baseURL+url,
        method: 'post',
        data
    })
}