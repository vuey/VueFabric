<template lang="pug">
  #artboard
    .canvas-wrapper(v-bind:class="{ pushed: currentObject || arrangement || interaction, double: canvasLayer}", @mousedown="deselectObject", @contextmenu.prevent="deselectObject")
      #canvas.task
        canvas#c
        .sizeTag
          .tag.width
              span 800
          .tag.height
              span 600
        .steps-wrapper
          button#undo.btn.basic(@click.prevent.stop="undo", v-bind:class="{disabled: history.undo.length === 0}")
            i.fa.fa-arrow-left
            | 復原 ({{history.undo.length}})
          button#redo.btn.basic(@click.prevent.stop="redo", v-bind:class="{disabled: history.redo.length === 0}")
            | 重做 ({{history.redo.length}})
            i.fa.fa-arrow-right
      slot(name="mouseplace")
    //- transition(name="fade", mode="out-in", v-on:after-enter="fitWindow", v-on:after-leave="fitWindow")
    transition(name="fade", mode="out-in", v-on:after-enter="fitWindow", v-on:after-leave="fitWindow")
      canvaslayers(v-if="canvasLayer", v-bind:currentObject="currentObject")
    interaction(v-if="interaction", v-bind:interaction="interaction")
    transition(name="fade", mode="out-in", v-on:after-enter="fitWindow", v-on:after-leave="fitWindow")
      arrangement(v-if="arrangement", v-bind:arrangement="arrangement")
    transition(name="fade", mode="out-in", v-on:after-enter="fitWindow", v-on:after-leave="fitWindow")
      attributes(v-if="currentObject", v-bind:currentObject="currentObject", v-bind:initialRadius="initialRadius")
</template>

<script>
// var fabric = window['fabric']
import Attributes from '../components/Attributes'
import Arrangement from './Arrangement'
import Interaction from './Interaction'
import initCanvas from '../assets/canvascomposer/Initial'
import Canvaslayers from './Canvaslayers'
export default {
  name: 'Artboard',
  components: {
    Attributes,
    Arrangement,
    Interaction,
    Canvaslayers
  },
  props: ['canvasLayer', 'currentObject', 'initialRadius', 'arrangement', 'interaction', 'history'],
  mounted () {
  },
  methods: {
    fitWindow () {
      console.log('Fitting the Artboard.')
      initCanvas.fit()
    },
    deselectObject (e) {
      var canvas = window['canvas']
      var obj = canvas.getActiveObject()
      if (e.type === 'contextmenu') {
        if (obj) {
          this.$parent.$emit('triggerContextMenu', [e.clientX, e.clientY])
        }
      } else {
        this.$parent.$emit('closeContextMenu')
        if (e.target.childNodes.length === 0) {
          return true
        } else {
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      }
    },
    undo () {
      this.$parent.$emit('undo')
    },
    redo () {
      this.$parent.$emit('redo')
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/var";
@import "../assets/scss/helpers";
#artboard {
  position: relative;
}
.canvas-wrapper {
  box-sizing: border-box;
  height: 100%;
  text-align: center;
  flex: 1;
  display: flex;
  align-items:center;
  justify-content:center;
  transition: .3s all ease;
  background-color: $darkestgray;
  border-right: 1px solid $pureblack;
  border-top: 1px solid $pureblack;
  border-left: 1px solid $pureblack;
  max-width: calc( 100vw - 90px );
  &.pushed {
    max-width: calc( 100vw - 400px );
    &.double {
      max-width: calc( 100vw - 710px );
    }
  }
  &.double {
    max-width: calc( 100vw - 400px );
  }
  #canvas {
    display: inline-block;
    vertical-align: middle;
  }
  .mouseplace {
    font-size: 12px;
    position: absolute;
    bottom: 2em;
    left: 0;
    right: 0;
    opacity: .5; 
  }
}
#canvas {
  position: relative;
  transform-origin: center center;
  transition: .3s all ease;
  .objectControl {
    @extend .transition;
    opacity: 0;
    position: absolute;
    font-size: 1rem;
    left: .2em;
    top: -40px;
    box-sizing: borde-box;
    z-index: 2;
    &.active {
      opacity: 1;
      top: .2em;
    }
    .btn {
      padding: .2em 1em;
    }
  }
  &:hover {
    .sizeTag {
      opacity: .2;
    }
  }
  .sizeTag {
    @extend .transition;
    margin: 2em;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    border-left: 1px solid $black;
    border-top: 1px solid $black;
    opacity: 0.1;
    .tag {
      background-color: $black;
      color: $white;
      padding: 0 1em;
      border-radius: 3px;
      font-size: .8em;
      &.height {
        position: absolute;
        bottom: 0;
        right: calc( 100% + .9em );
        transform: rotate(90deg);
        transform-origin: 100% 100%;
      }
      &.width {
        position: absolute;
        top: -.9em;
        right: 0;
      }
    }
  }
  .steps-wrapper {
    position: absolute;
    left: .5em;
    top: .5em;
    button {
      padding: .5em 1em;
      i {
        margin-right: .5em;
      }
      &:last-child {
        i {
          margin-left: .5em;
          margin-right: 0;
        }
      }
    }
  }
}
.canvas-container {
  margin: 0 auto;
  // background-color: $white;
  background-image: url(data:image/gif;base64,R0lGODlhCgAKAIAAAOLi4v///yH5BAAHAP8ALAAAAAAKAAoAAAIRhB2ZhxoM3GMSykqd1VltzxQAOw==);
  box-shadow: 0px 3px 3px rgba(0,0,0,.33);
  @extend .transition;
  &:hover {
    box-shadow: 0px 3px 3px rgba(0,0,0,.66);
  }
}
</style>
