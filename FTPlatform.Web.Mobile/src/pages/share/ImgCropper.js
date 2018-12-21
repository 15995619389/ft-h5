import * as client from "../../modules/ApiClient";
import Cropper from "cropperjs";
import {Toast} from "mint-ui";

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {

    'use strict';

    var console = window.console || { log: function () { } };

    function CropAvatar($element) {       
        this.init();
        console.log(this);
    }
    var cropper=null;
    
    CropAvatar.prototype = {
        constructor: CropAvatar,

        support: {
            fileList: !!$('<input type="file">').prop('files'),
            blobURLs: !!window.URL && URL.createObjectURL,
            formData: !!window.FormData
        },

        init: function () {
            this.support.datauri = this.support.fileList && this.support.blobURLs;

            //if (!this.support.formData) {
            //  this.initIframe();
            //}

            //this.initTooltip();
            //this.initModal();
            this.addListener();
        },

        addListener: function () {
            //this.$avatarView.on('click', $.proxy(this.click, this));

            $(document).on("change", '#fileField', $.proxy(this.change, this));
            //this.$avatarForm.on('submit', $.proxy(this.submit, this));
            //this.$avatarBtns.on('click', $.proxy(this.rotate, this));

            //��������
            $(".cancel").on('click', $.proxy(this.cropDone, this));
            $(".conmit").on('click',$.proxy(this.submit, this));
        }, 

        change: function () {
            var files,
                file;
            if (this.support.datauri) {
                $("div.avatar-body div.alert").remove();
                files = $('#fileField').prop('files');
                if (files.length > 0) {
                    file = files[0];

                    if (this.isImageFile(file)) {
                        if (this.url) {
                            URL.revokeObjectURL(this.url); // Revoke the old one
                        }

                        this.url = URL.createObjectURL(file);
                        this.startCropper();
                    } else {
                        Toast({message:'Please choose an image file.',duration:1000});
                    }
                }
            } else {
                file = $('#fileField').val();

                if (this.isImageFile(file)) {
                    //this.syncUpload();
                }
            }
        },

        submit: function () {
            $("div.avatar-body div.alert").remove();
            if (!$('.avatar-src').val() && !$('#fileField').val()) {
                Toast({message:'Please choose an image file.',duration:1000});
                return false;
            }

            if (this.support.formData) {
                this.ajaxUpload();
                return true;
            }
        },

        //rotate: function (e) {
        //  var data;

        //  if (this.active) {
        //    data = $(e.target).data();

        //    if (data.method) {
        //      this.$img.cropper(data.method, data.option);
        //    }
        //  }
        //},

        isImageFile: function (file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type);
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file);
            }
        },

        startCropper: function () {
            var _this = this;
            if (this.active) {
                this.$img.cropper('replace', this.url);
            } else {
               var img = $('<img src="' + this.url + '">');
                this.$img=img[0];
                $('.avatar-wrapper').empty().html(this.$img);
                cropper = new Cropper(this.$img,{
                    aspectRatio: 1 / 1,
                    preview: $('.avatar-preview').selector,
                    strict: false,
                    crop: function (data) {
                        var json = [
                              '{"x":' + data.x,
                              '"y":' + data.y,
                              '"height":' + data.height,
                              '"width":' + data.width,
                              '"rotate":' + data.rotate + '}'
                        ].join();

                        $('.avatar-data').val(json);
                    }
                });

                this.active = true;
            }
        },

        stopCropper: function () {
            if (this.active) {
                this.$img.cropper.destroy();
                this.$img.remove();
                this.active = false;
            }
        },

        ajaxUpload: function () {
            //var $imgData = this.$img.cropper('getCroppedCanvas')
            //var dataurl = $imgData.toDataURL('image/png');

            var cropBoxData = cropper.getCropBoxData();//��ȡ����ļ�
            var imageRate = 1;//ͼƬ��������ű���
            var width = cropBoxData.width * imageRate;
            var height = cropBoxData.height * imageRate;
            //���ɽ��canvas,�������ͼƬ����ĸ߿�
            var croppedCanvas = cropper.getCroppedCanvas({
                width: width,
                height: height
            });

           
            var encoderOptions = 0.8;//ͼƬ��������
            //�����base64��ʽ����ô��ȡԴ�ļ����ͽ��б���,����ͼƬĬ�ϱ���Ϊjpeg
            //if (typeof file === 'string' && /^data:image/.test(file)) {
            //    var fileType = file.substring('data:image/'.length, file.indexOf(';base64,'));
            //    result = croppedCanvas.toDataURL(fileType, encoderOptions);
            //}
           var result = croppedCanvas.toDataURL('image/png', encoderOptions);


            var url =$('.avatar-form').attr('action'),
                //data = "imgBase64"+result,
                _this = this;
           
           
           //  
            //data.append("fileFileName", "photo.jpg");
            //alert(JSON.stringify( data));
            //alert(JSON.stringify( data));
         client.Request({
                type: 'post',
                data: { imgbase: result },
                //dataType: 'json',
                url:url,
                beforeSend: function () {
                    _this.submitStart();
                },
                success: function (data) {
                    Toast({message:data.Message,duration:1000});
                    _this.submitDone(data);
                },

                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _this.submitFail(textStatus || errorThrown);
                },

                complete: function () {
                    _this.submitEnd();
                }
            });
        },

        //syncUpload: function () {
        //  this.$avatarSave.click();
        //},

        submitStart: function () {
            $('.loading').fadeIn();
        },

        submitDone: function (data) {
            console.log(data);
            //if ($.isPlainObject(data) && data.state === 200) {
            if (data.RedirectUrl) {
                this.url = data.RedirectUrl;
                var s = document.getElementById("AgentCertificate");
                var t = document.getElementById("touxiang");
                if (t != null)
                {
                    $('#touxiang').attr("src",this.url);
                }
                if (s != null) {
                    $('#AgentCertificate').attr("src",this.url);
                }
                if (this.support.datauri || this.uploaded) {
                    this.uploaded = false;
                    this.cropDone();
                } else {
                    this.uploaded = true;
                    $('.avatar-src').val(this.url);
                    this.startCropper();
                }

                $('#fileField').val('');
            }
                //} else if (data.message) {
                //  this.alert(data.message);
                //}
                //} 
            else {
                Toast({message:data.Message,duration:1000});
            }
        },

        submitFail: function (msg) {
            Toast({message:msg,duration:1000});
        },

        submitEnd: function () {
            $('.loading').fadeOut();
        },

        cropDone: function () {
            $('.avatar-form').get(0).reset();
            $('#fileField').val('');
            this.stopCropper();
        },

    };

    $(function () {
        return new CropAvatar($('#crop-avatar'));
    });

});
