<template>
  <div id="app">
    <router-view />
  </div>
</template>
//nnnnnnn

<script setup>
// 路由视图会自动渲染对应组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Microsoft YaHei", Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 全局样式变量 */
:root {
  --primary-blue: #0056b3;
  --primary-red: #e4393c;
  --text-primary: #333;
  --text-secondary: #666;
  --border-color: #eee;
  --bg-light: #f8f8f8;
}
</style>
