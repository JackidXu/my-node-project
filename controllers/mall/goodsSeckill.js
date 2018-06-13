var handleData = ctx => {
    return ctx
}

var goodsSeckill = async (ctx, next) => {
    await global.request(ctx, {
        path: '/bee/mall/goods/seckill',
    })

    // ctx = handleData(ctx)
    ctx.response.body = ctx.state.resData
}

module.exports = {
    'GET /goods/seckill': goodsSeckill,
    'POST /goods/seckill': goodsSeckill,
}