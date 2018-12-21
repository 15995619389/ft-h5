<script>
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('categoryPicker', ['../../modules/ApiClient'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../../modules/ApiClient'))
    } else {
        root.categoryPicker = factory(root.ApiClient)
    }
}(this, function (ApiClient) {
    var client = ApiClient
    return {
        name: 'category-picker',
        data: function () {
            return {
                defaultOptions: {
                    Category: '0-0-0',
                    Default: [0, 0, 0],
                    CallBack: function (arr) {
                    },
                    Selector: '#category-picker',
                    Auto: false,
                    HasBottom: true,
                    TagType:0
                },
                ShowPanel: false,
                ShowLevel2: false,
                HasBottom: true,
                Inited: false,
                Async: true,
                Auto: false,
                lv1: {},
                lv2: {},
                lv3: {},
                lv1Categories: [],
                lv2Categories: [],
                lv3Categories: [],
                ScrollY: 0
            }
        },
        methods: {
            Init: function (options) {
                var self = this
                $.extend(self.$data.defaultOptions, options)
                self.$data.defaultOptions.Default = self.$data.defaultOptions.Category.split('-')
                self.$data.Auto = self.$data.defaultOptions.Auto
                $(self.$data.defaultOptions.Selector).off().on('click', function () {
                    self.Show()
                })
                if (self.$data.defaultOptions.Default[0] > 0) {
                    self.$data.Async = false
                    self.$data.Auto = false
                    self.GetLv1()
                    for (let i = 0; i < self.$data.lv1Categories.length; i++) {
                        if (self.$data.defaultOptions.Default[0] == self.$data.lv1Categories[i].Id) {
                            self.$data.lv1 = self.$data.lv1Categories[i]
                        }
                    }
                    if (self.$data.defaultOptions.Default[1] > 0) {
                        self.GetLv2()
                        for (let i = 0; i < self.$data.lv2Categories.length; i++) {
                            if (self.$data.defaultOptions.Default[1] == self.$data.lv2Categories[i].Id) {
                                self.$data.lv2 = self.$data.lv2Categories[i]
                            }
                        }
                        if (self.$data.defaultOptions.Default[2] > 0) {
                            self.GetLv3()
                            for (let i = 0; i < self.$data.lv3Categories.length; i++) {
                                if (self.$data.defaultOptions.Default[2] == self.$data.lv3Categories[i].Id) {
                                    self.$data.lv3 = self.$data.lv3Categories[i]
                                }
                            }
                        }
                    }
                    self.$data.Async = true
                    self.$data.Auto = self.$data.defaultOptions.Auto
                } else {
                    self.GetLv1()
                }
            },
            Show: function (options) {
                var self = this
                self.$data.ShowPanel = !self.$data.ShowPanel
                this.$data.scrollY = window.scrollY
                $('body').addClass('fixed-height')
                $('html').addClass('fixed-height')
                if (self.$data.ShowPanel == true && !self.lv1Categories.length) {
                    self.GetLv1()
                }
            },
            Hide: function () {
                this.$data.ShowPanel = false
                $('body').removeClass('fixed-height')
                $('html').removeClass('fixed-height')
                // 发布需求时面板隐藏后跳转到按钮位置
                $(document).scrollTop(this.$data.scrollY)
            },
            Confirm: function () {
                this.$data.defaultOptions.Category = this.$data.lv1 && this.$data.Id ? this.$data.lv1.Id : 0 +
                '-' + this.$data.lv2 && this.$data.lv2.Id ? this.$data.lv2.Id : 0 + '-' + this.$data.lv3 && this.$data.lv3.Id ? this.$data.lv3.Id : 0
                var arr = [this.$data.lv1, this.$data.lv2, this.$data.lv3]
                this.Hide()
                this.$data.defaultOptions.CallBack(arr)
            },
            All: function () {
                var self = this
                self.Clear(1)
                self.Confirm()
            },
            GetChosen: function () {
                return [this.$data.lv1, this.$data.lv2, this.$data.lv3]
            },
            Choose: function (level, item) {
                if (level == 1) {
                    this.$data.lv1 = item
                    this.$data.ShowLevel2 = false
                    this.GetLv2()
                }
                if (level == 2) {
                    this.$data.lv2 = item
                    this.GetLv3()
                }
                if (level == 3) {
                    this.$data.lv3 = item
                }
            },
            Clear: function (level) {
                if (level == 1) {
                    this.$data.lv1 = {}
                    this.$data.lv1Categories = []
                }
                if (level == 1 || level == 2) {
                    this.$data.lv2 = {}
                    this.$data.lv2Categories = []
                }
                if (level == 1 || level == 2 || level == 3) {
                    this.$data.lv3 = {}
                    this.$data.lv3Categories = {}
                }
            },
            Get: function (parent, callback) {
                client.Request({
                    type: 'get',
                    async: this.$data.Async,
                    url: '/categories/v2/' + parent,
                    success: function (res) {
                        callback(res)
                    }
                })
            },
            GetLv1: function () {
                var self = this
                self.Clear(1)
                //this.Get(1, function (res) {
                //    self.$data.lv1Categories = res
                //    self.$data.lv1 = self.$data.lv1Categories[0]
                //    self.GetLv2()
                //});
                client.Request({
                    type: 'get',
                    async: this.$data.Async,
                    url: '/categories/v2/' + 1 + '?type=' + self.$data.defaultOptions.TagType,
                    success: function (res) {
                        self.$data.lv1Categories = res
                        self.$data.lv1 = self.$data.lv1Categories[0]
                        self.GetLv2()
                    }
                })
            },
            GetLv2: function () {
                var self = this
                self.Clear(2)
                self.Get(self.$data.lv1.Id, function (res) {
                    self.$data.lv2Categories = res
                    self.$data.ShowLevel2 = true
                    if (self.$data.Auto) {
                        self.$data.lv2 = self.$data.lv2Categories[0]
                        self.GetLv3()
                    }
                })
            },
            GetLv3: function () {
                var self = this
                self.Clear(3)
                self.Get(self.$data.lv2.Id, function (res) {
                    self.$data.lv3Categories = res
                    if (self.$data.Auto) {
                        self.$data.lv3 = self.$data.lv3Categories[0]
                    }
                })
            },
            GetDefault: function (level) {
                return this.$data.defaultOptions.Category.split('-')[level - 1]
            }
        }
    }
}))
</script>
<template>
    <div id='component-catepicker' v-if='ShowPanel'>
        <ul class='lv1 l-scrollable'>
            <li v-bind:cateId='item.Id' v-bind:key="item.Id" v-bind:class='{chosen:(item.Id == lv1.Id)}' v-for='item in lv1Categories' v-on:click='Choose(1,item)'>
                {{item.Name}}
            </li>
            <li cateId='0' v-show='!defaultOptions.Auto' v-on:click='All'>全部</li>
        </ul>
        <div class='content' v-show='ShowLevel2'>
            <div class='l-scrollable'>
                <h4 class='lv1-title'>{{lv1.Name}}</h4>
                <ul class='lv2'>
                    <li v-bind:cateId='item.Id' v-bind:key="item.Id" v-bind:class='{chosen:(item.Id == lv2.Id)}' v-for='item in lv2Categories' v-on:click='Choose(2,item)'>
                        {{item.Name}}
                    </li>
                </ul>
                <h5 class='lv2-title'>
                    {{lv2.Name}}
                </h5>
                <ul class='lv3'>
                    <li v-bind:cateId='item.Id' v-bind:key="item.Id" v-bind:class='{chosen:(item.Id == lv3.Id)}' v-for='item in lv3Categories' v-on:click='Choose(3,item)'>
                        {{item.Name}}
                    </li>
                </ul>
            </div>
            <p class='label-btn'>
                <button type='button' class='confirm mui-btn mui-btn-blue mui-btn-block' v-on:click='Confirm'>确定</button>
                <button type='button' class='cancel mui-btn mui-btn-blue mui-btn-block' v-on:click='Hide'>取消</button>
            </p>
        </div>
    </div>
