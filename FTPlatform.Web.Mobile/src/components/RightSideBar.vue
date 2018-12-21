<script>
export default {
    name: 'rightsidebar'
}
</script>
<template>
    <div class="side-bar">
        <a href="http://p.qiao.baidu.com/cps2/chatIndex?reqParam=%7B%22from%22%3A0%2C%22sessionid%22%3A%22%22%2C%22siteId%22%3A%2211390259%22%2C%22tid%22%3A%22-1%22%2C%22userId%22%3A%2218851283%22%2C%22ttype%22%3A1%7D">免费咨询</a>
    </div>
</template>

<style>
.side-bar {
  position: fixed;
  top: 75%;
  right: 0;
  background: url(/Content/image/advice-bg.png) no-repeat;
  width: 2.08rem;
  height: 0.88rem;
  background-size: 2.08rem 0.88rem;
  color: #fff;
  z-index: 5;
}

.side-bar a {
  display: block;
  color: #fff;
  font-size: 0.24rem;
  width: 50%;
  margin-left: 0.9rem;
  margin-top: 0.3rem;
  line-height: 1;
}
</style>
