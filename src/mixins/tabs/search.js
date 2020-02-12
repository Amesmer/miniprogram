import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        // 搜索框中默认内容
        value: '',
        suggestList: [],
        kwList: []
    }
    onLoad() {
        const kwList = wepy.getStorageSync('kw');
        if (kwList != '') {
            console.log(111);
            this.kwList = kwList
        }

    }
    methods = {
        // 搜索关键词发生变化
        onChange(e) {
            this.value = e.detail.trim()
            if (e.detail.trim().length <= 0) {
                this.suggestList = []
                return
            }
            this.getSuggestList(e.detail)
        },
        // 触发了搜索
        onSearch(e) {
            // console.log(e.detail);
            const kw = e.detail.trim()
            if (kw.length <= 0) {
                return
            }
            // 把用户填写的搜索关键词保存到storage中  在头部添加
            // 判断重复
            if (this.kwList.indexOf(kw) === -1) {
                this.kwList.unshift(kw)
            }
            // 截取数组前十位  不会修改原数组  而是返回一个新的数组
            this.kwList = this.kwList.slice(0, 10)
            wepy.setStorageSync('kw', this.kwList);
            wepy.navigateTo({ url: '/pages/goods_list?query=' + kw });
        },
        // 触发了取消
        onCancel() {
            this.suggestList = []
        },
        // 点击搜索建议项,导航到商品详情
        goGoodsDetail(goods_id) {
            wepy.navigateTo({ url: '/pages/goods_detail/main?goods_id=' + goods_id });
        },
        // 点击每个tag标签  导航到商品列表页面,同时把参数传递过去
        goGoodsList(query) {
            wepy.navigateTo({ url: '/pages/goods_list?query=' + query });

        },
        // clear historylist
        clearHistory(){
            this.kwList= []
            wepy.setStorage('kw',[])
            
        }

    }

    // 计算属性
    computed = {
        // true 展示建议列表
        // false 展示搜索建议区域
        isShowHistory() {
            if (this.value.length <= 0) {
                return true
            }
            return false
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