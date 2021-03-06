// 防止window.App 不存在
if(!window.App || typeof window.App != 'object'){
	window.App = {};
}

// 封装Tabs组件
(function(App){

	// 模板
	var _template = Handlebars.compile(`<div class="m-tabs {{list_type}}" id="hdtabs">
		<ul>
			{{#each nTabData}}
				<li><a href="{{url}}">{{name}}</a></li>
			{{/each}}
		</ul>
		<div class="tabs_track">
			<div class="tabs_thumb"></div>
		</div>
	</div>`);

	/** options 参数说明
	* {
	*   parent: dom节点, 父容器 (必填)
	*   index: num类型，Tab选中项的序号 
	*   nTabData: [     选项卡数据 (必填)
	*     {
	*       name: str, tab名称
	*       url: str,  url地址   
	*     }
	*   ],
	*   list_type: str,  Tab的扩展样式
	* }
	*/
	function Tabs(options){
		// 继承配置
		_.extend(this, options);
		
		this.index = this.index || 0;
		// 缓存节点
			// 容器
		this.container = _.html2node(_template(this));
			// Tab
		this.nTab = this.container.getElementsByTagName('ul')[0];
		this.nTabs = this.nTab.children;
			// 滑动条
		this.nThumb = _.getElementsByClassName(this.container, 'tabs_thumb')[0];

		// 初始化
		this.init();
	}

	// 初始化(绑定事件, 将组件载入页面)
	Tabs.prototype.init = function(){
		// 绑定事件
		for(var i = 0; i < this.nTabs.length; i++){
			// 1, 鼠标hover时，设定highlight样式的选项
			this.nTabs[i].addEventListener('mouseenter', (function(index){
				this.highlight(index);
			}).bind(this, i));
			// 2, 点击时，设定tabs的选中项
			this.nTabs[i].addEventListener('click', (function(index){
				this.setCurrent(index);
			}).bind(this, i));
		}
		// 3, 鼠标离开tabs时，保持highlight
		this.nTab.addEventListener('mouseleave', (function(){
			this.highlight(this.index);
		}).bind(this));

		// 将组件载入页面(先挂载组件，在获取offset值，不然为0)
		this.parent.appendChild(this.container);
		// 初始化
		this.setCurrent(this.index);
	};
	// 设置当前选中tab
	Tabs.prototype.setCurrent = function(index){
		// 移除原选中tab的css类
		_.delClassName(this.nTabs[this.index], 'z-active');
		// 更新选中的index
		this.index = index;
		// 为新选中的tab添加css类
		_.addClassName(this.nTabs[this.index], 'z-active');
		// 实现选中tab的highlight样式
		this.highlight(this.index);
	};
	// 设置选中样式
	Tabs.prototype.highlight = function(index){
		// 获取选中的tab元素
		var tab = this.nTabs[index];
		this.nThumb.style.width = tab.offsetWidth + 'px';
		this.nThumb.style.left = tab.offsetLeft + 'px';
	};
	App.Tabs = Tabs;

})(window.App);