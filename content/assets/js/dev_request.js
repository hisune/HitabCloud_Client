$(document).ready(function(){
    HitabUtil.init(function(){
        HitabUtil.autoSave(function(){
            HitabUtil.setDev({content: JSON.stringify(HitabUtil.serializeObject($('#submit-request')))});
        });
        let jsonOrText = function(input) {
            var string = input.trim(), json = {};
            try{
                json = JSON.parse(string);
            }catch(e){
                if(string.indexOf(':')>0){
                    var array = string.split('\n');
                    for(var i in array){
                        var line = array[i].split(':');
                        if(line.length == 2)
                            json[line[0].trim()] = line[1].trim();
                        else if(line.length > 2){
                            var shift = line.shift();
                            json[shift.trim()] = line.join(':');
                        }
                    }
                }else{
                    return string;
                }
            }
            return json;
        }, makeRequest = function(json){
            let formData = HitabUtil.serializeObject($('#submit-request')),
                headerVal = jsonOrText(formData.request_headers),
                cookieVal = jsonOrText(formData.request_cookies),
                bodyVal = jsonOrText(formData.request_body),
                contentType = 'application/x-www-form-urlencoded; charset=utf-8';
            HitabUtil.dev.content = JSON.stringify(formData);
            localStorage.setItem('dev-request', JSON.stringify(HitabUtil.dev));
            if(formData.request_type == 'raw'){
                if(typeof bodyVal == 'object'){
                    contentType = 'application/json; charset=utf-8';
                    bodyVal = JSON.stringify(bodyVal);
                }else{
                    contentType = 'text/plain';
                }
            }else if(typeof bodyVal == 'object'){
                bodyVal = $.param(bodyVal);
            }
            let cookieGlobal = null;
            if(typeof cookieVal == 'object'){
                cookieGlobal = $.param(cookieVal).replace(/&/g, '; ');
            }
            var start;
            chrome.runtime.sendMessage({call: 'setCookie', value: cookieGlobal}, function(response) {
                console.log(response);
                $.ajax({
                    type: formData.request_method,
                    url: formData.request_url,
                    data: bodyVal,
                    beforeSend: function(request) {
                        for(var i in headerVal){
                            request.setRequestHeader(i, headerVal[i]);
                        }
                        $('#request-result').show().html('<div class="alert alert-info" role="alert">processing...</div>');
                        start = new Date().getTime();
                    },
                    contentType: contentType,
                    error: function(xhr, status, error){
                        let data = $('<div/>').text(xhr.responseText).html();
                        $('#request-result').show().html('<font color="#8b0000">Response <b>'
                            +xhr.statusText
                            +'</b> with code <b>'+xhr.status+'</b> in <b>'
                            +((new Date().getTime())-start)+'ms</b></font>' +
                            '<pre>'
                            +xhr.getAllResponseHeaders()
                            +'</pre>' +
                            '<code style="white-space: pre-wrap;">'+data+'</code>');
                        chrome.runtime.sendMessage({call: 'cleanCookie'});
                    },
                    success: function(data, status, xhr){
                        try{
                            if(typeof data == 'object'){
                                data = JSON.stringify(data,null,2);
                            }else{
                                data = JSON.stringify(JSON.parse(data),null,2);
                            }
                        }catch (e) {
                            data = $('<div/>').text(data).html();
                        }
                        $('#request-result').show().html('<font color="#006400">Response <b>'+xhr.statusText+'</b> with code <b>'+xhr.status+'</b> in <b>'+((new Date().getTime())-start)+'ms</b></font>' +
                            ' <button type="button" class="btn btn-link btn-sm btn-copy" data-clipboard-target="#response-headers">Copy Headers</button> ' +
                            ' <button type="button" class="btn btn-link btn-sm btn-copy" data-clipboard-target="#response-body">Copy Body</button> ' +
                            ' <button type="button" class="btn btn-link btn-sm" id="open-body-in-json">Open Body in JSON</button> ' +
                            '<pre id="response-headers">'+xhr.getAllResponseHeaders()+'</pre>' +
                            '<code id="response-body" style="white-space: pre-wrap;">'+data+'</code>');
                        new ClipboardJS('.btn-copy');
                        $('#open-body-in-json').click(function(){
                            try{
                                JSON.parse(data);
                                localStorage.setItem('dev-json', JSON.stringify({
                                    id: 0,
                                    type: 1,
                                    name: "",
                                    content: data,
                                }));
                                window.open('dev_json.html', '_blank');
                            }catch (e) {
                                HitabUtil.showError('Invalid JSON Format!');
                            }
                        });
                        chrome.runtime.sendMessage({call: 'cleanCookie'});
                    }
                });
            });
        };
        $('.btn-auto-submit').click(function(){
            makeRequest();
        });
        $('form').submit(function(){
            return false;
        });
        HitabUtil.sidebar(function(data){
            let content = JSON.parse(data.content), field = ['request_method', 'request_type', 'request_url', 'request_cookies', 'request_headers', 'request_body'];
            for(let i in field){
                $('[name='+field[i]+']').val(content[field[i]] || '').change();
            }
        });
        $('.response-icon').click(function(){
            bootbox.dialog({
                title: 'HTTP Response Code',
                message: $('#table-response').html(),
                size: 'extra-large'
            });
        });
    }, 2);
});