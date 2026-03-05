<template>
  <div class="sundan-home">
    <!-- 顶部区域 -->
    <header class="site-header">
      <div class="top-bar">
        <span>深圳市</span>
        <div class="top-links">
          <a href="#">顺电招聘</a>
          <a href="#">我的顺电</a>
          <a href="#">家电医院</a>
          <a href="#">为您服务</a>
          <a href="#">更多精选</a>
          <a href="#">手机顺电</a>
          <a href="#">品牌入驻</a>
          <a href="#">仓库招租</a>
        </div>
      </div>

      <!-- 主导航 -->
      <div class="main-header">
        <div class="logo-area">
          <h1 class="logo">顺电<span class="logo-sub">sundan</span></h1>
          <p class="slogan">专注·高端·电器</p>
          <p class="promo-tag">松下冰洗</p>
        </div>

        <div class="search-area">
          <div class="search-box">
            <input type="text"
                   v-model="searchKeyword"
                   @keyup.enter="search"
                   placeholder="搜索" />
            <button class="search-btn" @click="search">搜索</button>
          </div>
        </div>

        <div class="header-actions">
          <!-- 根据登录状态显示不同内容 -->
          <div v-if="isLoggedIn" class="user-info">
            <el-dropdown @command="handleUserAction">
              <span class="user-name">
                {{ displayName }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <button v-else class="login-btn" @click="handleLogin">登录</button>

          <router-link to="/cart" class="cart-link">
            <span class="cart-icon">🛒</span>
            购物车
            <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- 主导航菜单 -->
      <nav class="main-nav">
        <div class="all-categories">
          <span>所有商品分类</span>
        </div>
        <ul class="nav-menu">
          <li><a href="#" :class="{ active: currentRoute === '/' }" @click.prevent="goHome">首页</a></li>
          <li><a href="#">Apple授权店</a></li>
          <li><a href="#">戴森专区</a></li>
          <li><a href="#">新品</a></li>
          <li><a href="#">样品出清</a></li>
          <li><a href="#">每周特惠</a></li>
          <li><a href="#">手机专区</a></li>
          <li><a href="#">厨电专区</a></li>
          <li><a href="#">卡萨帝专区</a></li>
          <li><a href="#">摄影专区</a></li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const route = useRoute();

// 响应式数据
const searchKeyword = ref("");
const cartCount = ref(0);
const userInfo = ref(null);
const currentRoute = computed(() => route.path);

// 计算属性：是否已登录
const isLoggedIn = computed(() => {
  return !!userInfo.value;
});

// 计算属性：显示名称（M+手机号尾号）
const displayName = computed(() => {
  if (!userInfo.value || !userInfo.value.phone) return "";

  const phone = userInfo.value.phone;
  // 获取手机号最后4位
  const lastFour = phone.slice(-4);
  return `M${lastFour}`;
});

// 从localStorage读取用户信息
const loadUserInfo = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      userInfo.value = JSON.parse(stored);
    } else {
      userInfo.value = null;
    }
  } catch (error) {
    console.error("读取用户信息失败:", error);
    userInfo.value = null;
  }
};

// 监听路由变化，重新检查登录状态（处理登录后返回）
watch(() => route.path, () => {
  loadUserInfo();
});

// 组件挂载时加载用户信息
onMounted(() => {
  loadUserInfo();

  // 监听storage变化（处理多标签页同步）
  window.addEventListener("storage", (e) => {
    if (e.key === "userInfo") {
      loadUserInfo();
    }
  });
});

// 导航方法
const goHome = () => {
  router.push("/");
};

const handleLogin = () => {
  router.push("/login");
};

const search = () => {
  if (searchKeyword.value.trim()) {
    router.push({
                  path: "/search",
                  query: { keyword: searchKeyword.value }
                });
  }
};

// 处理用户操作
const handleUserAction = (command) => {
  switch (command) {
    case "profile":
      router.push("/user/profile");
      break;
    case "orders":
      router.push("/user/orders");
      break;
    case "favorites":
      router.push("/user/favorites");
      break;
    case "logout":
      handleLogout();
      break;
  }
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    // 清除用户信息
    localStorage.removeItem("userInfo");
    userInfo.value = null;

    ElMessage.success("退出登录成功");

    // 如果当前在需要登录的页面，跳转到首页
    const needAuthPaths = ["/user", "/cart/checkout"];
    if (needAuthPaths.some(path => route.path.startsWith(path))) {
      router.push("/");
    }
  }).catch(() => {});
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

.sundan-home {
  background-color: #f8f8f8;
}

/* 顶部栏 */
.site-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: #f8f8f8;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #eee;
}

