function bindEvent(obj, events, fn) {
  obj.addEventListener(events, function(ev) {
    if (f() === false) {
      ev.preventDefault()
      ev.cancelBubble = true
    }
  }, false)
}


function getByClass(oParent, sClass) {
  if (oParent.getElementsByClassName) {
    return toArray(oParent.getElementsByClassName(sClass))
  } else {
    var arr = []
    var elems = oParent.getElementsByTagName('*')
    console.log(elems)
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].className === sClass) {
        arr.push(elems[i])
      }
    }
    console.log(arr)
    return arr
  }
}

function toArray(elems) {
  var arr = []
  for (var i = 0; i < elems.length; i++) {
    arr.push(elems[i])
  }
  return arr
}

function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {
    return getComputedStyle(obj, false)[attr]
  }
}


function tQuery(vArg) {
  this.elements = []
    // vArg : function
  switch (typeof vArg) {
    case 'function':
      bindEvent(document, 'DOMContentLoaded', vArg)
      break
    case 'string':
      switch (vArg.charAt(0)) {
        case '#':
          this.elements.push(document.getElementById(vArg.substring(1)))
          break
        case '.':
          this.elements = getByClass(document, vArg.substring(1))
          break
        default:
          this.elements = toArray(document.getElementsByTagName(vArg))
      }
      break
    case 'object':
      if (vArg.constructor == Array) {
        this.elements = vArg
      } else {
        this.elements.push(vArg)
      }
      break
  }
}
//= 工具 ======================================

function $(vArg) {
  // return jquery 对象
  return new tQuery(vArg)
}

$.trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '')
}

$.extend = function(json) {
  for (var attr in json) {
    $[attr] = json[attr]
  }
}

$.fn = {}
$.fn.extend = function(json) {
  for (var attr in json) {
    tQuery.prototype[attr] = json[attr]
  }
}

//========================================

tQuery.prototype.html = function(str) {
  if (str) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].innerHTML = str
    }
  } else {
    return this.elements[0].innerHTML
  }
  return this
}


tQuery.prototype.click = function(fn) {
  this.on('click', fn)
  return this
}

tQuery.prototype.mouseover = function(fn) {
  this.on('mouseover', fn)
  return this
}

tQuery.prototype.on = function(events, fn) {
  for (var i = 0; i < this.elements.length; i++) {
    bindEvent(this.elements[i], events, fn)
  }
  return this
}

tQuery.prototype.hide = function() {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].style.display = 'none'
  }
  return this
}

tQuery.prototype.show = function() {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].style.display = 'block' // 如果是 内联元素 不应该赋给 block。
  }
  return this
}

tQuery.prototype.hover = function(enter, outer) {
  this.on('mouseenter', enter)
  this.on('mouseleave', outer)
  return this
}

tQuery.prototype.css = function(attr, value) {
  if (arguments.length === 2) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].style[attr] = value
    }
  } else if (arguments.length === 1) {
    if (typeof attr === 'object') {
      for (var key in attr) {
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].style[key] = attr[key]
        }
      }
    } else {
      return this.getStyle(this.elements[0], attr)
    }
  }
  return this
}

tQuery.prototype.attr = function(attr, value) {
  if (arguments.length === 2) {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].setAttribute(attr, value)
    }
  } else if (arguments.length === 1) {
    return this.elements[0].getAttribute(attr)
  }
  return this
}

tQuery.prototype.eq = function(num) {
  return $(this.elements[num])
}

tQuery.prototype.index = function() {
  var elems = this.elements[0].parentNode.children
  for (var i = 0; i < elems.length; i++) {
    if (elems[i] === this.elements[0]) {
      return i
    }
  }
}

tQuery.prototype.find = function(sel) {
  var arr = []
  if (sel.charAt(0) === '.') {
    for (var i = 0; i < this.elements.length; i++) {
      arr = arr.concat(getByClass(this.elements[i], sel.substring(1)))
    }
  } else if (sel.charAt(0) === '#') {

  } else {
    for (var i = 0; i < this.elements.length; i++) {
      arr = arr.concat(toArray(this.elements[i].getElementsByTagName(sel)))
    }
  }
  return $(arr)
}