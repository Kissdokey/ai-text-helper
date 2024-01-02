import {emitter} from '@/main.js'
const WorkSpaceRightClickDirective = {  
    mounted(el, binding) {  
      const handleMouseUp = (event) => { 
          event.preventDefault() 
            emitter.emit('workspace-setting',event) 
      }  
    
      el.addEventListener('contextmenu', handleMouseUp)  
    
      // 在组件销毁时移除事件监听  
      const beforeUnmount = () => {  
        el.removeEventListener('contextmenu', handleMouseUp)  
      }  
    
      // 使用Vue提供的onBeforeUnmount钩子来监听组件销毁事件  
      if (typeof el.__vueBeforeUnmount__ === 'undefined') {  
        el.__vueBeforeUnmount__ = []  
      }  
      el.__vueBeforeUnmount__.push(beforeUnmount)  
    },  
  }  
    
  export default WorkSpaceRightClickDirective  