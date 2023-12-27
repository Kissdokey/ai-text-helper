import {emitter} from '@/main.js'
const CtrlSDirective = {  
    mounted(el, binding) {  
      const handleKeyDown = (event) => {  
        if (event.ctrlKey && event.key === 's') {  
          event.preventDefault()  
          // 在这里执行保存操作  
            emitter.emit('ctrl-s')
          // 调用指令绑定的回调函数（如果有的话）  
          if (typeof binding.value === 'function') {  
            binding.value()  
          }  
        }  
      }  
    
      el.addEventListener('keydown', handleKeyDown)  
    
      // 在组件销毁时移除事件监听  
      const beforeUnmount = () => {  
        el.removeEventListener('keydown', handleKeyDown)  
      }  
    
      // 使用Vue提供的onBeforeUnmount钩子来监听组件销毁事件  
      if (typeof el.__vueBeforeUnmount__ === 'undefined') {  
        el.__vueBeforeUnmount__ = []  
      }  
      el.__vueBeforeUnmount__.push(beforeUnmount)  
    },  
  }  
    
  export default CtrlSDirective  