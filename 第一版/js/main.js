/**
 * Created by yanjd on 2017/11/16.
 */
(function ($) {
  // ############################### 变量初始 ###############################
  var page = window.page
  var common = window.common

  // ############################### 页面初始 ###############################
  $(function () {
    routerRun()
  })

  // ############################### 操作方法 ###############################
  // 当前页面路径 # 后路径改变元素
  function routerRun() {
    _fun()
    window.onhashchange = _fun
    function _fun() {
      var href = location.href
      if (href.indexOf('#') === -1) return
      var path = href.split('#')[1]
      var item = page.config.filter(function (item) {
        return path.indexOf(item.path) !== -1
      })[0]
      if (!item) {
        console.log('路径找不到')
      } else {
        if (page.last) {
          $(page.last.showEle).hide()
          $(page.last.hideEle).show()
          $("[data-route='" + page.last.active + "']").removeClass('active')
        }
        $(item.showEle).show()
        $(item.hideEle).hide()
        $("[data-route='" + item.active + "']").addClass('active')
        console.log('from', page.last)
        console.log('to', item)
        page.last = item
      }
    }
  }

}($))