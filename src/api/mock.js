// api/mock.js
import pcListData from '../pcList.json'

// 模拟数据
export const mockData = pcListData

// 模拟商品详情数据（从之前分析的data.json中提取）
export const mockProductDetail = (goodsId) => {
    // 这里可以根据goodsId返回对应的模拟数据
    // 由于我们只有一个商品详情示例，可以先返回示例数据
    return {
        code: 200,
        message: "操作成功",
        result: {
            "stockRulesMessage": "",
            "freightAmount": 0.0,
            "specPicList": [],
            "isVirGoodsZC": 0,
            "recommentList": [],
            "evaluateList": [
                {
                    "putTop": 0,
                    "praseNum": 0,
                    "photo": "https://fds.sundan.com/group1/M00/0F/C1/wKgaQWVynliAczODAAHAhGkZ_sQ166.png",
                    "stars": 5,
                    "type": 1,
                    "userName": "s****9",
                    "goodsSpec": null,
                    "imgUrl": "",
                    "isAnonymity": 0,
                    "id": 36513,
                    "browseNum": 0,
                    "evaluate": "游戏机不错，性价比高！开心的一次购物！",
                    "replyComments": null,
                    "createDate": 1765982526000
                }
            ],
            "subsidizedGoodsMap": {
                "subsidizedGoodsFlag": false
            },
            "productView": {
                "pmStartDate": null,
                "pmCountdown": null,
                "store": 8,
                "bn": "319905",
                "saleFlag": null,
                "specValieId": "",
                "saleTime": null,
                "price": 4159.000,
                "couponList": [],
                "name": "【现货】任天堂（Nintendo）Switch二代游戏机NS2掌上主机 单机标准版不含游戏（港版）黑色",
                "goodsPic": "https://fds.sundan.com/group2/M00/08/97/wKgaQWhiKHmAbveQAADJIC-sz-8286.jpg",
                "pmList": [
                    {
                        "pmTag": "优惠券",
                        "endDate": "2026-03-03",
                        "flag3": "0",
                        "beginDatetime": null,
                        "discount": 0,
                        "flag2": "0",
                        "flag1": null,
                        "pmInfo": "买满3000送【26年1月新年薄礼满3000元送100元礼券【特价商品不参与】】",
                        "itemNo": "319905",
                        "itemNum": "3321/",
                        "partsTotalNum": null,
                        "specialType": "7",
                        "num1": "0",
                        "other4": 0,
                        "beginTime": "000000",
                        "id": null,
                        "itemCls3": null,
                        "itemCls2": null,
                        "labelName": null,
                        "other1": 0,
                        "flowId": 125803729,
                        "itemCls1": "D14",
                        "endDateStr": "2026-03-03 00:00:00",
                        "num3": "0",
                        "other3": 0,
                        "num2": "0",
                        "other2": 0,
                        "beginDateStr": "2026-01-16 00:00:00",
                        "backgroundColor": null,
                        "sheetNo": "PI2601152094",
                        "oldPrice": 0,
                        "specPrice": 0,
                        "locationNo": "A1",
                        "beginDate": "2026-01-16",
                        "itemBrand": null,
                        "specName": "买满送券",
                        "soldQty": 0,
                        "loopFlag": false,
                        "endTime": "235959",
                        "lastupdate": 1772455337294,
                        "time": null,
                        "itemStr": "3000/",
                        "saleQty": 100000,
                        "endDatetime": null,
                        "fontColor": null,
                        "branchNo": "2440",
                        "status": 0
                    }
                ],
                "pmEndDate": null,
                "pmPrice": null,
                "stopTime": null,
                "id": 43095
            },
            "url": "goods/goodsDetailsInitPage?id=32971&type=0&cityId=524",
            "isHide": 0,
            "appPreOrderVO": null,
            "appleDiscountFlag": false,
            "total": 1,
            "shopList": [],
            "shoppingGuideList": [
                {
                    "titleId": 11,
                    "title": "选择最适合你的游戏机",
                    "imgUrl": "https://fds.sundan.com/group1/M00/09/C6/wKgaQWPsRGOAaaNGAADdAAeUk1o443.jpg"
                }
            ],
            "userShippingAddressView": {
                "cityName": null,
                "areaName": "",
                "detailedAddress": null,
                "id": null,
                "provinceName": null
            },
            "questionViewList": [],
            "isGift": false,
            "goodsView": {
                "goodsImg": "https://fds.sundan.com/group2/M00/08/97/wKgaQWhiKHmAbveQAADJIC-sz-8286.jpg",
                "cellectCount": 4,
                "description": "● 屏幕更大，色彩更鲜明，动作更流畅\n● 3种游玩模式，游戏更自由\n● 可自由调节，U型镂空支架\n● 除了switch2独占游戏，也兼容Switch游戏\n",
                "serviceIntro": "<p><strong style=\"color: rgb(102, 102, 102);\">厂家服务：</strong><br/></p><p style=\"text-wrap: wrap;\">本产品全国联保，享受三包服务，整机保修 1 年！</p><p style=\"text-wrap: wrap;\">如因质量问题或故障，联系顺电处理。</p><p style=\"text-wrap: wrap;\">顺电售后服务热线：<span style=\"font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif; font-size: 14px; background-color: rgb(255, 255, 255);\">4006788688</span></p><p><br/></p><p><strong>顺电承诺：</strong></p><p>在顺电购买商品，更可享受30天退换货（自购买日起计算），须保证全新未拆封、不影响二次销售（ 手机数码新品、秒杀商品、定购商品、不属于此范围之中），需要买家承担来回运费和保价费！</p><p>顺电售前热线：400-8899-618（09:00-18:00 周一至周日）</p><p>顺电售后电话：400-6788-688（09:00-20:00 周一至周日），<a href=\"https://sdapp.sundan.com/webH5/active/#/afterSale\" target=\"_blank\">了解更多售后政策请点击&gt;&gt;</a></p><p>&nbsp;</p><p><strong>极限词失效协议：</strong></p><p>1、本平台全力支持关于《中华人民共和国广告法》实施的“极限化违禁词”相关规定，且已竭力规避使用相关“违禁词”(如“顶级”、最佳”等极限化词汇)。</p><p>2、故即日起凡本平台商品详情页及商品标题等含有“极限化违禁词”介绍的文字说明，一律非本平台主观意愿并即刻失效，不可用于客户作为下单购物的参考依据，不作为理赔的理由。 对商品描述有疑问的可联系在线客服。</p><p>3、凡顾客购买本平台商品并下单付款，均表示认同此条约，感谢各位顾客的配合！</p><p>&nbsp;</p><p>注：因厂家会在没有任何提前通知的情况下，对产品包装、产地，功能或者一些附件等进行更改，本商城不能确保您收到的货物与商城图片、产地、附件说明完全一致，但是确保为原厂正货，并且保证与当前市场上同样主流新品一致！商品参数信息等，仅供参考，以实物为准。若顺电没有及时更新，请大家谅解！</p>",
                "seoTitle": "【Nintendo Switch任天堂Switch2游戏机】任天堂（Nintendo）Switch游戏机OLED马力欧限定版(红色)",
                "seoKeywords": "Switch2主机,Nintendo Switch任天堂Switch2游戏机,OLED马力欧限定版,任天堂OLED马力欧限定版,任天堂游戏机,任天堂OLED马力欧限定版报价,任天堂游戏机,Nintendo游戏机,游戏机什么牌子好",
                "type": 0,
                "evaluateStart": 0,
                "totalBuyCount": 28,
                "videoUrl": "",
                "price": 4159.000,
                "evaluateCount": 1,
                "details": "<p><img src=\"https://fds.sundan.com/group2/M00/11/74/wKgaQWk_dSuAO55MAAH3Ccc2xHM660.jpg\" title=\"官网_详情模板_添加社群.jpg\" alt=\"官网_详情模板_添加社群.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyANQSVAAFBKLKb6L0417.jpg\" title=\"04.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAReUSAAMGDb4vGqs091.jpg\" title=\"05.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAUU_4AAF-OkJk2lg061.jpg\" title=\"06.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAYWmTAANYej9SexE520.jpg\" title=\"07.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyALJGvAAHtnGAJKGA734.jpg\" title=\"08.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAV7bCAAJCyOKccGg596.jpg\" title=\"09.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAIJQLAAIPnihnGg4332.jpg\" title=\"10.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAU-2zAAHkwUrzcw0609.jpg\" title=\"11.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAfIiAAAHeT_jkc3U637.jpg\" title=\"12.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAby37AAC-N5lrc7I833.jpg\" title=\"13.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyACs8lAAFh4JPAHJA748.jpg\" title=\"14.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAVIzlAAJMcAvT3no709.jpg\" title=\"15.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAXBE6AAKYAhYc0ew220.jpg\" title=\"16.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAWebwAAIlAyOZRNA772.jpg\" title=\"17.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAdn3UAAHytZb4-9I033.jpg\" title=\"18.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAYDquAALphsimjiA235.jpg\" title=\"19.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAe0NzAAKYSof24WI352.jpg\" title=\"20.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAGejCAADqjusFPaA281.jpg\" title=\"21.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAIlJ3AAGPpF-6Y8Q270.jpg\" title=\"22.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAFw3WAAGSIlLRLIg438.jpg\" title=\"23.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAfNWkAAFJZYoEfOE968.jpg\" title=\"24.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyANsqJAAFeddAr1AI652.jpg\" title=\"25.jpg\"/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAfwoAAAOuegU1QfI816.jpg\" title=\"26.jpg\"/></p><p><br/></p><p><br/></p><p><img src=\"https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGXyAeERwAARTnZUOjfE140.jpg\" title=\"29.jpg\"/></p>",
                "pmPrice": 0,
                "id": 32971,
                "stock": 8,
                "goodsName": "【现货】任天堂（Nintendo）Switch二代游戏机NS2掌上主机 单机标准版不含游戏（港版）黑色",
                "serialNumber": "319905",
                "topCatId": "181",
                "seoDescription": "【Nintendo Switch任天堂Switch2游戏机】顺电网上商城www.sundan.com提供任天堂游戏机正品行货，并包括任天堂游戏机网购指南，以及任天堂游戏机图片、任天堂游戏机参数、任天堂游戏机评论、任天堂游戏机心得、任天堂游戏机技巧等信息，网购任天堂游戏机上顺电放心购，全新包邮，正规发票全国联保。\n",
                "topCatName": "智能/娱乐",
                "labelList": [],
                "videoCoverUrl": "",
                "goodsMktprice": 4099.00,
                "picList": [
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/97/wKgaQWhiKHmAbveQAADJIC-sz-8286.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025239,
                        "sort": 2
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/97/wKgaQWhiKC6AcbDlAALmmPsSJxM855.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025236,
                        "sort": 3
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGS2ARzevAAKi45wCgyg708.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025233,
                        "sort": 4
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGS2AFYmuAAGBkYNcC2s307.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025238,
                        "sort": 5
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/6D/wKgaQWheI82AMUwjAAIVfhkdHMs157.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025237,
                        "sort": 6
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/AD/wKgaQWhkgNuAVUNnAAI0aDU7I9I158.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025234,
                        "sort": 7
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGS6ACf-SAAaXH2pxHuU546.png",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025232,
                        "sort": 8
                    },
                    {
                        "picUrl": "https://fds.sundan.com/group2/M00/08/6C/wKgaQWheGS2AfeGWAAM4u5ZhlhE496.jpg",
                        "productId": 43095,
                        "goodsId": 32971,
                        "id": 1025235,
                        "sort": 9
                    }
                ],
                "pmList": [
                    {
                        "pmTag": "优惠券",
                        "endDate": "2026-03-02",
                        "flag3": "0",
                        "beginDatetime": null,
                        "discount": null,
                        "flag2": null,
                        "flag1": null,
                        "pmInfo": null,
                        "itemNo": "319905",
                        "itemNum": null,
                        "partsTotalNum": null,
                        "specialType": "7",
                        "num1": null,
                        "other4": null,
                        "beginTime": "000000",
                        "id": null,
                        "itemCls3": null,
                        "itemCls2": null,
                        "labelName": null,
                        "other1": null,
                        "flowId": 125803729,
                        "itemCls1": null,
                        "endDateStr": null,
                        "num3": null,
                        "other3": null,
                        "num2": null,
                        "other2": null,
                        "beginDateStr": null,
                        "backgroundColor": null,
                        "sheetNo": "PI2601152094",
                        "oldPrice": null,
                        "specPrice": null,
                        "locationNo": "A1",
                        "beginDate": "2026-03-02",
                        "itemBrand": null,
                        "specName": null,
                        "soldQty": null,
                        "loopFlag": false,
                        "endTime": "235959",
                        "lastupdate": 1772455337239,
                        "time": null,
                        "itemStr": null,
                        "saleQty": null,
                        "endDatetime": null,
                        "fontColor": null,
                        "branchNo": "2440",
                        "status": 0
                    }
                ],
                "maxCode": "D14",
                "isCellected": 0
            },
            "inHourShop": true,
            "catSpecList": [],
            "articleView": null,
            "birthDayFlag": false
        }
    }
}

// 根据ID获取模拟商品数据
export const getMockProductById = (goodsId) => {
    // 在实际开发中，这里可以根据goodsId返回不同的商品数据
    // 目前返回示例数据
    return mockProductDetail(goodsId)
}

// 获取模拟的板块内容
export const getMockPlateContent = () => {
    return mockData
}