.top-links a {
  margin-left: 20px;
  color: #666;
  text-decoration: none;
}

.top-links a:hover {
  color: #d32f2f;
}

/* 主头部 */
.main-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.logo-area {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.logo {
  font-size: 28px;
  color: #d32f2f;
  font-weight: bold;
  margin-right: 10px;
}

.logo-sub {
  font-size: 18px;
  color: #333;
  font-weight: normal;
  margin-left: 5px;
}

.slogan {
  font-size: 12px;
  color: #999;
  margin: 0 20px;
  padding: 2px 10px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.promo-tag {
  font-size: 14px;
  color: #d32f2f;
  font-weight: bold;
}

.search-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  width: 500px;
  border: 2px solid #d32f2f;
  border-radius: 4px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-btn {
  padding: 10px 25px;
  background-color: #d32f2f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.search-btn:hover {
  background-color: #c62828;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 用户信息样式 */
.user-info {
  position: relative;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.user-name:hover {
  background-color: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

/* 登录按钮 */
.login-btn {
  padding: 8px 25px;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

/* 购物车链接 */
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.cart-link:hover {
  background-color: #f8f8f8;
  color: #d32f2f;
}

.cart-icon {
  font-size: 20px;
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d32f2f;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主导航菜单 */
.main-nav {
  display: flex;
  background-color: #d32f2f;
  color: white;
}

.all-categories {
  background-color: #c62828;
  padding: 12px 30px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
}

.all-categories:hover {
  background-color: #b71c1c;
}

.nav-menu {
  display: flex;
  list-style: none;
  flex: 1;
  margin-left: 20px;
}

.nav-menu li {
  margin: 0;
}

.nav-menu a {
  display: block;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.nav-menu a:hover,
.nav-menu a.active {
  background-color: #c62828;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-menu {
    flex-wrap: wrap;
  }

  .search-box {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .main-header {
    flex-wrap: wrap;
  }

  .logo-area {
    order: 1;
    flex: 1 0 100%;
    margin-bottom: 15px;
  }

  .search-area {
    order: 3;
    flex: 1 0 100%;
    margin-top: 15px;
  }

  .header-actions {
    order: 2;
    margin-left: auto;
  }

  .user-name {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

.sundan-home {
  background-color: #f8f8f8;
}

/* 顶部栏 */
.site-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: #f8f8f8;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #eee;
}

.top-links a {
  margin-left: 20px;
  color: #666;
  text-decoration: none;
}

.top-links a:hover {
  color: #d32f2f;
}

/* 主头部 */
.main-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.logo-area {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.logo {
  font-size: 28px;
  color: #d32f2f;
  font-weight: bold;
  margin-right: 10px;
}

.logo-sub {
  font-size: 18px;
  color: #333;
  font-weight: normal;
  margin-left: 5px;
}

.slogan {
  font-size: 12px;
  color: #999;
  margin: 0 20px;
  padding: 2px 10px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.promo-tag {
  font-size: 14px;
  color: #d32f2f;
  font-weight: bold;
}

.search-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  width: 500px;
  border: 2px solid #d32f2f;
  border-radius: 4px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-btn {
  padding: 10px 25px;
  background-color: #d32f2f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn {
  padding: 8px 20px;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.login-btn:hover {
  background-color: #f1e6e6;
}

.cart-link{
  align-items: center;
  gap: 10px;
  color: #333;
  text-decoration: none;
}
.cart {
  position: relative;
  cursor: pointer;
}

.cart-icon {
  font-size: 24px;

}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #d32f2f;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主导航菜单 */
.main-nav {
  display: flex;
  background-color: #d32f2f;
  color: white;
}

.all-categories {
  background-color: #c62828;
  padding: 12px 30px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  list-style: none;
  flex: 1;
  margin-left: 20px;
}

.nav-menu li {
  margin: 0;
}

.nav-menu a {
  display: block;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.nav-menu a:hover, .nav-menu a.active {
  background-color: #c62828;
}


/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-menu {
    flex-wrap: wrap;
  }

  .search-box {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .main-header {
    flex-wrap: wrap;
  }

  .logo-area {
    order: 1;
    flex: 1 0 100%;
    margin-bottom: 15px;
  }

  .search-area {
    order: 3;
    flex: 1 0 100%;
    margin-top: 15px;
  }

  .user-actions {
    order: 2;
  }

  .slide-content {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
  }

  .slide-text {
    padding-right: 0;
    margin-bottom: 40px;
  }

  .slide-title {
    font-size: 36px;
  }

  .slide-subtitle {
    font-size: 22px;
  }
}
</style>
