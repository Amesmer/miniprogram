import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        addressInfo: null,
        cart:[]
    }
    onLoad() {
        this.addressInfo = wepy.getStorageSync('address') || null;
        // 从购物车列表中 将那些被勾选的商品过滤出来 形成一个新的数组
        const newArr =this.$parent.globalData.cart.filter(x=>x.isCheck)
        this.cart=newArr

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
        }
    }
}