</template>

<style>
#component-catepicker {
  position: fixed;
  left: 0px;
  top: 44px;
  bottom: 0;
  width: 100%;
  background: #f5f5f5;
  display: block;
  z-index: 10000;
  border-top: 1px solid #ddd;
}

.fixed-height {
  overflow-y: hidden;
  height: 100%;
  position: fixed;
  width: 100%;
}

#component-catepicker ul {
  list-style: none;
}

/*#component-catepicker .confirm {
    margin-top: 0.30rem;
}*/

#component-catepicker .lv1-title {
  font-size: 0.28rem;
  margin: 10px 0px;
  color: #666;
}

#component-catepicker .lv2-title {
  font-size: 0.24rem;
  color: #666;
  margin: 10px 0px;
}

#component-catepicker .lv1 {
  width: 27%;
  height: 100%;
  float: left;
  background: #fff;
  overflow: auto;
}

#component-catepicker .lv1 li {
  width: 100%;
  text-align: center;
  border-top: 1px solid #dddddd;
  height: 12.5%;
  line-height: 1.5rem;
  font-size: 0.28rem;
}

#component-catepicker .lv1 li:nth-child(1) {
  border-top: 0px;
}

#component-catepicker .lv1 li.chosen {
  background: #f5f5f5;
  color: #0e5bb5;
}

#component-catepicker .content {
  display: block;
  width: 73%;
  float: right;
  height: 100%;
  padding: 0px 2%;
}

#component-catepicker .lv2 {
  width: 100%;
  height: auto;
  overflow: hidden;
}

#component-catepicker .lv2 li {
  width: 33.33%;
  text-align: center;
  font-size: 0.26rem;
  float: left;
  background: #fff;
  height: 0.8rem;
  line-height: 0.8rem;
  border: 1px solid #f5f5f5;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#component-catepicker .lv2 li.chosen {
  color: #0e5bb5;
}

#component-catepicker .lv3 {
  width: 100%;
  height: auto;
  overflow: hidden;
}

#component-catepicker .lv3 li {
  width: 33.33%;
  text-align: center;
  font-size: 0.28rem;
  float: left;
  background: #fff;
  height: 0.8rem;
  line-height: 0.8rem;
  border: 1px solid #f5f5f5;
  color: #666;
  font-size: 0.24rem;
  height: 0.6rem;
  line-height: 0.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#component-catepicker .lv3 li.chosen {
  color: #0e5bb5;
  background: #ddd;
}

#component-catepicker .content > div {
  height: 84%;
  overflow: auto;
}

#component-catepicker .content .mui-btn-block {
  padding: 5px 0px;
}

#component-catepicker .label-btn {
  width: 100%;
  margin-bottom: 0px;
  overflow: hidden;
}

#component-catepicker .label-btn .mui-btn {
  width: 48%;
  float: left;
}

#component-catepicker .label-btn .mui-btn:nth-child(2) {
  float: right;
}

#component-catepicker .mui-btn-blue {
  background: #0e5bb5;
  border-color: #0e5bb5;
}

.body-overflow {
  overflow: hidden;
}
</style>

