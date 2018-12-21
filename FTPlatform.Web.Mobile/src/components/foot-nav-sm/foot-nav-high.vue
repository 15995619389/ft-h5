<template>
    <div id="bottom-nav" v-cloak>
        <nav class="mui-bar mui-bar-tab ft-tab"  v-cloak>
          <a class="nav-tab-item" href="/">
            <span class="tab-icon icon-home"></span>
            <span class="mui-tab-label">首页</span>
          </a>
            <qp ref="quickpublish"></qp>
          <a class="nav-tab-item" href="/mybusiness/">
            <span class="tab-icon icon-our"></span>
            <span class="mui-tab-label">我的</span>
          </a>
        </nav>
        <category-picker ref="categoryPicker"></category-picker>
    </div>
</template>

<style>

</style>

<script>
import qp from '../quickpublish/QuickPublish.vue'
import categoryPicker from '../category-picker/category-picker.vue'

export default {
    name: 'foot-nav-sm',
    data: function () {
        return {}
    },
    methods: {
        Init: function (func) {
            var self = this
            self.$refs.categoryPicker.Init({
                CallBack: function (arr) {
                    func(arr)
                },
                Selector: '#categoriesPicker',
                Category: '0-0-0',
                All: true
            })
        }
    },
    components: {
        qp,
        categoryPicker
    }
}
</script>
