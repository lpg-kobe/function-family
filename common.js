/** 
 * @param {long} //通用函数库
 * @param {onerror} //js错误调试
 * @author lpg 2017-11-02
*/

window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log("错误信息：", errorMessage);
    console.log("出错文件：", scriptURI);
    console.log("出错行号：", lineNumber);
    console.log("出错列号：", columnNumber);
    console.log("错误详情：", errorObj);
}

var eventUtils = {//跨浏览器事件
    getEvent: function (event) {//获取事件
        return event ? event : window.event
    },
    addHandler: function (ele, type, handler) {//事件监听
        if (ele.addEventListener) {
            ele.addEventListener(type, handler)
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, handler)
        } else {
            ele['on' + type]
        }
    },
    removeHandler: function (ele, type, handler) {//移除监听
        if (ele.removeEventListener) {
            ele.removeEventListener(type, handler)
        } else if (ele.attachEvent) {
            ele.detachEvent('on' + type, handler)
        } else {
            ele['on' + type]
        }
    },
    getTarget: function (event) {//事件目标
        if (event.target) {
            return event.target
        } else {
            return event.srcElement
        }
    },
    preventDefault: function (event) {//阻止默认事件
        if (event.preventDefault) {
            return event.preventDefault
        } else {
            return event.returnValue = false
        }
    },
    stopPropagation: function (event) {//阻止冒泡
        if (event.stopPropagation) {
            return event.stopPropagation
        } else {
            return event.cancelBubble = true
        }
    }
}
/*
*通用ajax请求
*需引入jq库支持
*/
var xhr = {
    ajaxRequest(options = {
        type: 'Get'
    }) {//同步ajax
        var ajax = {
            type: options.type,
            url: options.url,
            data: options.data,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        };
        ajax.success = (result) => {
            console.log(result)
        };
        $.ajax(ajax)
    },
    async asyncRequest(options = {
        type: 'Get'
    }) {//异步ajax
        return new promise((resolve, reject) => {
            var ajax = {
                type: options.type,
                url: options.url,
                data: options.data,
                dataType: 'json',
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            };
            ajax.success = (result) => {
                resolve(result);
                console.log(result)
            };
            ajax.error = (error) => {
                resolve(error)
            };
            $.ajax(ajax)
        })
    }
}


/**
 * @param {httpGet()}老版本http请求
 * @method  => httpGet({'请求url','传输data','回调函数'})
 */


function httpGet(services, data, callback) {
    var url = 'example';
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            var info = data['data']['info'];//返回数据格式视情况而定
            if (data['ret'] == 200 && data['data']['code'] == 0) {
                callback(info);
            } else {
                if (data['data']['code'] == 700) {
                    return;
                }
                var msg = data['data'] && data['data']['msg'] ? data['data']['msg'] : '';
                msg = msg == '' && data['msg'] ? data['msg'] : msg;
                //xhr.showmsg(msg);
            }
        },
        error: function (data) {

        }
    })
}


/* 封装ajax函数
 1  * @param 简易原生ajax
 2  * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 3  * @param {string}opt.url 发送请求的url
 4  * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 5  * @param {object}opt.data 发送的参数，格式为对象类型
 6  * @param {function}opt.success ajax发送并接收成功调用的回调函数
 7  */
function Ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () { };
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    };
    var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}

/**
 * 分页加载器
 * @type {Function} 
 * 方法可扩展 
 */

