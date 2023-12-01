<script>
export default {
  props: {
    colorIndex: {
      type: Number,
      required: true,
    },
    type: String,
    title: String,

    eventEmitter: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      visible: false,

      colorItems: [
        { name: "Blue", rgb: "#0a23f5" },
        { name: "Green", rgb: "#87d54c" },
        { name: "Yellow", rgb: "#f8d147" },
        { name: "Orange", rgb: "#ee7830" },
        { name: "Red", rgb: "#d3393f" },
        { name: "Purple", rgb: "#963b83" },
        { name: "Light blue", rgb: "#71e2fb" },
        { name: "Light green", rgb: "#d0f885" },
        { name: "Light yellow", rgb: "#fbf394" },
        { name: "Light orange", rgb: "#f6c2a3" },
        { name: "Pink", rgb: "#ef8791" },
        { name: "Light purple", rgb: "#ec91f9" },
        { name: "White", rgb: "#ffffff" },
        { name: "Pale gray", rgb: "#cccccc" },
        { name: "Light gray", rgb: "#aaaaaa" },
        { name: "Medium grey", rgb: "#777777" },
        { name: "Dark grey", rgb: "#444444" },
        { name: "Black", rgb: "#000000" },
      ],
    };
  },

  watch: {
    colorIndex() {
      if (this.colorIndex >= 0 && this.colorIndex < this.colorItems.length) {
        this.eventEmitter.emit(
          "color-value",
          this.colorItems[this.colorIndex].rgb
        );
      } else {
        throw new Error(`Invalid color index: ${this.colorIndex}`);
      }
    },
  },

  methods: {
    itemColor(item) {
      var style = "background-color: " + item.rgb;
      if (item.name == "White") {
        style += "; box-shadow: inset 2px 2px #cacaca, inset -2px -2px #cacaca";
      }
      return style;
    },

    setCurrent(index) {
      this.eventEmitter.emit("color-index", index);
      this.visible = false;
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
    <div class="color-menu">
      <div class="color-menu-title">{{ title }}</div>

      <div class="color-container">
        <span v-for="(item, index) in colorItems" :key="index">
          <div
            class="color-item"
            :style="itemColor(item)"
            :title="item.name"
            @click.stop="setCurrent(index)"
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
