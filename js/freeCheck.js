
// 将表单验证对象挂载到window上
window.FormCheck = {}

// 一. 全部校验
// 全部校验初始配置
window.FormCheck.checkAllConfig = {}

// 根据值和校验规则判断校验结果
window.FormCheck.checkValue = function (value, rule) {
	// 规则为正则表达式
	if (!value || value.toString().match(rule)) {
		return true
	} else {
		return false
	}
}

// 转换表单数据格式为json
window.FormCheck.FormDataJson = function (data) { 
	// 支持str= 'a=1&b=2' 和 arr=[{name:'a',value:'1'},{name:'b',value:'2'}]两种
	var dataObj = {}
	if (typeof data == 'string') {
		var dataArr = data.split('&')
		dataArr.forEach(function (item, index) {
			var itemArr = item.split('=')
			dataObj[itemArr[0]] = itemArr[1]
		})
		return dataObj
	}
	if (data instanceof Array) {
		data.forEach(function (item, index) {
			dataObj[item.name] = item.value
		})
		return dataObj
	}
	return data
}

// 获取初始配置
window.FormCheck.getInitConfig = function () {
	// 定制后可默认不传对应参数
	this.checkAllConfig = {
		rules: {} // 匹配规则
		,message: { // 常用的定制匹配不通过时的消息提示
			email: '邮箱error！',
			username: '用户名error！',
			phone: '电话error！'
		}
		,keyMap: { // 常用的定制的字段映射文字
			email: '邮箱',
			username: '姓名',
			phone: '电话',
			address: '地址'
		}
		,rulesMap: { // 常用的定制匹配规则(使用时方式为rules:{email: 'email'})
			email: /^([0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][A-Za-z]+){1,2})$/,
			username: /^[\u4e00-\u9fa5]{2,6}$/,
			phone: /^[\d]{11}$/
		}
	}
}

// 添加扩展配置
window.FormCheck.getExtConfig = function (obj) {
	var _keyMap = window.FormCheck.checkAllConfig.keyMap
	var _message = this.checkAllConfig.message
	var _rulesMap = this.checkAllConfig.rulesMap
	var _rules = this.checkAllConfig.rules
	// 扩展参数-keyMap
	for (var key in obj.keyMap){ // 直接覆盖
		 _keyMap[key] = obj.keyMap[key]
	}
	for (var key in obj.formData){ // 未映射就用字段名
		!_keyMap[key] && (_keyMap[key] = key)
	}
	// 扩展参数-message
	!obj.message && (obj.message = {})
	for (var key in obj.message){
		_message[key] = obj.message[key]
	}
	for (var key in obj.formData){ // 未映射就用字段名+'格式错误'
		if (!obj.message[key] && !_message[key]) {
			_message[key] =  _keyMap[key] + '格式错误！'
		}
	}
	// 扩展参数-rules
	for (var key in obj.rules){
		// 如果规则值在映射字段内存在，则获取规则赋值给rules： obj.rules[key]='phone', ruleMap{ phone: /^[\d]{11}$/ }
		var keyVal = obj.rules[key]
		if (_rulesMap[keyVal]) {
			_rules[key] = _rulesMap[keyVal]
			continue;
		}
		 _rules[key] = obj.rules[key]
	}
}

// 初始化
window.FormCheck.init = function (obj) { 
	// 初始化参数
	this.getInitConfig()
	// 扩展参数-keyMap
	this.getExtConfig(obj)
}

// 一. 全部校验，以对话框显示提示
window.FormCheck.checkAll = function (obj) {
	obj.formData = window.FormCheck.FormDataJson(obj.formData) // 强制转换表单数据格式
	window.FormCheck.init(obj) // 使用前初始化参数，以清除上一次使用痕迹
	var _errorMessage = '' // 返回的提示消息
	var _keyMap = this.checkAllConfig.keyMap
	var _message = this.checkAllConfig.message

	for ( var key in obj.formData ){ 
		var value = obj.formData[key]
		var rule = this.checkAllConfig.rules[key]
		var requistite = obj.requistite && obj.requistite[key]

		// 必选项目非空校验
		if (requistite && !value.trim()) {
			_errorMessage += _keyMap[key] + '不能为空'
			continue;
		}
		// 根据匹配规则校验
		var checkRes = this.checkValue(value, rule)
		if (!checkRes) {
			_errorMessage += _message[key]
		}
	}
	// 有传error回调则执行，无则弹出对话框
	_errorMessage && obj.error && obj.error(_errorMessage)
	_errorMessage && !obj.error && this.createDialog(_errorMessage)
	!_errorMessage && obj.success && obj.success()
	return _errorMessage
}

