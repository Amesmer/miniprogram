import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        addressInfo: null,
        cart: [],
        islogin: true
    }
    onLoad() {
        this.addressInfo = wepy.getStorageSync('address') || null;
        // 从购物车列表中 将那些被勾选的商品过滤出来 形成一个新的数组
        const newArr = this.$parent.globalData.cart.filter(x => x.isCheck)
        this.cart = newArr

    }
    methods = {
        // 选择收货地址
        async chooseAddress() {
            const res = await wepy.chooseAddress().catch(err => err)
            console.log(res);
            if (res.errMsg !== 'chooseAddress:ok') {
                return
            }
            this.addressInfo = res
            wepy.setStorageSync('address', res)
            this.$apply()
        },

        // 获取登录信息
        async getUserInfo(userinfo) {
            // 判断是否获取用户信息失败
            if (userinfo.detail.errMsg !== "getUserInfo:ok") {
                return wepy.basetToast("获取用户信息失败!")
            }
            // console.log(userinfo);

            // 获取用户登录的凭证 Code
            const loginRes = await wepy.login()
            // console.log(loginRes);
            if (loginRes.errMsg !== "login:ok") {
                return wepy.baseToast('微信登录失败!')
            }

            // 登录的参数
            const loginParams = {
                code: loginRes.code,
                encryptedData: userinfo.detail.encryptedData,
                iv: userinfo.detail.iv,
                rawData: userinfo.detail.rawData,
                signature: userinfo.detail.signature
            }
            console.log(loginParams);

            // 发起登录的请求,换取登录成功后的Token值
            const { data: res } = await wepy.post('/post/wxlogin', loginParams)
            // console.log(res);
            if (res.meta.status !== 200) {
                return wepy.baseToast('微信登录失败!')
            }
            // 把登录成功之后的token字符串 保存到storage中
            wepy.setStorageSync('token', res.message.token)
            this.islogin = true
            this.$apply()
        },
        // 支付订单
        async onSubmit() {
            // 订单金额不能为空
            if (this.amount <= 0) {
                return wepy.baseToast('订单金额不能为0')
            }
            if (this.addressStr.length <= 0) {
                return wepy.baseToast('请选择收货地址')
            }
            // 1创建订单
            const { data: createResult } = await wepy.post('/my/orders/create', {
                // 订单金额 单位 元
                order_price: '0.01',
                consignee_addr: this.addressStr,
                order_detail: JSON.stringify(this.cart),
                goods: this.cart.map(x => {
                    return {
                        goods_id: x.id,
                        goods_number: x.count,
                        goods_price: x.price
                    }
                })
            })
            // 创建订单失败
            if (createResult.meta.status !== 200) {
                return wepy.baseToast('创建订单失败!')
            }
            // 创建订单成功
            const orderInfo = createResult.message

            // 2生成与预支付订单
            const { data: orderResult } = await wepy.post('/my/orders/req_unifiedorder',
                {
                    order_number: orderInfo.order_number
                })
            // 生成预支付订单失败
            if (orderResult.meta.status !== 200) {
                return wepy.baseToast('生成与支付订单失败')
            }

            // 走支付的流程
            // 3调用微信支付的api
            const payResult = await wepy.requestPayment(orderResult.message.pay)
                .catch(err => err)
            // 用户取消了支付
            if (payResult.errMsg === "requestPayment:fail cancel") {
                return wepy.baseToast('您已经取消了支付')
            }

            // 4用户完成了支付的过程
            // 检查用户支付的结果
            const { data: payCheckResult } = await wepy.post('/my/orders/chkOrder',
                { order_number: orderInfo.order_number })

            if (payCheckResult.meta.status !== 200) {
                return wepy.baseToast('订单支付失败')
            }

            // 5提示用户支付成功
            wepy.showToast({
                title: "支付成功!"
            })

            // 6.跳转到订单列表页面
            wepy.navigateTo({ url: '/pages/orderlist' });

        }

    }
    computed = {
        isHaveAddress() {
            if (this.addressInfo === null) {
                return false
            }
            return true
        },
        addressStr() {
            if (this.addressInfo === null) {
                return
            }
            return this.addressInfo.provinceName +
                this.addressInfo.cityName +
                this.addressInfo.countyName +
                this.addressInfo.detailInfo
        },
        amount() {
            let total = 0
            this.cart.forEach(x => total += x.price * x.count)
            return total * 100
        }
    }
}