import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        cateList: [],
        // 默认被激活的索引项
        active: 0,
        // current screen height
        wh: 0,
        // 所有的二级分类
        secondCate: []
    }
    onLoad() {
        this.getWindowHeight()
        this.getCateList()
    }
    methods = {
        onChange(e) {
            console.log(e.detail)
            this.secondCate = this.cateList[e.detail].children
        },
        goGoodsList(cid) {
            console.log(cid);
            wepy.navigateTo({ url: '/pages/goods_list?cid='+cid });
            
        }
    }
    // 获取分类数据
    async getCateList() {
        const { data: res } = await wepy.get('/categories')
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.cateList = res.message
        // 默认渲染的二级分类
        this.secondCate = res.message[this.active].children
        this.$apply()
    }
    // 动态获取屏幕高度
    async getWindowHeight() {
        const res = await wepy.getSystemInfo()
        console.log(res)
        if (res.errMsg === 'getSystemInfo:ok') {
            this.wh = res.windowHeight
            this.$apply()
        }

    }
}