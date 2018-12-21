<template>
    <div id="bottom-nav" v-cloak>
        <nav class="mui-bar mui-bar-tab ft-tab" v-cloak>
            <a class="nav-tab-item" id="categoriesPicker">
                <span class="tab-icon  icon-resouce"></span>
                <span class="mui-tab-label">行业</span>
            </a>
            <qp ref="quickpublish"></qp>
            <a class="nav-tab-item" href="/">
                <span class="tab-icon icon-home"></span>
                <span class="mui-tab-label">首页</span>
            </a>
        </nav>
        <catePickerItem ref="categoryPicker"></catePickerItem>
    </div>
</template>

<style>

</style>

<script>
import qp from '../quickpublish/QuickPublish.vue'
import catePickerItem from '../../components/category-picker-temp/category-picker-temp.vue'

export default {
    name: 'foot-nav-sm-item',
        data: function () {
            return {}
        },
    methods: {
            Init: function (func,cateData) {
                var self = this
                if(cateData&&cateData.length>0){
                    self.$refs.categoryPicker.$data.ItemBusCates=[];
                    for (var i = 0; i < cateData.length; i++) {
                        var newCate=new Object();
                        newCate.name=cateData[i].Name;
                        newCate.value=cateData[i].Id;
                        self.$refs.categoryPicker.$data.ItemBusCates.push(newCate);
                    }
                }
                self.$refs.categoryPicker.Init({
                    CallBack: func,
                    Selector: '#categoriesPicker'
                })
            }
    },
    components: {
        qp,
        catePickerItem
    }
    }
</script>
