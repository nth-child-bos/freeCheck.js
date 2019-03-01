# freeCheck.js是由原生js编写的表单校验插件

​        介绍：freeCheck.js支持接收json格式/数组格式/查询字符串格式的数据校验，提示为对话框；支持根据formID获取form元素的校验，提示为指定dom元素的innerTIML。

 三种校验形式： 1. 一次全校验，以对话框提示。 

​                             2. 一次全校验，以元素innerHTML提示。

​                             3. 逐个校验，以元素innerHTML提示。

-----

方式一（全校验-对话框）：

###### 1. html结构（参考，不要求，只需获取数据） 

```
<form id="myForm" method="post">
    <label>
        手机： <input name="phone" type="text">
    </label>
    <label>
        邮箱： <input name="email" type="text">
    </label>
    <label>
        地址： <input name="address" type="text">
    </label>
    <label>
        账号： <input name="username" type="text">
    </label>
    <label>
        密码： <input name="password" type="text">
    </label>
    <label>
        日期： <input name="date" type="text">
    </label>
    <input type="submit" value=" 提交" id="submit">
</form>
```

###### 2. 使用

```
<script src="表单验证/jquery-2.2.4.js"></script>
<script src="表单验证/freeCheck.js"></script>
<script>
	$('#submit').on('click', function (e) {
		e.preventDefault()
		// 获取表单数据并格式化
		var formData = $('#myForm').serialize()
		formData = decodeURIComponent(formData,true)
		// 开始校验
		FormCheck.checkAll({
			formData:　formData // 表单数据
			,keyMap: { // 字段对应的文字
				email: '邮箱',
				username: '姓名',
				phone: '电话'
			}
			,message: { // 匹配不通过时的消息提示
				email: '邮箱格式不正确！',
				username: '用户名不正确！',
				phone: '电话格式不正确！'
			}
			,rules: { // 匹配规则
				address: /^[\d]{2}$/,
				phone: 'phone', // 内置了匹配规则
				email: 'email'
			}
			,requistite: { // 是否为必选项
				address: true 
			}
			,error: function (res) { // 失败时的提示-不传默认为对话框
				alert(res)
			}
			,success: function (res) {
				alert('ok')
			}
		})
	})
</script>
```

方式二 （全校验，dom元素innerHTML提示）：

###### 1.  html结构

``````
	<form id="myForm" method="post">
		<label>
			手机： <input name="phone" type="text"><div data-message='phone'></div>
		</label>
		<label>
			邮箱： <input name="email" type="text"><div data-message='email'></div>
		</label>
		<label>
			地址： <input name="address" type="text"><div data-message='address'></div>
		</label>
		<label>
			账号： <input name="username" type="text"><div data-message='username'></div>
		</label>
		<label>
			密码： <input name="password" type="text"><div data-message='password'></div>
		</label>
		<label>
			日期： <input name="date" type="text"><div data-message='date'></div>
		</label>
		<input type="submit" value=" 提交" id="submit">
	</form>
``````
###### 2. 使用

```
<script src="表单验证/jquery-2.2.4.js"></script>
<script src="表单验证/freeCheck.js"></script>
<script>
    $('#submit').on('click', function (e) {
        e.preventDefault()
        // 开始校验
        FormCheck.checkEach({
            $id:　'myForm',
            $successCls: 'success' // 通过时，提示dom元素添加的类名
            ,$errorCls: 'error' // 未通过时，提示dom元素添加的类名
            ,keyMap: { // 字段对应的文字
                email: '电子邮箱',
                username: '姓名',
                phone: '电话',
                password:'自定义密码'
            }
            ,message: { // 匹配不通过时的消息提示
                // email: '邮箱格式不正确！',
                username: '用户名不正确！',
                phone: '电话格式不正确！'
            }
            ,rules: { // 匹配规则
                address: /^[\d]{2}$/,
                phone: 'phone',
                email: 'email'
            }
            ,requistite: { // 是否为必选项
                address: true ,
                email: true,
                phone: true,
                password:true
            }
            ,success: function (res) {
                alert('ok')
            }
        })
    })
</script>
```

方式三 （逐个校验，以元素innerHTML提示：

###### 1.  html结构

``````
    <form id="myForm" method="post">
        <label>
            手机： <input name="phone" type="text" class="test"><div  data-message='phone'></div>
        </label>
        <label>
            邮箱： <input name="email" type="text"><div data-message='email'></div>
        </label>
        <label>
            地址： <input name="address" type="text"><div data-message='address'></div>
        </label>
        <label>
            账号： <input name="username" type="text"><div data-message='username'></div>
        </label>
        <label>
            密码： <input name="password" type="text"><div data-message='password'></div>
        </label>
        <label>
            日期： <input name="date" type="text"><div data-message='date'></div>
        </label>
        <input type="submit" value=" 提交" id="submit">
    </form>
``````
###### 2. 使用

```
<script src="表单验证/jquery-2.2.4.js"></script>
<script src="表单验证/freeCheck.js"></script>
<script>
    $('#submit').on('click', function (e) {
        e.preventDefault()
        // 开始校验
        FormCheck.checkOne({
            $id:　'myForm'
            ,$errorCls: 'error' // 未通过时，提示dom元素添加的类名
            ,keyMap: { // 字段对应的文字
                email: '电子邮箱',
                username: '姓名',
                phone: '电话',
                password:'自定义密码'
            }
            ,message: { // 匹配不通过时的消息提示
                // email: '邮箱格式不正确！',
                username: '用户名不正确！',
                phone: '电话格式不正确！'
            }
            ,rules: { // 匹配规则
                address: /^[\d]{2}$/,
                phone: 'phone',
                email: 'email'
            }
            ,requistite: { // 是否为必选项
                address: true ,
                email: true,
                phone: true,
                password:true
            }
            ,success: function (res) {
                alert('ok')
            }
        })
    })
</script>
```



###### 参数说明

1. keyMap: 对应字段显示的提示名，若不传，则显示字段名； 例： phone -> 电话, phone -> phone。
2. message: 对应字段校验未通过时的提示信息，不传则为 字段名（keyMap）+格式错误。
3. $successCls: 'success' // 通过时，提示dom元素添加的类名。
4. $errorCls: 'error' // 未通过时，提示dom元素添加的类名。
5. rules： 对应字段的匹配规则，一般为正则表达式。
6. requistite: 规定字段是否为必填项。
7. success： 校验通过时的回调函数。
8. error: 校验失败时的回调函数，方式一默认为对话框，方式二和三没有改字段。
9. 源文件定制： 可在freeCheck.js的window.FormCheck.getInitConfig方法中添加常用的rules、message、keyMap等参数，添加了的配置参数即为默认配置，使用时不必再传入对应参数。rulesMap可实现rules匹配规则内传入字段名，例如rules: { phone: 'phone' }，用于集成常用匹配规则。