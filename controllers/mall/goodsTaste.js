var sellOutStatus = ctx => {
	let resData = ctx.state.resData

	if (resData.data && resData.data.goods) { 
		resData.data.goods.forEach((goodsItem) => {
			let checkLabel = goodsItem.buy_mode == 2 
							 ? 'stock_task' 
							 : 'stock_purchased'
			
			goodsItem.sell_out_status = 0

			for ( let i = 0, l = goodsItem.r_goods_style.length; i < l; i++ ) {
				let styleItem = goodsItem.r_goods_style[i]
				if (styleItem.stock_storage > styleItem.checkLabel) {
					goodsItem.sell_out_status = 1
					break
				}
			}
		})
	}
	
	return ctx
}

var handleData = ctx => {
	sellOutStatus(ctx)
    return ctx
}

var goodsTaste = async (ctx, next) => {
    await global.request(ctx, {
        path: '/bee/mall/goods/taste',
    })

    ctx = handleData(ctx)
    ctx.response.body = ctx.state.resData
}

module.exports = {
    'GET /goods/taste': goodsTaste,
    'POST /goods/taste': goodsTaste,
}