function pagingLoad(options) { //分页加载
    if (!document.getElementById('load_txt')) {
        this.loadTxt = document.createElement('div');
        loadTxt.id = "load_txt";
        loadTxt.style.textAlign = "center";
        document.body.appendChild(loadTxt);
    };
    this.oPageLoad = {
        page: 1,
        el: options.el, //滚动的对象
        apiUrl: options.url,
        data: options.data || {},
        tailload: true,
        sucload: true,
        totalpage: options.totalpage, //总页数
        containArea: options.containArea, //内容区
        callback: options.callback
    };
    var _this = this;
    this.oPageLoad.el.onscroll = function () {
        var scrollTop = this.scrollTop, //滚动条距顶部的高度
            containHei = _this.oPageLoad.containArea.scrollHeight, //内容高度(scrollHeight)
            clientHei = this.clientHeight; //可视高度
        console.log('当前总页数' + _this.oPageLoad.totalpage, scrollTop, containHei, clientHei);
        if (_this.oPageLoad.page == _this.oPageLoad.totalpage && containHei - scrollTop - clientHei < 20) { //判断页码是否等于总页码且滚动条到达最底部
            if (_this.oPageLoad.tailload) {
                _this.loadTxt.innerHTML = "已全部加载完成";
                _this.oPageLoad.tailload = !_this.oPageLoad.tailload;
                return;
            } else {
                _this.loadTxt.innerHTML = "已全部加载完成";
                return;
            }
        };

        if (containHei - scrollTop - clientHei < 20 && _this.oPageLoad.sucload) {
            _this.oPageLoad.page++;
            _this.oPageLoad.sucload = !_this.oPageLoad.sucload;
            _this.loadTxt.innerHTML = "加载中...";
            console.log('loading...第' + _this.oPageLoad.page + '页');
            _this.oPageLoad.data["page"] = _this.oPageLoad.page;
            httpGet(_this.oPageLoad.apiUrl, _this.oPageLoad.data, function (data) {//请求加载
                commonArray = commonArray.concat(data);
                if (pagingLoadOption.containArea == document.getElementById('successList')) {//区分区块分区加载
                    var $successData = template('success_list', { info: commonArray, timeFormat: timeFormat });
                    $("#successList").html($successData);
                } else {
                    var $inviteData = template('invite_list', { info: commonArray, timeFormat: timeFormat });
                    $("#inviteList").html($inviteData);
                };
                _this.loadTxt.innerHTML = "";
                _this.oPageLoad.sucload = !_this.oPageLoad.sucload;
            });

        };

    };

}

/** 
 * @param {function} 实用函数
 * @method => bVersion()判断浏览器内核信息EXP:if(bVersion.iwx)
 * @method => getExplore获取浏览器类型和版本,EXP:return Safari:9.0 
 * @method => toArray(['1','2'],2)仿Array.shift()方法从头部清除数组指定长度并返回新数组
 * @method => initRun() 根据设备视口clientWidth宽度调节字体大小(基于750px宽度设计稿设置跟元素字体大小20px==1rem)
 * @method => getQueryString() 获取url链接中参数对应的值
 * @method => setStore(key, value) 本地存储key的value
 * @method => getStore(key, exp, name) 取存储的数据:key[名称]exp[过期时间]name[指定命名的变量]
 * @method => hasClass(ele,cls)判断element节点是否存在clasName('cls')
 * @method => addClass(ele,cls)在hasClass判断基础上添加clasName('cls')
 * @method => removeClass(ele,cls)在hasClass判断基础上移除clasName('cls')
 * @method => getCookie(name)获取名为name的cookie值cookName[0]为键名,cookName[1]为键值
 * @method => setCookie(name,value,days)设置过期时间戳expires为days名为name值为value的cookie
 * @method => removeCookie(name)重新设置过期的cookie即可移除
 * @method => randomColor生成随机颜色#xxxxxx
 * @method => randomNum生成指定范围的随机数(min-max)
 * @method => isPhoneNum(str)是否为手机号 
*/

