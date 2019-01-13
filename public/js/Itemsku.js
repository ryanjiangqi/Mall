var itemsku = {
    skuData: [],//JSON.parse(commonData.skuData),//商品有效商品SKU信息，初始化之前必须赋值
    //保存最后的组合结果信息
    SKUResult: {},
    //获得对象的key
    getObjKeys: function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                keys[keys.length] = key;
        return keys;
    },
    //把组合的key放入结果集SKUResult
    add2SKUResult: function (combArrItem, sku) {
        var key = combArrItem.join("_");
        if (this.SKUResult[key]) {//SKU信息key属性·
            this.SKUResult[key].Stock += sku.Quantity;
            this.SKUResult[key].Sales += sku.Sales;
            this.SKUResult[key].Price.push(sku.Price);
            this.SKUResult[key].MinOrderQty.push(sku.MinOrderQty);
            this.SKUResult[key].MemberPrice.push(sku.MemberPrice);
            this.SKUResult[key].PromotePrice.push(sku.PromotePrice);
            this.SKUResult[key].FlowID.push(sku.FlowID);
            this.SKUResult[key].ItemID.push(sku.ItemID);
            this.SKUResult[key].SkuID.push(sku.SkuID);
        } else {
            this.SKUResult[key] = {
                FlowID: [sku.FlowID],//SKU商品流水ID
                ItemID: [sku.ItemID],//SKU商品
                SkuID: [sku.SkuID],//SKU商品
                Stock: sku.Quantity,//SKU商品库存
                MinOrderQty: [sku.MinOrderQty],//SKU商品起订量
                Sales: sku.Sales,//SKU商品销量
                Price: [sku.Price],//SKU商品销售价
                MemberPrice: [sku.MemberPrice],//SKU商品会员价
                PromotePrice: [sku.PromotePrice]//SKU商品促销价
            };
        }
    },
    //初始化得到结果集
    initSKU: function () {
        var i;
        var j;
        var skuKeys = this.getObjKeys(itemsku.skuData);
        for (i = 0; i < skuKeys.length; i++) {
            var skuKey = skuKeys[i];//一条SKU信息key
            var sku = itemsku.skuData[skuKey];	//一条SKU信息value
            var skuKeyAttrs = skuKey.split("_"); //SKU信息key属性值数组
            skuKeyAttrs.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });

            //对每个SKU信息key属性值进行拆分组合
            var combArr = this.combInArray(skuKeyAttrs);
            for (j = 0; j < combArr.length; j++) {
                this.add2SKUResult(combArr[j], sku);
            }

            //结果集接放入SKUResult
            this.SKUResult[skuKeyAttrs.join("_")] = {
                FlowID: [sku.FlowID],//SKU商品流水ID
                ItemID: [sku.ItemID],//SKU商品
                SkuID: [sku.SkuID],//SKU商品
                Stock: sku.Quantity,//SKU商品库存
                MinOrderQty: [sku.MinOrderQty],//SKU商品起订量
                Sales: sku.Sales,//SKU商品销量
                Price: [sku.Price],//SKU商品销售价
                MemberPrice: [sku.MemberPrice],//SKU商品会员价
                PromotePrice: [sku.PromotePrice]//SKU商品促销价
            }
        }
    },
    /**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
    combInArray: function (aData) {
        if (!aData || !aData.length) {
            return [];
        }

        var len = aData.length;
        var aResult = [];

        for (var n = 1; n < len; n++) {
            var aaFlags = this.getCombFlags(len, n);
            while (aaFlags.length) {
                var aFlag = aaFlags.shift();
                var aComb = [];
                for (var i = 0; i < len; i++) {
                    aFlag[i] && aComb.push(aData[i]);
                }
                aResult.push(aComb);
            }
        }

        return aResult;
    },

    /**
     * 得到从 m 元素中取 n 元素的所有组合
     * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
     */
    getCombFlags: function (m, n) {
        if (!n || n < 1) {
            return [];
        }

        var aResult = [];
        var aFlag = [];
        var bNext = true;
        var i, j, iCnt1;

        for (i = 0; i < m; i++) {
            aFlag[i] = i < n ? 1 : 0;
        }

        aResult.push(aFlag.concat());

        while (bNext) {
            iCnt1 = 0;
            for (i = 0; i < m - 1; i++) {
                if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
                    for (j = 0; j < i; j++) {
                        aFlag[j] = j < iCnt1 ? 1 : 0;
                    }
                    aFlag[i] = 0;
                    aFlag[i + 1] = 1;
                    var aTmp = aFlag.concat();
                    aResult.push(aTmp);
                    if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                        bNext = false;
                    }
                    break;
                }
                aFlag[i] == 1 && iCnt1++;
            }
        }
        return aResult;
    }

}