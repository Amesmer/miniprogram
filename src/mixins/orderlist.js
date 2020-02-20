import wepy from 'wepy'

export default class extends wepy.mixin {
    data = {
        active: 0,
        // 全部订单列表
        allOrderList: [],
        // 代付款 订单列表
        waitOrderList: [],
        // 已经完成的订单
        finishOrderList: []
    }

    onLoad() {
        this.getOrderList(this.active)
    }

    methods = {
        // 每当切换标签页的时候都会触发这个函数
        tabChanged(e) {
            this.active = e.detail.index
        }
    }
    // 获取订单列表
    async getOrderList(index) {
        const { data: res } = await wepy.get('/my/orders/all', { type: index + 1 })

        if (res.meta.status !== 200) {
            return wepy.baseToast('获取订单列表失败！')
        }

        res.message.orders.forEach(
            x => (x.order_detail = JSON.parse(x.order_detail))
          )
        console.log(res);
        if (index === 0) {
            this.allOrderList = res.message.orders
        } else if (index === 1) {
            this.waitOrderList = res.message.orders
        } else if (index === 2) {
            this.finishOrderList = res.message.orders
        } else {
            wepy.baseToast('订单类型错误！')
        }

        this.$apply()

    }
}