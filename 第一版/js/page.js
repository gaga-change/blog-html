/**
 * Created by yanjd on 2017/11/16.
 */
(function ($) {
  var page = window.page = {}
  // 单页逻辑
  /*
  * 1. home 主页
  * 2. about 关于我
  * 3. message 留言板
  * 4. class/:class 分类目录
  * 5. detail/:id 详情
  * */
  // 除了 header 和 footer 配置每个页面显示的div
  page.config = [
    {
      path: '/home',
      showEle: '#content',
      hideEle: '#classList, #contentLeftDetail',
      active: '/home'
    },
    {
      path: '/class',
      showEle: '#content',
      hideEle: '#allList, #contentLeftDetail',
      active: '/home'
    },
    {
      path: '/detail',
      showEle: '#content',
      hideEle: '#contentLeftList',
      active: '/home'
    },
    {
      path: '/about',
      showEle: '#other',
      hideEle: '#message',
      active: '/about'
    },
    {
      path: '/message',
      showEle: '#other',
      hideEle: '#about',
      active: '/message'
    }
  ]
  page.last = null
}($))