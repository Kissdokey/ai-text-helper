import TurndownService from 'turndown';

const turndownService = new TurndownService();



export function html2md(html, fileName='未命名markdown') {  
    const markdownString = turndownService.turndown(html);
    const element = document.createElement('a');  
    const file = new Blob([markdownString], {type: 'text/markdown'});  
    element.href = URL.createObjectURL(file);  
    element.download = fileName + '.md';  
    document.body.appendChild(element);  
    element.click();  
    document.body.removeChild(element);  
  }  

