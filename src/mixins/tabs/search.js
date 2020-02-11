import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        suggestList: [],
        kwList:[]
    }
    onLoad() {
       const kwList = wxwepy.getStorageSync({ key: 'kw' });
        
    }
    methods = {
        // 搜索关键词发生变化
        onChange(e) {
            if (e.detail.trim().length <= 0) {
                this.suggestList = []
                return
            }
            this.getSuggestList(e.detail)
        },
        // 触发了搜索
        onSearch(e) {
            // console.log(e.detail);
            if (e.detail.trim().length <= 0) {
                return
            }
            wepy.navigateTo({ url: '/pages/goods_list?query=' + e.detail.trim() });
        },
        // 触发了取消
        onCancel() {
            this.suggestList = []
        },
        // 点击搜索建议项,导航到商品详情
        goGoodsDetail(goods_id) {
            wepy.navigateTo({ url: '/pages/goods_detail/main?goods_id=' + goods_id });

        }

    }

    // 获取搜索建议列表
    async getSuggestList(searchstr) {
        const { data: res } = await wepy.get('/goods/qsearch',
            { query: searchstr })
        if (res.meta.status !== 200) {
            return wepy.baseToast()
        }
        this.suggestList = res.message
        this.$apply()

    }
}