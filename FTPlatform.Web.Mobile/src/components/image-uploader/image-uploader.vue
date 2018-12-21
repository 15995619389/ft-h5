<script>
import Cropper from 'cropperjs'
import * as client from '../../modules/ApiClient'
import 'cropperjs/dist/cropper.css'

var cropper = null
export default {
    name: 'image-uploader',
    data: function () {
        return {
            options: {
                CallBack: function (url) {
                },
                Action: null,
                ModuleName: 'File',
                UploadFailCallBack: function (req) {
                }
            },
            show: false,
            message: '',
            messageShow: false,
            picSrc: null,
            picInput: null,
            active: false
        }
    },
    methods: {
        Init: function (opts) {
            $.extend(this.$data.options, opts)
            var self = this
            $('.avatar-input').off().on('change', function () {
                self.Select()
            })
        },
        Show: function () {
            this.$data.show = true
        },
        Cancel: function () {
            this.Hide()
            this.Clear()
        },
        GoBack: function () {
            this.Hide()
        },
        Submit: function () {
            if (!$(' .avatar-src').val() && !$(' .avatar-input').val()) {
                this.$data.message = '请选择图片'
                this.$data.messageShow = true
                return false
            }
            this.$data.message = '' // 开始上传...
            this.$data.messageShow = true

            var boxData = cropper.getCropBoxData()
            var canvas = cropper.getCroppedCanvas({
                width: boxData.width,
                height: boxData.height
            })

            var imageData = canvas.toDataURL('image/png', 0.8)
            var self = this
            client.Request({
                url: this.$data.options.Action,
                type: 'post',
                data: { image: imageData,moduleName:self.options.ModuleName },
                success: function (data) {
                    if (self.$data.options.CallBack && typeof self.$data.options.CallBack == 'function') {
                        self.$data.options.CallBack(data)
                        self.Clear()
                    }
                    self.$data.messageShow = false
                    self.Hide()
                },
                error: function (req, textStatus, errorThrown) {
                    self.$data.message = '上传失败！'
                    self.$data.options.UploadFailCallBack(req)
                }
            })

            return false
        },
        Select: function () {
            var files = $(' .avatar-input').prop('files')
            var file = files[0]
            if (this.IsImage(file)) {
                var url = window.URL.createObjectURL(file)

                if (this.$data.active) {
                    $('.avatar-warpper img').cropper('replace', url)
                } else {
                    var img = $('<img src="' + url + '">')
                    $('.avatar-wrapper').empty().html(img)
                    cropper = new Cropper(img[0], {
                        aspectRatio: 1 / 1,
                        preview: '.avatar-preview',
                        strict: false,
                        crop: function (data) {
                            var json = [
                                '{"x":' + data.x,
                                '"y":' + data.y,
                                '"height":' + data.height,
                                '"width":' + data.width,
                                '"rotate":' + data.rotate + '}'
                            ].join()
                            $('.avatar-data').val(json)
                        }
                    })
                    this.$data.active = true
                }
            } else {
                this.$data.message = '请选择图片文件'
                this.$data.messageShow = true
            }
        },
        IsImage: function (file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type)
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file)
            }
        },
        Hide: function () {
            this.$data.show = false
        },
        Clear: function () {
            this.$data.messageShow = false
            $('.avatar-input').val('')
            if (this.$data.active) {
                cropper.destroy()
                $('.avatar-wrapper img').remove()
                this.$data.active = false
            }
        }
    }
}
</script>

<template>
    <div id="component-imguploader" v-bind:class="{show:show}">
        <div class="mui-bar mui-bar-nav">
            <h1 class="mui-title">上传图片</h1>
        </div>
        <div class="mui-content">
            <div class="uploading_message" v-bind:class="{show:messageShow}" v-html="message"></div>
            <div class="file-info">
                <input type="file" class="avatar-input">
                <input class="avatar-data" type="hidden">
                <input class="avatar-src" type="hidden">
            </div>
            <div class="avatar-wrapper"></div>
            <div class="op-btns">
                <button type="button" v-on:click="Cancel" class="cancel mui-btn mui-btn-primary">取消</button>
                <button type="button" v-on:click="Submit" class="conmit mui-btn mui-btn-primary">确定</button>
            </div>
        </div>
    </div>
</template>

<style>
#component-imguploader {
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

#component-imguploader.show {
  display: block;
}

#component-imguploader .uploading_message {
  display: none;
}

#component-imguploader .uploading_message.show {
  display: block;
}

#component-imguploader .mui-content {
  background-color: #fff;
}

#component-imguploader .file-info {
  border-top: 1px solid #ddd;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
}

#component-imguploader .op-btns {
  border-top: 1px solid #ddd;
  padding: 10px 20%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

#component-imguploader .avatar-wrapper {
  border-top: 1px solid #ddd;
  height: 300px;
  width: 100%;

}

#component-imguploader .avatar-input {
  font-size: 12px;
}
</style>
