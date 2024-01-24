<script>
import { useColorStore } from "@/store/color";
import { mapState, mapActions } from "pinia";
import { inject } from "vue";
import { colorItems } from "@/util/constantData";
export default {
  props: {
    type: String, //color or highLight or draw or comment
    title: String,
  },

  data() {
    return {
      visible: false,
      eventBus: inject("eventBus"),
      colorItems: colorItems,
    };
  },
  computed: {
    ...mapState(useColorStore, ["wordColorIndex", "highlightColorIndex"]),
    colorIndex() {
      switch (this.type) {
        case "color": {
          return this.wordColorIndex;
        }
        case "highLight": {
          return this.highlightColorIndex;
        }
      }
    },
  },
  methods: {
    ...mapActions(useColorStore, [
      "updateWordColorIndex",
      "updateHighlightColorIndex",
    ]),
    itemColor(item) {
      var style = "background-color: " + item.rgb;
      if (item.name == "White") {
        style += "; box-shadow: inset 2px 2px #cacaca, inset -2px -2px #cacaca";
      }
      return style;
    },

    setCurrent(index) {
      switch (this.type) {
        case "color":
          {
            this.eventBus.emit("color-index", index); //抛出修改颜色事件，在tiptap中修改颜色
            this.visible = false;    //关闭菜单
            this.updateWordColorIndex(index); //更新store
          }
          break;
        case "highLight": {           //同上
          this.eventBus.emit("highLight-index", index);
          this.visible = false;
          this.updateHighlightColorIndex(index);
        }break;
      }
      this.eventBus.emit("menu-button-arrow-rotate"); //抛出事件让菜单按钮的小箭头旋转
    },

    getRGB(colorIndex) {
      if (colorIndex >= 0 && colorIndex < this.colorItems.length) {
        return this.colorItems[colorIndex].rgb;
      } else {
        throw new Error(`Invalid color index: ${colorIndex}`);
      }
    },

    getIndex(rgb) {
      return this.colorItems.findIndex((item) => item.rgb === rgb);
    },

    show() {
      this.visible = true;
    },
  },
};
</script>

<template>
  <v-menu v-model="visible" :close-on-content-click="false">
    <div class="color-menu" @click.stop>
      <div class="color-menu-title">{{ title }}</div>

      <div class="color-container">
        <span v-for="(item, index) in colorItems" :key="index">
          <div
            class="color-item"
            :style="itemColor(item)"
            :title="item.name"
            @click="setCurrent(index)"
          >
            <!-- 看着v-icon自带居中属性 -->
            <div class="select-icon">
              <v-icon v-if="index == colorIndex" size="24"
                >$IconCurrentColor</v-icon
              >
            </div>
          </div>
        </span>
      </div>
    </div>
  </v-menu>
</template>

<style scoped>
* {
  user-select: none;
}
.color-menu-title {
  font-size: 14px;
  font-weight: 800;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(37, 52, 83, 0.7);
  margin-left: 20px;
}

.color-menu {
  padding: 16px 20px 20px 0px;
  width: 200px;
  left: 676px;
  top: 188px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0px 12px 32px 0px rgba(13, 13, 13, 0.08);
  margin-left: 14px;
}

.color-container {
  width: 206px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 10px;
}

.color-item {
  position: relative;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  margin: 10px;
  cursor: pointer;
}
.select-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
