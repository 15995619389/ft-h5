<template>
  <nav class="mui-bar mui-bar-tab ft-tab">
    <a class="nav-tab-item mui-active" v-on:click="turn('Updatemanger')">
      <span class="tab-icon icon-update"></span>
      <span class="mui-tab-label">升级技术合伙人</span>
    </a>
    <a class="nav-tab-item " v-on:click="turn('AgentReward')" id="reward">
      <span class="tab-icon icon-reward"></span>
      <span class="mui-tab-label">我的奖励</span>
    </a>
    <a class="nav-tab-item" v-on:click="turn('memberindex')" id="agent">
      <span class="tab-icon icon-manger"></span>
      <span class="mui-tab-label">技术合伙人成果</span>
    </a>
  </nav>
</template>

<script>
var r = window.location.href
var s = r.indexOf('?')
if (s == -1) {
    r = '/'
} else {
    r = r.substring(s + 1, r.length)
}
export default {
    name: 'agent-nav',
    data: function () {
        return {
            burl: r
        }
    },
    methods: {
        turn: function (opts) {
            window.location.href = '/agent/' + opts + '?' + this.$data.burl
        }
    }
}
</script>
