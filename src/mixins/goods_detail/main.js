import wepy from 'wepy'
export default class extends wepy.mixin {
    data={
        goods_id:'',
        // 商品详情
        goodsInfo:{},
        // 地址对象
        addressInfo:null
    }
    onLoad(options) {
        console.log(options)
        this.goods_id=options.goods_id
        this.getGoodsInfo()
      }


      methods={
        preview (current){
            wepy.previewImage({
                //需要预览的图片链接列表,
              urls: this.goodsInfo.pics.map(x=>x.pics_big), 
              current:current
            });
            
        },

        async chooseAddress(){
            const res= await wepy.chooseAddress().catch(err=>err)
            if(res.errMsg !== 'chooseAddress:ok'){
                return wepy.baseToast('获取收货地址失败!')
            }
            this.addressInfo = res 
            wepy.setStorageSync('address',res)
            this.$apply()
        },

        // 商品添加到购物车列表
        addToCart(){
            // console.log(this.goodsInfo);
            // console.log(this.$parent);
            this.$parent.addGoodsToCart(this.goodsInfo)
            // 提示用户加入购物车成功
            wepy.showToast({
                title:'已加入购物车',
                icon:'success'
            })
            
        }
      }

      computed = {
          addressStr(){
              if(this.addressInfo === null){
                  return '请选择收货地址'
              }
              const addr =this.addressInfo
              const str = addr.provinceName + addr.cityName
              +addr.countyName+addr.detailInfo
              return str
          },
        //   全局的购物车数量获取过来
          total(){
              return this.$parent.globalData.total
          }
      }
    //   获取商品详情数据
   async getGoodsInfo(){
     const{data:res}=  await wepy.get('/goods/detail',{goods_id:this.goods_id})
    if(res.meta.status !== 200){
        return wepy.baseToast()
    }
    this.goodsInfo = res.message
    this.$apply()
    }
}