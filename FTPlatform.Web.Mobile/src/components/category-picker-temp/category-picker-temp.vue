<script>
(function(roo, factory) {
    if (typeof define === "function" && define.amd) {
        define("categoryPicker", factory);
    }
    else if (typeof exports === "object") {
        module.exports = facotry();
    }
    else {
        root.categoryPicker = facotry();
    }
}(this, function() {
    return {
        name: "category-picker-temp",
        data: function() {
            return {
                defaultOptions: {
                    CallBack: function(arr) {
                    },
                    Selector: "#category-picker-temp",
                    Auto: false,
                    HasBottom: true
                },
                ShowPanel: false,
				ChooseData:{ name : "智能制造", value : "1" },
				ItemBusCates:[
					{ name : "智能制造", value : "1" },
					{ name : "新材料", value : "2" },
					{ name : "节能环保", value : "3" },
					{ name : "新能源", value : "4" },
					{ name : "生物医药", value : "5" },
					{ name : "化工工程", value : "6" },
					{ name : "检测", value : "7" },
				]
            }
        },
        methods: {
            Init: function(options) {
                var self = this;
                $.extend(self.$data.defaultOptions, options);
                $(self.$data.defaultOptions.Selector).off().on("click", function() {
                    self.Show();
                });
            },
            Show: function(options) {
                var self = this;
                self.$data.ShowPanel = true;
            },
            Hide: function() {
                this.$data.ShowPanel = false;
            },
            Confirm: function() {
                this.Hide();
                this.$data.defaultOptions.CallBack(this.$data.ChooseData);
            },
            GetChosen: function() {
                return this.$data.ChooseData;
            },
            Choose: function(item) {
                this.$data.ChooseData = item;
            },
            Clear: function(level) {
                this.$data.ChooseData = {};
            },
            GetDefault: function(level) {
                return this.$data.ChooseData;
            }
        }
    }
}));
</script>
<template>
	<div class="patentPickerItem"  v-if="ShowPanel" >
			<ul>
				<li v-for="bus in ItemBusCates" v-bind:class="{active:(bus.value == ChooseData.value)}" v-on:click="Choose(bus)" >{{bus.name}}</li>
			</ul>
			<footer>
				<button v-on:click="Clear">重置</button>
				<button v-on:click="Confirm">确定</button>
			</footer>
		</div>
</template>

<style>
.patentPickerItem{
        position: fixed;
        left: 0px;
        top: 44px;
        bottom: 0;
        width: 100%;
        background: #fff;
        z-index: 100;
        border-top: 1px solid #ddd;
    }
    .patentPickerItem ul{
        overflow:hidden
    }
    .patentPickerItem ul li{
        width:1.78rem;
        height:0.55rem;
        text-align:center;
        line-height:0.55rem;
        float:left;
        margin-left:0.5rem;
        margin-top:0.60rem;
        font-size:0.28rem;
        color:#444;
        border:1px solid #ddd;
        border-radius:15px
    }
    .patentPickerItem ul .active{
        border:1px solid #0e5bb5;
        color:#0e5bb5
    }
    .patentPickerItem footer{
        padding:0 2%;
        overflow:hidden;
        position:absolute;
        bottom:1.00rem;
        width:96%;
        left:2%
    }
    .patentPickerItem footer button{
        border:none;
        width:48%;
        height:0.85rem;
        line-height:0.85rem;
        padding:0
    }
     .patentPickerItem footer button:first-child{
         background:#ddd
     }
     .patentPickerItem footer button:last-child{
         background:#0e5bb5;
         float:right;
         color:#fff
     }
</style>

