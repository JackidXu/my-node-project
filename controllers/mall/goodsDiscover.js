var handleData = ctx => {
    return ctx
}

var goodsDiscover = async (ctx, next) => {
    await global.request(ctx, {
        path: '/bee/mall/goods/discover',
    })

    // ctx = handleData(ctx)
    ctx.response.body = ctx.state.resData
}

module.exports = {
    'GET /goods/discover': goodsDiscover,
    'POST /goods/discover': goodsDiscover,
}