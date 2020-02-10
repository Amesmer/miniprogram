import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        // 轮播图数据默认为空数组
        swiperList: [],
        cateItems: [],
        floordata: []
    }

    onLoad() {
        this.getSwiperdata()
        this.getCateItems()
        this.getFloordata()
    }
    methods = {
        // 点击楼层中的每一张图片
        goGoodsList(url) {
            wepy.navigateTo({
                url
            })
        }
    }
    // 获取轮播图数据
    async getSwiperdata() {
        const { data: res } = await wepy.get('/home/swiperdata')
        console.log(res)
        if (res.meta.status !== 200) {
            return wx.showToast({
                title: '数据获取失败',
                icon: 'none',
                duration: 1500
            })
        }
        this.swiperList = res.message
        this.$apply()
    }
    // 获取首页分类相关的数据项
    async getCateItems() {
        const { data: res } = await wepy.request({
            url: 'https://www.zhengzhicheng.cn/api/public/v1/home/catitems',
            method: 'GET',
            data: {}
        })
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.cateItems = res.message
        this.$apply()
    }

    // 获取楼层数据
    async getFloordata() {
        const { data: res } = await wepy.get('/home/floordata')
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.floordata = res.message
        this.$apply()
        console.log(this.floordata)
    }

}