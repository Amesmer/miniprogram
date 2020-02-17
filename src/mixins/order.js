import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        addressInfo: null
    }
    onLoad() {
        this.addressInfo = wepy.getStorageSync('address') || null;

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
    computed={
        isHaveAddress(){
            if(this.addressInfo === null){
                return false
            }
            return true
        }
    }
}