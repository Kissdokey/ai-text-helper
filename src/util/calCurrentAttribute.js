const   calCurrentAttribute = (editor,type) => {
    if(type === 'heading') {
        for (let i = 1; i < 6; i++) {
            if (editor?.isActive("heading", { level: i })) {
              return `level ${i}`;
            }
          }
          return '正文';
    }
    if(type==='color') {
      return editor?.getAttributes('textStyle').color
    }
  };
  export default  calCurrentAttribute