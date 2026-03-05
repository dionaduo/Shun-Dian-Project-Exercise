<template>
  //头部组件
  <Header/>
  //登录主体部分
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 手机号输入框 -->
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="请输入手机号"
              class="form-input"
              maxlength="11"
              @blur="validatePhone"
          />
          <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
        </div>

        <!-- 图形验证码 -->
        <div class="form-group">
          <label for="captcha">图形验证码</label>
          <div class="code-input-wrapper">
            <input
                id="captcha"
                v-model="formData.captcha"
                type="text"
                placeholder="请输入图形验证码"
                class="form-input code-input"
                maxlength="4"
                @keyup.enter="handleLogin"
            />
            <div
                id="v_container"
                class="captcha-image"
                @click="refreshCaptcha"
                :title="'点击刷新验证码'"
            ></div>
          </div>
          <div v-if="errors.captcha" class="error-message">{{ errors.captcha }}</div>
        </div>

        <!-- 短信验证码输入框 -->
        <div class="form-group">
          <label for="smsCode">短信验证码</label>
          <div class="code-input-wrapper">
            <input
                id="smsCode"
                v-model="formData.smsCode"
                type="text"
                placeholder="请输入短信验证码"
                class="form-input code-input"
                maxlength="6"
                @keyup.enter="handleLogin"
            />
            <button
                type="button"
                @click="getSmsCode"
                class="code-btn"
                :disabled="isSmsCodeSending || countdown > 0"
            >
              {{ smsCodeText }}
            </button>
          </div>
          <div v-if="errors.smsCode" class="error-message">{{ errors.smsCode }}</div>
        </div>

        <!-- 登录按钮 -->
        <button
            type="submit"
            class="login-btn"
            :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="loading-spinner"></span>
          {{ isSubmitting ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
  <Footer/>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import md5 from 'md5';
import GVerify from './GVerify.js';
import {ElMessage} from 'element-plus';

const route = useRoute()
const router = useRouter()

// 表单数据
const formData = reactive({
                            phone: '',
                            captcha: '',
                            smsCode: ''
                          });

// 错误信息
const errors = reactive({
                          phone: '',
                          captcha: '',
                          smsCode: ''
                        });

// 状态控制
const isSubmitting = ref(false);
const isSmsCodeSending = ref(false);
const countdown = ref(0);
let verifyCode = null;
let countdownTimer = null;

// 计算属性
const smsCodeText = computed(() => {
  if (isSmsCodeSending.value) return '发送中...';
  if (countdown.value > 0) return `${countdown.value}秒后重发`;
  return '获取验证码';
});

// 初始化图形验证码
onMounted(() => {
  setTimeout(() => {
    if (document.getElementById('v_container')) {
      verifyCode = new GVerify({
                                 id: 'v_container',
                                 width: '100',
                                 height: '38',
                                 type: 'number'
                               });
    }
  }, 100);
});

// 组件销毁前清理
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

// 刷新图形验证码
const refreshCaptcha = () => {
  if (verifyCode) {
    verifyCode.refresh();
    formData.captcha = '';
    errors.captcha = '';
  }
};

/**
 * 生成签名 - 获取验证码专用
 */
const generateSmsCodeSign = (mobile, type, timestamp) => {
  // 按照官方格式拼接：mobile + type + timestamp + md5Key
  const str = mobile + type + timestamp + 'md5Key';
  return md5(str);
};

// 验证手机号
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!formData.phone) {
    errors.phone = '请输入手机号';
    return false;
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = '请输入正确的手机号格式';
    return false;
  } else {
    errors.phone = '';
    return true;
  }
};

// 验证图形验证码
const validateCaptcha = () => {
  if (!formData.captcha) {
    errors.captcha = '请输入图形验证码';
    return false;
  }

  if (!verifyCode) {
    errors.captcha = '验证码初始化失败，请刷新页面';
    return false;
  }

  const isValid = verifyCode.validate(formData.captcha);

  if (!isValid) {
    errors.captcha = '图形验证码错误';
    setTimeout(() => {
      refreshCaptcha();
    }, 500);
    return false;
  }

  errors.captcha = '';
  return true;
};

