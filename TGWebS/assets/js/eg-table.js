

var egtable = {
    option: {
        key: "",
        state: "",
        rState: "",
        rStateValue: "",
        element: "",
        displayCol: "",
        titleHiddenCol: "",
        groups: {
            group1: "1,2,3",
            group2: "4",
            group3: "",
            group4: "",
            group5: ""
        }
    },
    data: null,
    init: function () {
        if (arguments[0].data !== undefined && arguments[0].data !== null)
            this.buildTable(arguments[0].data[0], arguments[0].data);
    },
    resetSource: function (arr) {
        for (var i = 0, pChgEn; pChgEn = arr[i++];) {
            var keyValue = getPrpos(pChgEn, this.option.key);
            var pIndex = GetTargetFromArray(this.data, this.option.key, keyValue);
            this.data.splice(pIndex, 0, pChgEn);
        }
    },
    getStateDom: function (state) {
        var nValue = "<td class='th-sym'><b>&nbsp;&nbsp;</b></td>";
        //return nValue;
        if (state === undefined || state === null)
            return nValue;

        if (state == "Unknow" || state == "Nochange") {
            return nValue;
        }
        else if (state == "Increase") {
            return "<td class='th-sym'><b class='b-sym b-increase'>&nbsp;↑</b></td>";
        }
        else if (state == "Decrease") {
            return "<td class='th-sym'><b class='b-sym b-decrease'>&nbsp;↓</b></td>";
        }
    },
    refreshTable: function (arr) {
        //console.log("dd");
        var sourceArray = this.data;
        var table = $(this.option.element);
        var data = arr[0];
        var rContent = "";
        var eContent = "";
        var keyValue = "";
        var curkey = this.option.key;
        var displayCol = this.option.displayCol;
        var groups = this.option.groups;
        var pState = this.option.state;
        var prStateValue = this.option.rStateValue;
        var prState = this.option.rState;
        var getStateDomX = this.getStateDom;
        var i = 0;
        $.each(arr, function (nameX, pEntity) {
            rContent = "";
            eContent = "";
            var iCol = 0;

            //
            var bIsWarnRow = prState != "" && prStateValue !== null && prStateValue !== undefined && prStateValue != "" && prStateValue == getPrpos(pEntity, prState) ? true : false;
            //遍歷列
            $.each(pEntity, function (colName, value) {
                if (typeof (data[colName]) == "function") { return true; }
                if (displayCol.indexOf(colName) < 0) { return true; }
                //設置主鍵值——使用前提，主鍵屬性必須為類的第一個屬性
                keyValue = colName == curkey ? value : keyValue;
                if (keyValue === null || keyValue === undefined || keyValue == "") { return true; }
                //獲取table中，符合主鍵值的行
                var targetEntitys = $.grep(sourceArray, function (target) {
                    return getPrpos(target, curkey) == keyValue;
                });

                 /*******************************************************/
                //升跌符號，直接獲取，無需設置3秒回滾
                if (pState == colName) {
                    var pSym = getStateDomX(value);
                    eContent = pSym;
                }
                    //除升跌符號以外，所有變化值均設置3秒回滾
                else {
                    /*******************************************************/
                    //獲取行的列值，如果與當前列值不相等，則
                    if (value !== getPrpos(targetEntitys[0], colName)) {

                        eContent = bIsWarnRow ?
                            "<td class='th-warn'><span>" + value + "</span></td>"
                            :
                            "<td class='th-change' id='th-" + iCol + keyValue + "'><span>" + value + "</span></td>";

                        ////設置計時器，3秒後回滾樣式
                        //var timer = {
                        //    pCol: iCol,
                        //    pKeyValue: keyValue,
                        //    pCurValue: value,
                        //    resetEle: function () {
                        //        //$("#th-" + this.pCol + keyValue).empty();
                        //        var pCellValue = $("#th-" + this.pCol + this.pKeyValue).text();
                        //        if (this.pCurValue == pCellValue)
                        //            $("#th-" + this.pCol + this.pKeyValue).attr("class", "");
                        //    }
                        //};
                        //setTimeout(function () {
                        //    timer.resetEle();
                        //}, 3000);
                    }
                    else {
                        if (colName == curkey) {
                            //獲取分組名稱
                            var groupName = GetGroupID(groups, keyValue);
                            eContent = bIsWarnRow ?
                                "<td class='th-warn-head th-" + groupName + " th-right-border'>" + value + "</td>"
                                :
                                "<td class='th-" + groupName + " th-right-border'>" + value + "</td>";
                        }
                        else {
                            eContent = bIsWarnRow ?
                                "<td class='th-warn'>" + value + "</td>"
                                :
                                "<td>" + value + "</td>";
                        }
                    }
                }
                //}
                rContent = rContent + eContent;

                iCol += 1;
            });
            //JS替換tr方法——ie7錯誤
            var trTarget = document.getElementById(keyValue);
            trTarget.innerHTML = rContent;
            //JQuery替換tr方法
            //$("#" + keyValue).empty();
            //$("#" + keyValue).html(rContent);

            i += 1;
        });

        data = null;
        sourceArray = null;
        //更新后，重置數據，非常關鍵
        //this.resetSource(arr);
    },
    buildTable: function (data, arr) {
        this.data = arr;
        var displayCol = this.option.displayCol;
        var titleHiddenCol = this.option.titleHiddenCol;
        var groups = this.option.groups;
        var curkey = this.option.key;
        var pState = this.option.state;
        var getStateDomX = this.getStateDom;
        //获取显示数据的表格
        var table = $(this.option.element);
        //清楚表格中内容
        $(this.option.element + " tbody").empty();

        var rHead = "";
        var eleHead = "";
        $.each(data, function (colName, value) {
            if (typeof (data[colName]) == "function") { return true; }
            if (displayCol.indexOf(colName) < 0) { return true; }
            //過濾不顯示的列
            colName = titleHiddenCol.indexOf(colName) >= 0 ? "" : colName;

            if (colName == curkey) {
                eleHead = "<td class='th-right-border'>" + colName + "</td>";
            }
            else {
                eleHead = "<td>" + colName + "</td>";
            }
            rHead = rHead + eleHead;
        });
        rHead = "<tr class='tr-head tr-bottom-border tr-content-even'>" + rHead + "</tr>";
        table.append($(rHead));

        //生成內容
        var rContent = "";
        var eContent = "";
        var keyValue = "";
        var i = 0;
        var curGroupX = "";
        $.each(arr, function (nameX, pEntity) {
            rContent = "";
            eContent = "";
            var pGroup = "";
            $.each(pEntity, function (colName, value) {
                if (typeof (data[colName]) == "function") { return true; }
                if (displayCol.indexOf(colName) < 0) { return true; }
                if (colName == curkey) {
                    keyValue = value;
                    //獲取分組名稱
                    var groupName = GetGroupID(groups, keyValue);
                    pGroup = groupName;
                }

                if (pState == colName) {
                    var pSym = getStateDomX(value);
                    eContent = pSym;
                }
                else {
                    if (colName == curkey) {
                        eContent = "<td class='th-" + groupName + " th-right-border'>" + value + "</td>";
                    }
                    else {
                        eContent = "<td>" + value + "</td>";
                    }
                }

                rContent = rContent + eContent;
            });
            //第一行分組內容，需要加入top邊框
            var pxName = "";
            if (pGroup != curGroupX) {
                curGroupX = pGroup;
                if (curGroupX != "") {
                    pxName = "tr-top-border";
                }
            }
            //判斷奇數偶數行
            var oddOrEven = (i % 2) == 0 ? true : false;
            if (oddOrEven)
                rContent = "<tr class='tr-content-odd " + pxName + "' id='" + keyValue + "'>" + rContent + "</tr>";
            else
                rContent = "<tr class='tr-content-even " + pxName + "' id='" + keyValue + "'>" + rContent + "</tr>";
            table.append($(rContent));

            i += 1;
        });
    }
}
function GetTargetFromArray(arr, key, keyValue) {
    var pTarget = 0;

    for (var i = 0, pEn; pEn = arr[i++];) {
        if (getPrpos(pEn, key) == keyValue) {
            break;
        }
        pTarget += 1;
    }
    return pTarget;
}
//獲取分組信息
function GetGroupID(groups, curkeyValue) {
    var groupname = "";
    $.each(groups, function (name, group) {
        if (group.indexOf(curkeyValue) >= 0) {
            groupname = name;
            return;
        }
    });
    return groupname;
}
//
function getPrpos(obj, target) {
    // 用来保存所有的属性名称和值
    var props = "";
    // 开始遍历
    for (var p in obj) {
        // 方法
        if (typeof (obj[p]) == "function") {
            obj[p]();
        } else {
            //// p 为属性名称，obj[p]为对应属性的值
            //props += p + "=" + obj[p] + "\t";

            if (target == p) {
                return obj[p];
            }
        }
    }
    return null;
}