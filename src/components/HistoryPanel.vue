<template>
    <v-menu  v-model="showHistory" :close-on-content-click="false" max-width="600">
      <!-- 列表渲染 -->
      <div  :class="['history-item-container']">
        <!-- 无意义input，用于抢占焦点,解决弹窗导致按钮mouseout失效，tip一直展示 -->
        <input class="nomeaning-input" ref="noMeaningInput"/>
        <div v-if="data.length > 0">
          <div :class="[viewMore ? 'view-more' : 'no-view-more']">
            <div v-for="(item, index) in computedData" :key="index" @click="()=>historyItemClick(item)">
              <a :href="item.url" target="_blank"  class="history-item">
                <v-icon>$IconArrow</v-icon>
                <div class="text-info">
                  <div class="text-title">
                    {{ item.name }}
                  </div>
                  <div class="text-time-and-url">
                    <!-- {{ item.showDate }} · {{ item.showUrl }} -->
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div class="view-more-btn" v-if="!noShowViewMore">
            <span
              @click="onClickViewMore"
              :class="isLoading ? 'loading-color' : ''"
              ><v-icon v-if="isLoading" size="16" class="loading-icon"
                >$IconArrow</v-icon
              >
              {{
                isLoading ? 'Loading...' : viewMore ? 'View Less' : 'View More'
              }}
              <v-icon size="16" v-if="!isLoading" :class="[viewMore ? 'arrow-up': 'arrow-down' ]">$IconArrow</v-icon>
            </span>
          </div>
        </div>
        <div class="no-item" v-else>
          <v-icon size="100">$IconArrow</v-icon>
          <div class="no-history-text">
            Recently opened documents are shown here
          </div>
        </div>
      </div>
    </v-menu>
  </template>
  <script>


  import { mapState } from 'pinia'
  import { useEditorContent } from "@/store/editorContent";
import { computed } from 'vue';
  

  export default {
    name: 'HistoryPanel',
    data() {
      return {
        showHistory: false,
        viewMore: false,
        isLoading:false,
        defaultViewNum: 5,
        noShowViewMore: false,
        data: computed(()=> {
            const items = useEditorContent().fileInfo
            const data = []
            for(const item in items) {
                data.push(Object.assign({id:item},items[item]))
            }
            return data
        }),
      }
    },
    inject: [ 'eventBus' ],
    computed: {
      computedData() {
        if (this.data.length <= this.defaultViewNum) {
          this.noShowViewMore = true
        }else {
          this.noShowViewMore = false
        }
        if (this.viewMore) {
          return this.data
        }
        return this.data.slice(0, this.defaultViewNum)
      },
      ...mapState(useEditorContent, ['fileInfo']),
    },
    methods: {
      historyItemClick(item) {
        this.showHistory = false
        this.eventBus.emit('history-file-open',item)
      },
      async onClickViewMore() {
        if(this.isLoading) {
          return
        }
        //模拟请求
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.viewMore = !this.viewMore;
        }, 1000);
      }
    }
  }
  </script>
  <style scoped>
  .history-item-container {
    position: relative;
    padding: 12px 3px 12px 12px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(13, 13, 13, 0.12);
    box-shadow: 0px 12px 32px 0px rgba(13, 13, 13, 0.08);
    border-radius: 16px;
  }
  .no-view-more {
    max-height: 380px;
    padding-right: 9px;
    overflow: hidden;
  }
  .view-more {
    max-height: 300px;
    padding-right: 3px;
    overflow: overlay;
  }
  .view-more::-webkit-scrollbar {
    width: 6px;
  }
  .view-more::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
    height: 6px;
    margin-top: 10px;
  }
  .history-item {
    border-radius: 6px;
    min-height: 56px;
    padding: 9px 12px 9px 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    outline: none;
    color: #000;
  }
  .history-item:hover {
    background-color: rgba(13, 13, 13, 0.06);
  }
  .history-item:active {
    background-color: rgba(13, 13, 13, 0.1);
  }
  .text-info {
    margin-left: 12px;
    width: 240px;
    user-select:none;
  }
  .text-title {
    color: rgba(37, 52, 83, 0.9);
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .text-time-and-url {
    color: rgba(37, 52, 83, 0.5);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .no-item {
    color: rgba(37, 52, 83, 0.7);
    font-size: 14px;
    font-weight: 400;
    line-height: 19px;
    width: 306px;
    height: 354px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
  }
  .no-history-text {
    max-width: 240px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 19px;
    color:rgba(37, 52, 83, 0.7);
    text-align:center;
  }
  .no-history-btn {
    cursor: pointer;
    height: 32px;
    box-sizing: border-box;
    padding: 4px 15px 4px 15px;
    background-color: rgba(10, 108, 255, 1);
    color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    user-select: none;
  }
  .no-history-btn:active {
    background-color: rgb(79, 149, 255);
  }
  .view-more-btn {
    height: 56px;
    margin: 12px 12px 0 12px;
    padding-top:12px;
    border-top: 1px solid rgba(13, 13, 13, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(30, 95, 199, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .view-more-btn span {
    display: flex;
    align-items: center;
    cursor:pointer;
    user-select:none;
  }
  .loading-color {
    cursor:unset !important;
    color: rgba(37, 52, 83, 0.9);
  }
  .loading-icon {
    margin-right: 8px;
    animation: rotate 0.5s linear infinite;
  }
  .nomeaning-input {
    position: absolute;
    right: 999px;
  }
  .open-local-btn {
    border-radius: 4px;
    margin-left: auto;
    padding: 1px 4px;
    height: 24px;
  }
  .open-local-btn:hover {
    background-color: rgba(13,13,13,0.06);
  }
  .open-local-btn:active {
    background-color: rgba(13,13,13,0.1);
  }
  .arrow-down {
    margin-top: 2px;
    margin-left: 8px;
  }
  .arrow-up {
    margin-top: 2px;
    margin-left: 8px;
    transform: rotate(180deg);
  }
  @keyframes rotate{
      0%{
          transform: rotateZ(0deg);
      }
      100%{
          transform: rotateZ(360deg);
      }
  }
  </style>
  