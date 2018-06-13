var setButton = ctx => {
    let resData = ctx.state.resData
    if (!resData || !resData.data || !resData.data.goods) return ctx

    let goods = resData.data.goods || {},
        goodsStyle = resData.data.goodsStyle || [],
        button = resData.data.button = []

    let requestTime = +new Date()

    // 未开售
    if (goods.time_effect * 1000 > requestTime) {
        button.push({
            title: '即将开售',
            sub_title: '',
            single_title: '即将开售',
            class: 'disabled',
            tap: '',
        })

        return ctx
    }

    // 已下架
    if (goods.time_failure * 1000 < requestTime) {
        button.push({
            title: '已下架',
            sub_title: '',
            single_title: '已下架',
            class: 'disabled',
            tap: '',
        })

        return ctx
    }

    // 每个款式按钮
    let styleButton = item => {
        let btn = []

        switch (goods.buy_mode) {

            // 普通商品
            case 0:

            // 秒杀商品 
            case 1:
                btn = [{
                    title: `立即${goods.goods_model_name}`,
                    sub_title: '',
                    single_title: `立即${goods.goods_model_name}`,
                    class: 'disabled',
                    tap: '',
                }]

                break

            // 拼团
            case 2:

            // 新拼团商品
            case 5:
                let goodsFight = resData.data.goodsFight || {},
                    selfFight = goodsFight.selfFight || {},
                    fight = goodsFight.fight || {},
                    fightId = ctx.request.body.fightId

                switch (selfFight.fight_status) {
                    // 自身有团
                    case 1:
                        if (fightId && selfFight.fight_id == fightId) {
                            btn = [{
                                title: `邀请好友`,
                                sub_title: '邀请好友拼团',
                                single_title: `邀请好友`,
                                class: 'normal',
                                tap: 'share',
                            }]
                        } else {
                            btn = [{
                                title: `查看我的团`,
                                sub_title: '',
                                single_title: `查看我的团`,
                                class: 'normal',
                                tap: 'goBackGroup',
                                fightId: selfFight.fight_id
                            }]
                        }

                        break

                    // 自身无团
                    default:

                        // 该团正进行
                        if (fightId && fight.fight_status == 1) {
                            btn = [{
                                title: `￥${item.goods_group_money}`,
                                sub_title: '参与TA的拼团',
                                single_title: `参与TA的拼团`,
                                class: 'normal',
                                tap: 'joinGroup',
                            }]

                            break
                        }

                        // 该团已结束
                        // 是否团长免单
                        if (item.goods_group_money_chief_free == 1) {
                            btn = [{
                                title: `立即免费开团`,
                                sub_title: `${item.goods_group_crowd}人团￥${item.goods_group_money}`,
                                single_title: `${item.goods_group_crowd}人团￥${item.goods_group_money}`,
                                class: 'normal',
                                tap: 'groupBtn',
                            }]
                        } else {
                            btn = [{
                                title: `￥${item.price_quarter}`,
                                sub_title: `直接购买`,
                                single_title: `直接购买`,
                                class: 'weaken',
                                tap: 'buyGroup',
                            }, {
                                title: `￥${item.goods_group_money}`,
                                sub_title: `${item.goods_group_crowd}人成团`,
                                single_title: `${item.goods_group_crowd}人团￥${item.goods_group_money}`,
                                class: 'normal',
                                tap: 'groupBtn',
                            }]
                        }
                }

                break

            default:
                break
        }

        return btn
    }

    // 所有按钮
    let allButtons = () => {
        let checkLabel = (goods.buy_mode == 2 || goods.buy_mode == 5) ? 'stock_task' : 'stock_purchased'
        let styleAbleIndex = -1
        // 已售罄按钮
        let sellOutBtn = [{
            title: '已售罄',
            sub_title: '',
            single_title: '已售罄',
            class: 'disabled',
            tap: '',
        }]

        for (let i = 0, l = goodsStyle.length; i < l; i++) {
            if (goodsStyle[i].stock_storage > goodsStyle[i][checkLabel]) {
                if (styleAbleIndex === -1) styleAbleIndex = i
                button.push(styleButton(goodsStyle[i]))
            } else {
                button.push(sellOutBtn)
            }
        }

        goods.style_able_index = styleAbleIndex === -1 ? 0 : styleAbleIndex

        return button
    }

    allButtons()

    return ctx
}

var handleData = ctx => {
    setButton(ctx)

    // 富文本编辑模式
    if (ctx.state.resData.data) {
        ctx.state.resData.data.editType = 1
    }

    // 并发数计数
    ctx.state.resData.counter = ++global.counter

    return ctx
}

var goodsItem = async (ctx, next) => {
    await global.request(ctx, {
        path: '/bee/mall/goods/item',
    })

    ctx = handleData(ctx)
    ctx.response.body = ctx.state.resData
}

module.exports = {
    'GET /goods/item': goodsItem,
    'POST /goods/item': goodsItem,
}