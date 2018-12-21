<template>
  <nav class="mui-bar mui-bar-tab ft-tab">
    <a class="nav-tab-item" href="/">
      <span class="tab-icon icon-home"></span>
      <span class="mui-tab-label">首页</span>
    </a>
    <a class="nav-tab-item" href="/mall/orderfromindex">
      <span class="tab-icon icon-order"></span>
      <span class="mui-tab-label">订单管理</span>
    </a>
    <a class="nav-tab-item" href="/mall/ScoreGold">
      <span class="tab-icon icon-zhibi"></span>
      <span class="mui-tab-label">我的智币</span>
    </a>
  </nav>
</template>


<style>
  .ft-tab .icon-home {
  background: url(/Content/image/home.png) no-repeat;
  width: 0.48rem;
  height: 0.47rem;
  background-size: 0.48rem 0.47rem;
  }
  .ft-tab .mui-tab-label {
  display: block;
  font-size: 0.24rem;
  }
  .ft-tab .icon-order {
  background: url(/Content/image/shop/oder.png) no-repeat;
  background-size: 100% 100%;
  }
  .ft-tab .icon-zhibi {
  background: url(/Content/image/shop/gobel.png) no-repeat;
  background-size: 100% 100%;
  }
</style>