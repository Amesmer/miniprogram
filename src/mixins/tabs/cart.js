import wepy from 'wepy'
export default class extends wepy.mixin {
    data = {
        // 购物车上商品列表
        cart: []
    }
    onLoad() {
        this.cart = this.$parent.globalData.cart
    }
    methods = {
        // 监听商品变化数量
        onChange(e) {
            // 当前数量
            console.log(e.detail);
            // 当前id
            console.log(e.target.dataset.id);
            const id=e.target.dataset.id
            const count=e.detail
            // 跟新全局的购物车数据
            this.$parent.updateGoodsCount(id, count)
        },

        // 状态改变
        statusChanged(e){
            // console.log(e)
            const status=e.detail
            const id =e.target.dataset.id
            this.$parent.updateGoodsStatus(id,status)
        },
        // 删除商品
        close(id) {
            this.$parent.removeGoodsById(id)
          },
        //   全选按钮
          onFullCheckChanged(e){
           this.$parent.updateAllGoodsStatus(e.detail)
          },
        //   提交购物车
          submitOrder(){
            if(this.amount<=0){
                return wepy.baseToast("订单金额不能为空!")
            }
            wepy.navigateTo({ url: '/pages/order' });
            
          }

    }
    computed = {
        // 判断购物车是否为空
        isEmpty() {
            if (this.cart.length <= 0) {
                return true
            }
            return false
        },

        // 总价格,单位是分
        amount(){
            let total = 0
            this.cart.forEach(x=>{
                if(x.isCheck){
                    total+=x.price*x.count
                }
            })
            // 元换分
            return  total*100
        },
        // 是否全选
        isFullChecked(){
            // 获取所有商品的个数
            const allcount = this.cart.length
            let c=0
            this.cart.forEach(x=>{
                if(x.isCheck){
                    c++
                }
            })
            return allcount === c
        }
    }
}