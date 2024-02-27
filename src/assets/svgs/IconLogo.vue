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
  background: #77a1d3;
  background: var(--ath-logo-background);
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
  background-image: var(--ath-logo-text-background);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.derection {
  width: 80%;
  height: 2px;
  border-radius: 1px;
  background: #c6ffdd;
  background: var(--ath-logo-derection1-background);
  margin: 2px auto;
}
.derection3 {
  width: 50%;
  height: 2px;
  border-radius: 1px;
  background: #c6ffdd;
  background: var(--ath-logo-derection1-background);
  margin-left: 3px;
}
.derection2 {
  position: absolute;
  bottom: 1px;
  right: 0px;
  border-top: 5px solid var(--ath-logo-derection2-background);
  border-bottom: 5px solid transparent;
  border-left: 5px solid var(--ath-logo-derection2-background);
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
</style>
