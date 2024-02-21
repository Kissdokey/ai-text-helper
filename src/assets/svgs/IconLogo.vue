<template>
    <div class="logo-container">
      <div class="header">AI</div>
      <div class="derection"></div>
      <div class="derection3"></div>
      <div class="derection2"></div>
    </div>
</template>
<style>
.logo-container {
  box-sizing: border-box;
  position: relative;
  width: 32px;

  height: 32px;
  box-sizing: border-box;
  background: #77a1d3; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #e684ae,
    #79cbca,
    #77a1d3
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #e684ae,
    #79cbca,
    #77a1d3
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  margin: 0 auto;
  border-radius: 8px;
  border-bottom-right-radius: 16px;
  padding-top: 6px;
}
.header {
  display: flex;
  justify-content: center;
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
}
.derection {
  width: 80%;
  height: 2px;
  border-radius: 1px;
  background: #c6ffdd; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #f7797d,
    #fbd786,
    #c6ffdd
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #f7797d, #fbd786, #c6ffdd);
  margin: 2px auto;
}
.derection3 {
  width: 50%;
  height: 2px;
  border-radius: 1px;
  background: #c6ffdd; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #f7797d,
    #fbd786,
    #c6ffdd
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #f7797d, #fbd786, #c6ffdd);
  margin-left: 3px;
}
.derection2 {
  position: absolute;
  bottom: 1px;
  right: 0px;
  border-top: 5px solid white;
  border-bottom: 5px solid transparent;
  border-left: 5px solid white;
  border-right: 5px solid transparent;
}
.derection2::after {
  content: "";
  position: absolute;
  left: -5px;
  top: 0;
  width: 9px;
  height: 1px;
  background-color: rgba(13, 13, 13, 0.3);
  transform-origin: center;
  transform: rotateZ(-45deg) scale(1.414);
}
.tianxian {
  position: absolute;
  top: -15px;
  height: 15px;
  width: 10px;
  background: #79cbca;
  left: 47.5px;
}
.tianxian::after {
  content: "";
  position: absolute;
  top: -20px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #79cbca;
  left: -5px;
}
</style>