// 创建对话框
window.FormCheck.createDialog = function (message) {
	var dialogBox = document.createElement('div')
	var styleEle = document.createElement('style')
	var headEle = document.head
	var bodyEle = document.body
	dialogBox.className = 'message'
	dialogBox.innerHTML = `<div class="hd">
								<h3>提示信息</h3>
								<span id='cancel'>x</span>
							</div>
							<div class="bd">
								<p>${message}</p>
								<div class="btn"><button type="button" id='confirm'>确定</button></div>
							</div>	` 
	styleEle.innerHTML = `
						.message {
							position: fixed;
							width: 320px;
							border-radius: 4px;
							border: 1px solid #666;
							box-shadow: 0 0 8px #ccc;
							top: 50%;
							margin-top: -100px;
							left: 50%;
							margin-left: -160px;
							background-color: #fff
						}
						.message .hd {
							border-bottom: 1px solid #ccc;
							position: relative;
						}
						.message .hd h3{
							height: 50px;
							line-height: 50px;
							font-size: 14px;
							margin: 0;
							padding-left: 10px;
						}
						.message .hd span {
							position: absolute;
							top: 15px;
							right: 20px;
							color: #ccc;
							font-size: 14px;
							font-weight: 700;
							cursor: pointer;
						}
						.message .hd span:hover {
							color: #666;
						}
						.message .bd {
							padding: 10px;
						}
						.message .bd .btn {
							text-align: right;
						}
						.message .bd .btn button {
							width:54px;
							height: 34px;
							font-size: 14px;
							padding: 6px 12px;
							border: 1px solid #ccc;
							background-color: #fff;
							border-radius: 4px;
							outline: none;
							cursor: pointer;
						}
						.message .bd .btn button:hover {
							background-color: #dcdcdc;
						}
						.message .bd p{
							font-size: 13px;
							padding: 10px;
							margin: 0;
						}
						`
	headEle.appendChild(styleEle)
	bodyEle.appendChild(dialogBox)
	// 获取按钮注册点击事件
	var cancelEle = document.getElementById('cancel')	
	var confirmEle = document.getElementById('confirm')
	cancelEle.onclick = function () {
		bodyEle.removeChild(dialogBox)
		headEle.removeChild(styleEle)
	}
	confirmEle.onclick = function () {
		bodyEle.removeChild(dialogBox)
		headEle.removeChild(styleEle)
	}
}


// 二、 全校验后给多个div赋文字和类提示
window.FormCheck.checkEach = function (obj) {
	// 补充formData字段属性
	var inputEles = this.getAllInput(obj.$id)
	obj.formData = {}
	for (var i = 0; i < inputEles.length ; i++){
		obj.formData[inputEles[i].name] = ''
	}
	// 初始化
	this.getInitConfig()
	this.getExtConfig(obj)
	var _keyMap = this.checkAllConfig.keyMap
	var _message = this.checkAllConfig.message
	var _errorMessage = ''
	var flag = true

	for (var i = 0; i < inputEles.length ; i++){
		var key = inputEles[i].name
		var value = inputEles[i].value
		var rule = this.checkAllConfig.rules[key]
		var requistite = obj.requistite && obj.requistite[key]
		var messageEle = document.querySelector(`[data-message='${key}']`)
		var messageCls = messageEle.className
		// 清空类名
		messageCls = messageCls.replace(obj.$errorCls,'')
		messageCls = messageCls.replace(obj.$successCls,'')
		// 必选项目非空校验
		if (requistite && !value.trim()) {
			_errorMessage = _keyMap[key] + '不能为空'
			messageEle.innerHTML = _errorMessage
			messageEle.className = messageCls + obj.$errorCls
			flag = false
			continue;
		}
		// 根据匹配规则校验
		var checkRes = this.checkValue(value, rule)
		if (!checkRes) {
			_errorMessage = _message[key]
			messageEle.innerHTML = _errorMessage
			messageEle.className = messageCls + obj.$errorCls
			flag = false
			continue;
		}
		// 校验成功时添加的类名
		messageEle.innerHTML = ''
		messageEle.className = messageCls + obj.$successCls
	}
	flag && obj.success && obj.success()
}

// 根据form的id获取其所有表单元素
window.FormCheck.getAllInput = function (id) {
	var formEle = document.getElementById(id)
	return formEle.querySelectorAll('input[name]')
}

// 三、 单个校验不通过时阻塞
window.FormCheck.checkOne = function (obj) {
	// 补充formData字段属性
	var inputEles = this.getAllInput(obj.$id)
	obj.formData = {}
	for (var i = 0; i < inputEles.length ; i++){
		obj.formData[inputEles[i].name] = ''
	}
	// 初始化
	this.getInitConfig()
	this.getExtConfig(obj)
	var _keyMap = this.checkAllConfig.keyMap
	var _message = this.checkAllConfig.message
	var _errorMessage = ''
	var flag = true

	for (var i = 0; i < inputEles.length ; i++){
		var key = inputEles[i].name
		var value = inputEles[i].value
		var rule = this.checkAllConfig.rules[key]
		var requistite = obj.requistite && obj.requistite[key]
		var messageEle = document.querySelector(`[data-message='${key}']`)
		var messageCls = messageEle.className
		var inputCls = inputEles[i].className
		// 清空类名
		messageCls = messageCls.replace(obj.$errorCls,'')
		inputCls = inputCls.replace(obj.$errorCls,'')
		// 必选项目非空校验
		if (requistite && !value.trim()) {
			_errorMessage = _keyMap[key] + '不能为空'
			messageEle.innerHTML = _errorMessage
			messageEle.className = messageCls + ' '+ obj.$errorCls
			inputEles[i].className = inputCls + ' '+ obj.$errorCls
			flag = false
			inputEles[i].focus()
			return;
		}
		// 根据匹配规则校验
		var checkRes = this.checkValue(value, rule)
		if (!checkRes) {
			_errorMessage = _message[key]
			messageEle.innerHTML = _errorMessage
			messageEle.className = messageCls + ' '+ obj.$errorCls
			inputEles[i].className = inputCls +' '+ obj.$errorCls
			flag = false
			inputEles[i].focus()
			return;
		}
		// 校验成功时添加的类名
		messageEle.innerHTML = ''
		messageEle.className = messageCls
		inputEles[i].className = inputCls
	}
	flag && obj.success && obj.success()
}