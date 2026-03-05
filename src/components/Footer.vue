<template>
  <footer class="main-footer">
    <div class="footer-top">
      <div class="container">
        <div class="footer-columns">
          <div class="footer-column">
            <h4>购物指南</h4>
            <ul>
              <li><a href="#">购物流程</a></li>
              <li><a href="#">会员介绍</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">联系客服</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>支付方式</h4>
            <ul>
              <li><a href="#">在线支付</a></li>
              <li><a href="#">分期付款</a></li>
              <li><a href="#">货到付款</a></li>
              <li><a href="#">优惠券使用</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>配送服务</h4>
            <ul>
              <li><a href="#">配送范围</a></li>
              <li><a href="#">配送时效</a></li>
              <li><a href="#">运费标准</a></li>
              <li><a href="#">安装服务</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>售后服务</h4>
            <ul>
              <li><a href="#">退换货政策</a></li>
              <li><a href="#">保修政策</a></li>
              <li><a href="#">维修服务</a></li>
              <li><a href="#">投诉建议</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#">公司简介</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">门店查询</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-promo">
      <div class="container">
        <div class="promo-grid">
          <div class="promo-item" style="background: linear-gradient(135deg, #4caf8c, #2e7d5c);">
            <h4>话费充值</h4>
            <p>话费300-500元</p>
            <div class="promo-price">立减20元</div>
          </div>
          <div class="promo-item" style="background: linear-gradient(135deg, #2196F3, #0D47A1);">
            <h4>话费红包</h4>
            <p>新用户专享</p>
            <div class="promo-price">最高100元</div>
          </div>
          <div class="promo-item" style="background: linear-gradient(135deg, #cb84d7, #a45ad0);">
            <h4>话费优惠</h4>
            <p>话费满300元</p>
            <div class="promo-price">送1GB流量</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-info">
          <p>© 2024 顺电网上商城 版权所有</p>
          <div class="footer-links">
            <a href="#">隐私政策</a>
            <a href="#">用户协议</a>
            <a href="#">法律声明</a>
            <a href="#">网站地图</a>
            <a href="#">帮助中心</a>
          </div>
          <div class="certificates">
            <span>ICP证：京ICP备12345678号</span>
            <span>公安备案：11010102001234</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件
</script>

<style scoped>
.main-footer {
  background-color: #2c3e50;
  color: white;
  margin-top: 50px;
}

.footer-top {
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

.footer-column h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ecf0f1;
}

.footer-column ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-column a {
  color: #bdc3c7;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: white;
  text-decoration: underline;
}

.footer-promo {
  padding: 30px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.promo-item {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.promo-item:hover {
  transform: translateY(-5px);
}

.promo-item h4 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.promo-item p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.promo-price {
  font-size: 24px;
  font-weight: bold;
  color: #ffcc00;
}

.footer-bottom {
  padding: 20px 0;
}

.footer-info {
  text-align: center;
  color: #95a5a6;
  font-size: 14px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
}

.footer-links a {
  color: #95a5a6;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

.certificates {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 12px;
  margin-top: 10px;
}
</style>