import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    query: '',
    // 商品分类的id
    cid: '',
    // 页码
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 10,
    goodslist: [],
    total: 0,
    // 数据是否加载完毕
    isover: false,
    // 当前数据是否正在请求中
    isloading: false

  }
  onLoad(options) {
    console.log(options);
    this.query = options.query || ''
    this.cid = options.cid || ''
    this.getGoodsList()
  }
  methods = {
    goGoodsDetail(goods_id){
      wepy.navigateTo({ url: '/pages/goods_detail/main?goods_id='+goods_id });
      
    }
  }

  // 获取商品列表数据
  async getGoodsList(cb) {
    this.isloading = true
    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })
    console.log(res)
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    // 展开运算 上拉触底后拼接数组 
    this.goodslist = [...this.goodslist, ...res.message.goods]
    this.total = res.message.total
    this.isloading = false
    this.$apply()
    // 停止下拉刷新的行为 回调函数
    cb && cb()
  }

  // 触底操作
  onReachBottom() {
    // 判断是否正在请求数据  防止重复请求
    if (this.isloading) {
      return
    }
    // console.log("触底了")
    // 先判断是否有下一页的数据
    if (this.pagenum * this.pagesize >= this.total) {
      this.isover = true
      return
    }
    this.pagenum++
    this.getGoodsList()
  }

  onPullDownRefresh() {
    // 初始化必要的字段值
    this.pagenum = 1
    this.total = 0
    this.goodslist = []
    this.isover = this.isloading = false
    // 重新发送请求 传递回调函数
    this.getGoodsList(() => {
      wepy.stopPullDownRefresh();
    })
  }
}