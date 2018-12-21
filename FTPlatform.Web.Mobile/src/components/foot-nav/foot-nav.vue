<template>
    <div class="mui-bar mui-bar-tab" id="ft-foot-nav">
        <a href="/">
            <span class="tab-icon icon-home"></span>
            <span class="mui-tab-label">首页</span>
        </a>
        <a href="/demand/">
            <span class="tab-icon icon-need"></span>
            <span class="mui-tab-label">技术需求库</span>
        </a>
        <qp></qp>
        <a href="/expert/">
            <span class="tab-icon icon-resouce"></span>
            <span class="mui-tab-label">技术资源库</span>
        </a>
        <a href="/mybusiness/">
            <span class="tab-icon icon-our"></span>
            <span class="mui-tab-label">我的</span>
        </a>
    </div>
</template>

<script>
import qp from '../quickpublish/QuickPublish.vue'

export default {
    name: 'foot-nav',
    data: function () {
        return {}
    },
    methods: {

    },
    components: {
        qp
    }
}
</script>

<style>
#ft-foot-nav {
  background: #fff;
  padding-bottom: 0.1rem;
  box-sizing: border-box;
}

#ft-foot-nav > a {
  display: table-cell;
  width: 1%;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #444;
}

#ft-foot-nav a.mui-active {
  color: #0e5bb5 !important;
}

#ft-foot-nav .tab-icon {
  margin-bottom: 0.15rem;
  width: 0.46rem;
  height: 0.46rem;
  position: relative;
  z-index: 20;
  top: 3px;
  padding-top: 0;
  padding-bottom: 0;
  font-family: Muiicons;
  font-size: 0.24px;
  font-weight: 400;
  font-style: normal;
  display: inline-block;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
}

#ft-foot-nav .mui-tab-label {
  display: block;
  font-size: 0.24rem;
}

#ft-foot-nav .mui-active {
  color: #0e5bb5 !important;
}

#ft-foot-nav .icon-home {
  background: url(./images/home.png) no-repeat;
  width: 0.48rem;
  height: 0.47rem;
  background-size: 100%;
}

#ft-foot-nav .mui-active .icon-home {
  background: url(./images/home-cur.png) no-repeat;
  width: 0.52rem;
  height: 0.47rem;
  background-size: 100%;
}

#ft-foot-nav .icon-need {
  background: url(./images/needic.png) no-repeat;
  width: 0.38rem;
  height: 0.46rem;
  background-size: 100%;
}

#ft-foot-nav .mui-active .icon-need {
  background: url(./images/needs-cur.png) no-repeat;
  width: 0.38rem;
  height: 0.46rem;
  background-size: 0.38rem 0.46rem;
}

#ft-foot-nav .icon-resouce {
  background: url(./images/recou.png) no-repeat;
  width: 0.46rem;
  height: 0.47rem;
  background-size: 100%;
}

#ft-foot-nav .mui-active .icon-resouce {
  background: url(./images/recou-cur.png) no-repeat;
  width: 0.48rem;
  height: 0.47rem;
  background-size: 0.48rem 0.47rem;
}

#ft-foot-nav .icon-our {
  background: url(./images/user.png) no-repeat;
  width: 0.45rem;
  height: 0.47rem;
  background-size: 100%;
}

#ft-foot-nav .mui-active .icon-our {
  background: url(./images/user-cur.png) no-repeat;
  width: 0.48rem;
  height: 0.47rem;
  background-size: 100%;
}
</style>