// 显示提示消息
const showMessage = (message, type = 'error') => {
  if (ElMessage) {
    ElMessage[type](message);
  } else {
    alert(message);
  }
};

// 获取短信验证码（保留API接口）
const getSmsCode = async () => {
  if (!validatePhone()) return;
  if (!validateCaptcha()) return;
  if (isSmsCodeSending.value || countdown.value > 0) return;

  isSmsCodeSending.value = true;

  try {
    const timestamp = Date.now();
    const sign = generateSmsCodeSign(formData.phone, '12', timestamp);

    const requestData = {
      mobile: formData.phone,
      type: '12',
      timestamp: timestamp,
      sign: sign
    };

    console.log('发送验证码请求数据:', requestData);

    const response = await fetch('/api/api/app/login/getVerificationCode', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-platform': 'pc',
        'x-mall-code': 'SD001',
      },
      body: new URLSearchParams(requestData).toString(),
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      console.log('验证码发送成功:', result);
      startCountdown();
      showMessage('短信验证码发送成功，请注意查收', 'success');
    } else {
      throw new Error(result.message || `发送失败 (${response.status})`);
    }
  } catch (error) {
    console.error('获取短信验证码失败:', error);

    if (error.message.includes('Failed to fetch')) {
      showMessage('网络连接失败，请检查网络或代理配置');
    } else {
      showMessage(`获取验证码失败: ${error.message}`);
    }

    refreshCaptcha();
  } finally {
    isSmsCodeSending.value = false;
  }
};

// 倒计时功能
const startCountdown = () => {
  countdown.value = 60;

  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
};

// 验证表单
const validateForm = () => {
  let isValid = true;

  if (!validatePhone()) {
    isValid = false;
  }

  if (!validateCaptcha()) {
    isValid = false;
  }

  if (!formData.smsCode) {
    errors.smsCode = '请输入短信验证码';
    isValid = false;
  } else if (!/^\d{6}$/.test(formData.smsCode)) {
    errors.smsCode = '短信验证码格式不正确';
    isValid = false;
  } else {
    errors.smsCode = '';
  }

  return isValid;
};

// 本地登录（模拟登录成功）
const handleLogin = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 创建本地用户信息
    const userInfo = {
      id: Date.now(),
      mobile: formData.phone,
      userName: `M${formData.phone.slice(-4)}`,
      token: 'local_token_' + Date.now(),
      loginTime: new Date().toISOString()
    };

    // 存储用户信息
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('token', userInfo.token);

    showMessage('登录成功！', 'success');

    // 触发storage事件，通知其他标签页更新
    window.dispatchEvent(new Event('storage'));

    // 获取重定向地址
    const redirect = route.query.redirect || '/';

    // 跳转到原页面或首页
    setTimeout(() => {
      router.push(redirect);
    }, 1500);

  } catch (error) {
    console.error('登录失败:', error);
    showMessage(`登录失败: ${error.message}`);
    refreshCaptcha();
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 样式保持不变 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 20px;
  min-height: calc(100vh - 200px);
}

.login-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  height: 20px;
}

.form-input:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 46px;
  cursor: pointer;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.captcha-image:hover {
  border-color: #d32f2f;
}

.captcha-image canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.code-btn {
  padding: 0 15px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
  min-width: 110px;
  height: 48px;
}

.code-btn:hover:not(:disabled) {
  background: #c62828;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
}

.code-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-btn {
  padding: 14px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background: #c62828;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }

  .code-input-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .code-btn {
    min-width: auto;
    height: 44px;
  }

  .captcha-image {
    width: 100%;
    height: 44px;
  }
}
</style>
