// UUID
import uuid from 'node-uuid'
import Events from '../cc.objectEvents'
export default {
  // Global
  layertop () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    if (obj) {
      obj.bringToFront()
      canvas.renderAll()
      window.vue.$children[0].$emit('updateHistory')
      window.bus.$emit('updateScene')
      window.vue.$children[0].$emit('closeContextMenu')
    }
  },
  layerup () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    if (obj) {
      obj.bringForward()
      canvas.renderAll()
      window.vue.$children[0].$emit('updateHistory')
      window.bus.$emit('updateScene')
      window.vue.$children[0].$emit('closeContextMenu')
    }
  },
  layerdown () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    if (obj) {
      obj.sendBackwards()
      canvas.renderAll()
      window.vue.$children[0].$emit('updateHistory')
      window.bus.$emit('updateScene')
      window.vue.$children[0].$emit('closeContextMenu')
    }
  },
  layerbottom () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    if (obj) {
      obj.sendToBack()
      canvas.renderAll()
      window.vue.$children[0].$emit('updateHistory')
      window.bus.$emit('updateScene')
      window.vue.$children[0].$emit('closeContextMenu')
    }
  },
  duplicate () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    var sliderTranslate
    switch (obj.type) {
      case 'slider':
        sliderTranslate = '矩形'
        break
      case 'sliderE':
        sliderTranslate = '圓形'
        break
      case 'sliderT':
        sliderTranslate = '三角形'
        break
      case 'plaintext':
        sliderTranslate = '靜態文字'
        break
      case 'clock':
        sliderTranslate = '時鐘'
        break
      case 'eclock':
        sliderTranslate = '時間'
        break
      case 'marquee':
        sliderTranslate = '跑馬燈文字'
        break
      case 'rss':
        sliderTranslate = 'RSS'
        break
      case 'usbframe':
        sliderTranslate = 'USB'
        break
      case 'webview':
        sliderTranslate = '網頁'
        break
      case 'rtspframe':
        sliderTranslate = '視訊'
        break
      case 'temperature':
        sliderTranslate = '天氣溫度'
        break
      case 'location':
        sliderTranslate = '天氣地點'
        break
    }
    var newObject
    if (obj) {
      // Slider Clone
      if (obj.type === 'slider' || obj.type === 'sliderE' || obj.type === 'sliderT') {
        if (obj.slides) {
          window.vue.$children[0].$emit('globalError', '已含有圖層的 Slider 物件無法複製，請建立新的 Slider。')
        } else {
          // Normal Clone
          newObject = obj.clone()
          // Move New Object
          newObject.left = newObject.left + 10
          newObject.top = newObject.top + 10
          // Assign a new id for new Object
          newObject.id = uuid.v4()
          newObject.name = sliderTranslate + ' - ' + window.vue.$store.state.objects[obj.type]
          canvas.add(newObject)
          window.vue.$store.commit('increment', obj.type)
          canvas.setActiveObject(newObject)
          canvas.renderAll()
          window.vue.$children[0].$emit('updateHistory')
          window.vue.$children[0].$emit('closeContextMenu')
        }
      } else if (obj.type === 'usbframe') {
        window.vue.$children[0].$emit('globalError', '畫布已含有 USB 框架。')
      } else if (obj.type === 'weatherimg') {
        // Normal Clone
        newObject = obj.clone((o) => {
          // Move New Object
          o.set('left', o.left + 10)
          o.set('top', o.top + 10)
          // Assign a new id for new Object
          o.set('id', uuid.v4())
          canvas.add(o)
          Events.bindEvents(window.vue.$children[0], o)
          canvas.setActiveObject(o)
          canvas.renderAll()
          window.vue.$children[0].$emit('updateHistory')
          window.vue.$children[0].$emit('closeContextMenu')
        })
      } else {
        // Normal Clone
        newObject = obj.clone()
        // Move New Object
        newObject.set('left', newObject.left + 10)
        newObject.set('top', newObject.top + 10)
        // Assign a new id for new Object
        newObject.set('id', uuid.v4())
        if (newObject.type === 'marquee') {
          newObject.set('marquee', {
            source: obj.marquee.source,
            transitionType: obj.marquee.transitionType,
            speed: obj.marquee.speed,
            size: obj.marquee.size,
            fontface: obj.marquee.fontface,
            fontcolor: obj.marquee.fontcolor,
            backgroundColor: obj.marquee.backgroundColor
          })
        } else if (newObject.type === 'rss') {
          newObject.set('rssmarquee', {
            type: obj.rssmarquee.type,
            source: obj.rssmarquee.source,
            fontface: obj.rssmarquee.fontface,
            size: obj.rssmarquee.size,
            speed: obj.rssmarquee.speed,
            fontcolor: obj.rssmarquee.fontcolor,
            backgroundColor: obj.rssmarquee.backgroundColor
          })
        } else if (newObject.type === 'webview') {
          newObject.set('webview', {
            url: obj.webview.url,
            placeholder: obj.webview.placeholder,
            refreshRate: obj.webview.refreshRate
          })
          newObject.set('toolbox', {
            enable: obj.toolbox.enable,
            position: obj.toolbox.position,
            size: obj.toolbox.size
          })
        }
        if (window.vue.$store.state.objects[newObject.type]) {
          newObject.name = sliderTranslate + ' - ' + window.vue.$store.state.objects[newObject.type]
        } else {
          newObject.name = sliderTranslate
        }
        canvas.add(newObject)
        window.vue.$store.commit('increment', newObject.type)
        Events.bindEvents(window.vue.$children[0], newObject)
        canvas.setActiveObject(newObject)
        canvas.renderAll()
        window.vue.$children[0].$emit('updateHistory')
        window.vue.$children[0].$emit('closeContextMenu')
      }
    }
  },
  lock () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    var group = canvas.getActiveGroup()
    var targetObj = obj || group
    if (!targetObj._objects) {
      if (obj.lockMovementY === true) {
        obj.lockMovementY = false
        obj.lockMovementX = false
        obj.lockRotation = false
        obj.lockScalingX = false
        obj.lockScalingY = false
        obj.selectable = true
        obj.stroke = ''
        obj.strokeWidth = 0
        canvas.renderAll()
      } else {
        obj.lockMovementY = true
        obj.lockMovementX = true
        obj.lockRotation = true
        obj.lockScalingX = true
        obj.lockScalingY = true
        obj.selectable = false
        canvas.deactivateAllWithDispatch()
        canvas.renderAll()
      }
      window.vue.$children[0].$emit('updateHistory')
      window.vue.$children[0].$emit('closeContextMenu')
    } else {
      for (var inGroupObj of targetObj._objects) {
        if (inGroupObj.lockMovementY === true) {
          inGroupObj.lockMovementY = false
          inGroupObj.lockMovementX = false
          inGroupObj.lockRotation = false
          inGroupObj.lockScalingX = false
          inGroupObj.lockScalingY = false
          inGroupObj.selectable = true
          inGroupObj.stroke = ''
          inGroupObj.strokeWidth = 0
          canvas.renderAll()
        } else {
          inGroupObj.lockMovementY = true
          inGroupObj.lockMovementX = true
          inGroupObj.lockRotation = true
          inGroupObj.lockScalingX = true
          inGroupObj.lockScalingY = true
          inGroupObj.selectable = false
          canvas.deactivateAllWithDispatch()
          canvas.renderAll()
        }
      }
      window.vue.$children[0].$emit('updateHistory')
      window.vue.$children[0].$emit('closeContextMenu')
      window.bus.$emit('updateScene')
      // window.vue.$children[0].$emit('globalError', '錯誤')
    }
  },
  removeObject (cb) {
    var canvas = window['canvas']
    // Confirm before delete
    window.vue.$swal({
      title: '確定刪除？',
      text: '刪除後可使用 Ctrl + Z 組合鍵回復',
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: '取消',
      confirmButtonText: '確定刪除'
    }).then(() => {
      if (canvas.getActiveGroup()) {
        canvas.getActiveGroup().forEachObject(function (o) {
          if (o.type === 'image') {
            return window.vue.$children[0].$emit('globalError', '必須先離開編輯模式，才能刪除 Slider 物件中的圖片。')
          } else {
            canvas.remove(o)
          }
        })
        canvas.discardActiveGroup().renderAll()
      } else if (canvas.getActiveObject()) {
        var singleObj = canvas.getActiveObject()
        if (singleObj._element !== undefined && singleObj._element.localName === 'video') {
          singleObj.getElement().pause()
          canvas.remove(singleObj)
        } else if (singleObj.type === 'image') {
          return window.vue.$children[0].$emit('globalError', '必須先離開編輯模式，才能刪除 Slider 物件中的圖片。')
        } else if (singleObj.selectable === false) {
          return window.vue.$children[0].$emit('globalError', '無法刪除已鎖定物件')
        } else {
          canvas.remove(singleObj)
        }
        console.log('removed')
      } else {
        console.log('return')
        return
      }
      window.vue.$children[0].$emit('updateHistory')
      window.bus.$emit('updateScene')
      window.vue.$children[0].$emit('closeContextMenu')
      window.vue.$swal(
        '已刪除',
        '所選項目已刪除',
        'success'
      )
    })
    cb && cb()
  },
  loadClock (data, cb) {
    var fabric = window['fabric']
    var canvas = window['canvas']
    var objects = JSON.parse(data[0].clock)
    objects = objects.objects
    for (var i = 0; i < objects.length; i++) {
      var klass = fabric.util.getKlass(objects[i].type)
      if (klass.async) {
        klass.fromObject(objects[i], function (img) {
          canvas.add(img)
        })
      } else {
        var instance = klass.fromObject(objects[i])
        instance.id = uuid.v4()
        instance.name = '時鐘 - ' + window.vue.$store.state.objects.clock
        canvas.add(instance)
        canvas.setActiveObject(instance)
        cb && cb(instance)
      }
    }
  },
  // Ratio
  lockRatio (ratio) {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    if (ratio) {
      if (obj.type === 'sliderE') {
        // obj.scaleX = Math.floor(obj.scaleX / ratio.w)
        obj.set('rx', obj.getWidth() / 2)
        obj.set('ry', obj.rx / ratio.w * ratio.h)
        obj.set('ratio', {w: ratio.w, h: ratio.h})
        obj.scaleX = 1
        obj.scaleY = 1
        obj.setCoords()
        canvas.renderAll()
      } else {
        obj.width = Math.floor(obj.getWidth())
        obj.height = Math.floor(obj.width / ratio.w * ratio.h)
        obj.set('ratio', {w: ratio.w, h: ratio.h})
        obj.scaleX = 1
        obj.scaleY = 1
      }
      obj.lockUniScaling = true
      obj.setCoords()
      canvas.renderAll()
    } else {
      // Lock current size
      // obj.width = Math.round(obj.width * obj.scaleX)
      // obj.height = Math.round(obj.height * obj.scaleY)
      // obj.scaleX = 1
      // obj.scaleY = 1
      obj.setCoords()
      obj.lockUniScaling = true
      canvas.renderAll()
    }
  },
  unLockRatio () {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    obj.lockUniScaling = false
    obj.set('ratio', {w: 'free', h: 'free'})
    canvas.renderAll()
  },
  get_param (param) {
    var vars = {}
    window.location.href.replace(window.location.hash, '').replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function (m, key, value) {
      vars[key] = value !== undefined ? value : ''
    })
    if (param) {
      return vars[param] ? vars[param] : null
    }
    return vars
  },
  pushObject (direction, gap) {
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    var group = canvas.getActiveGroup()
    var targetObj = obj || group
    switch (direction) {
      case 'left':
        // if (obj.left <= 0) {
        //   obj.left = 0
        //   obj.setCoords()
        // } else {
        //   obj.left = obj.left - gap
        //   obj.setCoords()
        // }
        targetObj.left = targetObj.left - gap
        targetObj.setCoords()
        window.vue.$children[0].$emit('updateHistory')
        break
      case 'right':
        // if (obj.left + obj.getWidth() >= obj.canvas.width) {
        //   obj.left = obj.canvas.width - obj.getWidth()
        //   obj.setCoords()
        // } else {
        //   obj.left = obj.left + gap
        //   obj.setCoords()
        // }
        targetObj.left = targetObj.left + gap
        targetObj.setCoords()
        window.vue.$children[0].$emit('updateHistory')
        break
      case 'up':
        // if (obj.top <= 0) {
        //   obj.top = 0
        //   obj.setCoords()
        // } else {
        //   obj.top = obj.top - gap
        //   obj.setCoords()
        // }
        targetObj.top = targetObj.top - gap
        targetObj.setCoords()
        window.vue.$children[0].$emit('updateHistory')
        break
      case 'down':
        // if (obj.top + obj.getHeight() >= obj.canvas.height) {
        //   obj.top = obj.canvas.height - obj.getHeight()
        //   obj.setCoords()
        // } else {
        //   obj.top = obj.top + gap
        //   obj.setCoords()
        // }
        targetObj.top = targetObj.top + gap
        targetObj.setCoords()
        window.vue.$children[0].$emit('updateHistory')
        break
    }
    canvas.renderAll()
  },
  selectAll () {
    var fabric = window['fabric']
    var canvas = window['canvas']
    // First Deselect All
    this.deselectAll()
    var objs = canvas.getObjects().map(function (o) {
      return o.set('active', true)
    })
    var group = new fabric.Group(objs, {
      originX: 'center',
      originY: 'center'
    })
    canvas._activeObject = null
    canvas.setActiveGroup(group.setCoords()).renderAll()
  },
  deselectAll () {
    var canvas = window['canvas']
    canvas.deactivateAllWithDispatch()
  },
  isolation (state) {
    // Make Everything but selected Object inselectable
    var canvas = window['canvas']
    var obj = canvas.getActiveObject()
    var i
    for (i = 0; i < canvas._objects.length; i++) {
      if (canvas._objects[i] === obj) {

      } else {
        canvas._objects[i].selectable = !canvas._objects[i].selectable
        canvas._objects[i].evented = !canvas._objects[i].evented
      }
    }
    canvas.renderAll()
  }
}