var utils = {
    bVersion: function () {
        var u = navigator.userAgent;
        return { //移动终端浏览器内核信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            iwx: /MicroMessenger/i.test(u),//是否微信
            iWeiBo: /Weibo/i.test(navigator.userAgent)//微博客户端
        };
    }(),

    getExplore: function () {//获取浏览器类型和版本
        var sys = {},
            ua = navigator.userAgent.toLowerCase(),
            s; (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] : (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] : (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] : (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] : (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] : (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] : (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;

        // 根据关系进行判断
        if (sys.ie) return ('IE: ' + sys.ie)

        if (sys.edge) return ('EDGE: ' + sys.edge)

        if (sys.firefox) return ('Firefox: ' + sys.firefox)

        if (sys.chrome) return ('Chrome: ' + sys.chrome)

        if (sys.opera) return ('Opera: ' + sys.opera)

        if (sys.safari) return ('Safari: ' + sys.safari)

        return 'Unkonwn'
    },

    toArray(arr, len) {
        len = len || 0;
        var i = arr.length - len;
        var ret = new Array(i);
        while (i--) {
            ret[i] = arr[i + len];
        }
        console.log(ret);
        return ret
    },

    hasClass: function (ele, cls) {//true||false
        return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
    },

    addClass: function (cls) {
        if (!hasClass(ele, cls)) {
            ele.className += '' + cls;
        }
    },

    removeClass: function (cls) {
        if (hasClass(ele, cls)) {
            var exp = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(exp, ' ');
        }
    },

    getCookie: function (name) {
        var cookArr = document.cookie.replace(/\s/g, "").split(';');
        for (var i = 0, len = cookArr.length; i < len; i++) {
            var cookName = cookArr[i].split('=');
            if (cookName[0] == name) {
                return decodeURIComponent(cookName[1]);
            }
        };
        return '';
    },

    setCookie: function (name, value, days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = name + '=' + value + ';expires=' + date;
    },

    removeCookie: function (name) {
        //设置过期cookie会自动移除
        setCookie(name, '1', -1)
    },

    randomColor: function () {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(- 6);
    },

    rendomNum: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    isPhoneNum: function (str) {
        return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str)
    },

    copy: function (event) {//有选择性使用
        var input = document.createElement('input');
        input.type = "text";
        input.value = "contain to copy";
        event.currentTarget.appendChild(input);
        input.select();
        document.execCommand('copy', false, null);
    },

    initRun: function () {//响应式字体大小
        var _this = this,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        _this.fontAdapt();
        window.onresize = function () {
            _this.fontAdapt();
        }
    },

    fontAdapt: function () {//div-width(375px)=>(html(20px)=>1rem)==(html(80px)=>html((80/2)px)=2rem)
        var w = document.documentElement.clientWidth,
            fz = w * 20 / 375;//375为基准视图宽度，为设计稿宽度/2; 20为自定义根字体像素大小
        document.getElementsByTagName(html)[0].style.fontSize = fz + 'px';
    },

    getQueryString: function (key) { //正则获取url后面的参数值'?service=&name=name'=>name
        const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        const result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    setStore(key, value) { //localStorage存储数据 key[名称]value[数据]=>(配合store.min.js使用)
        const storeTime = new Date().getTime();
        value['setKeyTime'] = storeTime;
        store.set(key, value);
    },

    getStore(key, exp, name) { //取存储的数据:key[名称]exp[过期时间]name[指定命名的变量]
        const getKeyData = store.get(key);
        exp && getKeyData && (new Date().getTime() - getKeyData.setKeyTime > exp) && store.remove(key) && (name && (name = store.get(key)));
        return getKeyData;
    },

    showmsg(msg) {//提示框 
        const $formMsg = document.getElementById('form-msg');
        if ($formMsg == null || $formMsg == "") {
            const tipEle = document.createElement("div");
            tipEle.className = "tc form-msg";
            tipEle.id = "form-msg";
            tipEle.innerHTML = msg;
            document.body.appendChild(tipEle);
        } else {
            $formMsg.style.display = "block";
            $formMsg.innerHTML = msg;
        }
        setTimeout(() => {
            document.getElementById('form-msg').style.display = "none";
        }, 1000);
    }
}
utils.initRun();

/**
 * localStorage兼容性处理
 */
if (!window.localStorage) {
    Object.defineProperty(window, "localStorage", new (function () {
        var aKeys = [], oStorage = {};
        Object.defineProperty(oStorage, "getItem", {
            value: function (sKey) { return sKey ? this[sKey] : null; },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "key", {
            value: function (nKeyId) { return aKeys[nKeyId]; },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "setItem", {
            value: function (sKey, sValue) {
                if (!sKey) { return; }
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "length", {
            get: function () { return aKeys.length; },
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "removeItem", {
            value: function (sKey) {
                if (!sKey) { return; }
                var sExpDate = new Date();
                sExpDate.setDate(sExpDate.getDate() - 1);
                document.cookie = escape(sKey) + "=; expires=" + sExpDate.toGMTString() + "; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        this.get = function () {
            var iThisIndx;
            for (var sKey in oStorage) {
                iThisIndx = aKeys.indexOf(sKey);
                if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
                else { aKeys.splice(iThisIndx, 1); }
                delete oStorage[sKey];
            }
            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
            for (var iCouple, iKey, iCouplId = 0, aCouples = document.cookie.split(/\s*;\s*/); iCouplId < aCouples.length; iCouplId++) {
                iCouple = aCouples[iCouplId].split(/\s*=\s*/);
                if (iCouple.length > 1) {
                    oStorage[iKey = unescape(iCouple[0])] = unescape(iCouple[1]);
                    aKeys.push(iKey);
                }
            }
            return oStorage;
        };
        this.configurable = false;
        this.enumerable = true;
    })());
} else {
    return window.localStorage
}

/**
 * 原生js仿jq常用API操作DOM
 * @type {Object}
 * @method $(".selector").method()
 * @method {.css}=>$(".selector").css({Obj})
 * @return this
 */

//$ selector
function $(selector) {
    return document.querySelector(selector)
}
//hide()
Object.prototype.hide = function () {
    this.style.display = "none";
    return this;
};
//show()
Object.prototype.show = function () {
    this.style.display = "block";
    return this;
};
//hasClass() 
Object.prototype.hasClass = function (cName) {
    return !!this.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
}
//addClass() 
Object.prototype.addClass = function (cName) {
    if (!this.hasClass(cName)) {
        this.className += " " + cName;
    }
    return this;
}
//removeClass() 
Object.prototype.removeClass = function (cName) {
    if (this.hasClass(cName)) {
        this.className = this.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
    }
    return this;
}
//parent() 
Object.prototype.parent = function () {
    return this.parentNode;
}
//next() 
Object.prototype.next = function () {
    return this.nextElementSibling;
}
//prev() 
Object.prototype.prev = function () {
    return this.previousElementSibling;
}
//siblings() 
Object.prototype.siblings = function () {
    var chid = this.parentNode.children;
    var eleMatch = [];
    for (var i = 0, l = chid.length; i < l; i++) {
        if (chid[i] != this) {
            eleMatch.push(chid[i]);
        }
    }
    return eleMatch;
}
//css()
Object.prototype.css = function (cssObj) {
    var cssStr = '';
    function objToCssStr(cssObj) {
        for (var k in cssObj) {
            cssStr += k + ':' + cssObj[k] + ';'
        };
        return cssStr
    };
    this.style.cssText = objToCssStr(cssObj);
}

/**
 * @desc 判断原生类型 
 * @return {Boolean}
 */

function isObject(obj) {//Object or not 
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function isNumber(num) {//Number or not 
    return Object.prototype.toString.call(num) === '[object Number]'
}

function isString(str) {//String or not 
    return Object.prototype.toString.call(str) === '[object String]'
}

function isArray(arr) {//Array or not 
    return Object.prototype.toString.call(arr) === '[object Array]'
}

function isBoolean(boolean) {//Boolean or not 
    return Object.prototype.toString.call(boolean) === '[object Boolean]'
}

function isFunction(fn) {//Function or not 
    return Object.prototype.toString.call(fn) === '[object Function]'
}

function isRegExp(reg) {//RegExp or not 
    return Object.prototype.toString.call(reg) === '[object RegExp]'
}

function looseEqual(a, b) {//check two parameter is looslyEqual or not(===)
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            var isArrayA = Array.isArray(a);
            var isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return a.length === b.length && a.every(function (e, i) {
                    return looseEqual(e, b[i])
                })
            } else if (!isArrayA && !isArrayB) {
                var keysA = Object.keys(a);
                var keysB = Object.keys(b);
                return keysA.length === keysB.length && keysA.every(function (key) {
                    return looseEqual(a[key], b[key])
                })
            } else {
                /* istanbul ignore next */
                return false
            }
        } catch (e) {
            /* istanbul ignore next */
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
};
