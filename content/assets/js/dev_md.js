$(document).ready(function(){
    let upload = function(blob, callback){
            let req = new XMLHttpRequest(),
                formData = new FormData();
            formData.append("file", blob);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    let data = JSON.parse(req.response);
                    if(data.message){
                        bootbox.alert(data.message);
                    }else{
                        callback(data.data);
                    }
                }
            };
            req.open("POST", HitabUtil.domain + '/app/upload');
            req.setRequestHeader('Authorization', HitabUtil.user.id + ':' + HitabUtil.user.secret);
            req.send(formData);

        },
        prependName = function(){
            let switchSection = $('.te-mode-switch-section'),
                p = switchSection.find('span'),
                text = '' + HitabUtil.dev.id+'. '+HitabUtil.dev.name;
            if(p.length > 0){
                p.text(text)
            }else{
                switchSection.prepend('<span>'+text+'</span>');
            }
        };
    HitabUtil.init(function(){
        let editor = new tui.Editor({
            el: document.querySelector('#content'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            initialValue: HitabUtil.dev.content !== '{}' ? HitabUtil.dev.content : '',
            events: {
                load: function(){
                    prependName();
                },
                change: function(){
                    let content = editor.getMarkdown();
                    if(HitabUtil.dev.content !== content){
                        HitabUtil.setDev({content: content});
                        $('.cloud-icon').show();
                        $('#dev-md-cloud').css('color', 'red');
                    }
                }
            },
            exts: [
                {
                    name: 'chart',
                    minWidth: 100,
                    maxWidth: 600,
                    minHeight: 100,
                    maxHeight: 300
                },
                'scrollSync',
                'colorSyntax',
                'uml',
                'mark',
                'table'
            ]
        });
        HitabUtil.sidebar(function(data){
            editor.setValue(data.content !== '{}' ? data.content : '');
            $('.cloud-icon').hide();
            prependName();
        });
        $('.upload-icon').click(function(){
            let isImage = false;
            bootbox.dialog({
                title: 'Upload a file',
                message: '<div class="custom-file">' +
                    '    <input type="file" class="custom-file-input" id="dev-upload-file" required>' +
                    '    <label class="custom-file-label" for="dev-upload-file" id="dev-upload-file-label">Choose file...</label>' +
                    '</div>' +
                    "<div class='form-group'>" +
                    "    <label>Uploaded</label>" +
                    "    <input type='text' class='form-control' id='dev-upload-path' readonly placeholder=''>" +
                    "</div>"+
                    "<div class='form-group'>" +
                    "    <label>Description</label>" +
                    "    <input type='text' class='form-control' id='dev-upload-desc' placeholder=''>" +
                    "</div>",
                onShow: function(e){
                    $('#dev-upload-file').change(function(){
                        $('#dev-upload-file-label').text($(this)[0].files[0].name);
                        if($(this)[0].files[0].type.indexOf('image/') === 0){
                            isImage = true;
                        }
                        upload($(this)[0].files[0], function(data){
                            $('#dev-upload-path').val(data.file);
                        });
                    });
                },
                size: 'middle',
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: 'btn-default'
                    },
                    ok: {
                        label: "Insert",
                        className: 'btn-primary',
                        callback: function(){
                            let path = $('#dev-upload-path').val();
                            if(!path){
                                bootbox.alert('No file to insert');
                                return false;
                            }
                            if(isImage){
                                editor.exec('AddImage', {
                                    altText: $('#dev-upload-desc').val() || path,
                                    imageUrl: HitabUtil.domain + '/view/file?path=' + path
                                });
                            }else{
                                editor.exec('AddLink', {
                                    linkText: $('#dev-upload-desc').val() || path,
                                    url: HitabUtil.domain + '/view/file?path=' + path
                                });
                            }
                        }
                    }
                }
            });
        });
        $('.cloud-icon').click(function(){
            if(HitabUtil.dev.id){
                HitabUtil.setRemoteOrLocal('/content/upsert', {
                    'id': HitabUtil.dev.id,
                    'type': HitabUtil.dev.type,
                    'name': HitabUtil.dev.name,
                    'tags': HitabUtil.dev.tags,
                    'status': 0,
                    'content': HitabUtil.dev.content
                }, function(result){
                    if(result && typeof result == 'object' && !result.hasOwnProperty('message')){
                        $('.cloud-icon').hide();
                    }
                });
            }
        });
    },4);
});