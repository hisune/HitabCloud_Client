(function(){
    HitabUtil.init(function(){
        HitabUtil.autoSave().enableCopy();
        $('form').submit(function(){
            $(this).find('.btn-auto-submit').click();
            return false;
        });
        let randomString = function(length, num, low, up, spec) {
                var text = '',
                    string='',
                    strNum = '01234567890123456789',
                    strLow = 'abcdefghijklmnopqrstuvwxyz',
                    strUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                    strSpec = '!@#$%^&*<>?()_+=-[],.~',
                    count = 0;
                if(num){
                    string += strNum;
                    count++;
                }
                if(low){
                    string += strLow;
                    count++;
                }
                if(up){
                    string += strUp;
                    count++;
                }
                if(spec){
                    string += strSpec;
                    count++;
                }
                length = length || 16;

                if(!count) throw '至少指定一个规则';
                if(length < count) throw '长度必需>=规则数';

                for( var i=0; i < length; i++ ) {
                    text += string.charAt(Math.floor(Math.random() * string.length));
                }
                var textSplit = text.split('');
                if(num && !strNum.split('').filter(function(v){ return textSplit.indexOf(v) > -1 }).length){
                    return randomString(length, num, low, up, spec);
                }else if(low && !strLow.split('').filter(function(v){ return textSplit.indexOf(v) > -1 }).length){
                    return randomString(length, num, low, up, spec);
                }else if(up && !strUp.split('').filter(function(v){ return textSplit.indexOf(v) > -1 }).length){
                    return randomString(length, num, low, up, spec);
                }else if(spec && !strSpec.split('').filter(function(v){ return textSplit.indexOf(v) > -1 }).length){
                    return randomString(length, num, low, up, spec);
                }else{
                    return text;
                }
            },
            uuidv4 = function() {
                return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            },
            query2json = function(queryString) {
                if(queryString.indexOf('?') > -1){
                    queryString = queryString.split('?')[1];
                }
                var pairs = queryString.split('&');
                var result = {};
                pairs.forEach(function(pair) {
                    pair = pair.split('=');
                    result[pair[0]] = decodeURIComponent(pair[1] || '');
                });
                return result;
            },
            hex = {
                encode: function(str){
                    let arr = [];
                    for (let i = 0, l = str.length; i < l; i ++) {
                        let hex = Number(str.charCodeAt(i)).toString(16);
                        arr.push(hex);
                    }
                    return arr.join('');
                },
                decode: function(hexx) {
                    let hex = hexx.toString(), str = '';
                    for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
                        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                    return str;
                }
            },
            dateFormat = function (fmt, d) {
                var date = d || new Date();
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            getBeianCode = function() {
                let rand = parseInt(Math.random()*90+10,10);
                $('#beian-code-refresh').html('<img class="form-control" src="http://beian.miit.gov.cn/getVerifyCode?'+rand+'">');
            },
            writeResult = function(type, output, append, escape, copy){
                if(typeof append === 'undefined') append = true;
                if(typeof escape === 'undefined') escape = true;
                if(typeof copy === 'undefined') copy = true;
                let form = $('#submit-' + type), next = form.next(), tpl = "<div id='result-"+type+"' class='alert primary alert-dismissible fade show' role='alert'>" +
                    "    <div class='alert-message'>{message}</div>" +
                    "    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
                    "        <span aria-hidden='true'>&times;</span>" +
                    "    </button>" +
                    "</div>";
                if(escape) output = $("<div/>").text(output).html();
                output = '<code '+(copy ? 'class="copy"' : '')+'>' + output + '</code>';
                if(next.is('form') || next.length === 0){
                    form.after(HitabUtil.format(tpl, {message: output}));
                }else{
                    if(append){
                        next.children('.alert-message').append(output);
                    }else{
                        next.children('.alert-message').html(output);
                    }
                }
            };
        $('.btn-auto-submit').click(function(){
            let type = $(this).data('type'), formData = HitabUtil.serializeObject($('#submit-' + type));
            try{
                switch (type) {
                    case 'random':
                        if(formData.random_type.indexOf('5')>-1){
                            writeResult(type, uuidv4());
                        }else{
                            writeResult(type, randomString(
                                formData.random_length,
                                formData.random_type.indexOf('1')>-1,
                                formData.random_type.indexOf('2')>-1,
                                formData.random_type.indexOf('3')>-1,
                                formData.random_type.indexOf('4')>-1
                            ));
                        }
                        break;
                    case 'hash':
                        switch (formData.hash_type) {
                            case '1':
                                writeResult(type, new Hashes.MD5().hex(formData.hash_string));
                                break;
                            case '2':
                                writeResult(type, new Hashes.SHA1().hex(formData.hash_string));
                                break;
                            case '3':
                                writeResult(type, new Hashes.SHA256().hex(formData.hash_string));
                                break;
                            case '4':
                                writeResult(type, new Hashes.SHA512().hex(formData.hash_string));
                                break;
                            case '5':
                                writeResult(type, new Hashes.RMD160().hex(formData.hash_string));
                                break;
                        }
                        break;
                    case 'code':
                        switch (formData.code_type) {
                            case '1':
                                writeResult(type, btoa(formData.code_string));
                                break;
                            case '2':
                                writeResult(type, atob(formData.code_string));
                                break;
                            case '3':
                                writeResult(type, encodeURIComponent(formData.code_string));
                                break;
                            case '4':
                                writeResult(type, decodeURIComponent(formData.code_string));
                                break;
                            case '5':
                                writeResult(type, $("<textarea/>").html(formData.code_string).text());
                                break;
                            case '6':
                                writeResult(type, $('<textarea/>').text(formData.code_string).html());
                                break;
                        }
                        break;
                    case 'query':
                        try{
                            let parse = JSON.parse(formData.query_string);
                            writeResult(type, $.param(parse));
                        }catch (e) {
                            writeResult(type, JSON.stringify(query2json(formData.query_string)));
                        }
                        break;
                    case 'hex':
                        if(formData.hex_type === '1'){
                            console.log(hex.encode(formData.hex_string));
                            writeResult(type, hex.encode(formData.hex_string));
                        }else{
                            console.log(hex.decode(formData.hex_string))
                            writeResult(type, hex.decode(formData.hex_string));
                        }
                        break;
                    case 'timestamp':
                        if(formData.timestamp_string.indexOf('-') > 0 || formData.timestamp_string.indexOf('/') > 0){
                            if(formData.timestamp_string.indexOf(':') <= 0) formData.timestamp_string = formData.timestamp_string + ' 00:00';
                            writeResult(type, (new Date(formData.timestamp_string).getTime() / 1000 | 0));
                        }else{
                            if(!formData.timestamp_string){
                                formData.timestamp_string = (Date.now() / 1000 | 0) + '';
                            }
                            let newString = formData.timestamp_string;
                            while (newString.length < 13) newString = newString + '0';
                            newString = newString.substr(0, 13);
                            writeResult(type, dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(newString))));
                        }
                        break;
                    case 'translate':
                        let that = $(this), url = 'http://fanyi.youdao.com/openapi.do?keyfrom=hello-today&key=2131466618&type=data&doctype=json&version=1.1&q=';
                        that.text('Translating').attr('disabled', true);
                        try{
                            $.getJSON(url + formData.translate_string, function(detail){
                                let result = '';
                                switch(detail.errorCode){
                                    case 20:
                                        result = '要翻译的文本过长';
                                        break;
                                    case 30:
                                        result = '无法进行有效的翻译';
                                        break;
                                    case 40:
                                        result = '不支持的语言类型';
                                        break;
                                    case 50:
                                        result = '无效的key';
                                        break;
                                    case 0:
                                        result += '<p>' + detail.translation.join('<br>') + '</p>';
                                        result += '<p>';
                                        if(detail.hasOwnProperty("basic") && detail.basic.hasOwnProperty("explains")){
                                            for(var i in detail.basic.explains){
                                                result += detail.basic.explains[i] + '<br>';
                                            }
                                        }
                                        result += '</p><p>';
                                        if(detail.hasOwnProperty("web")){
                                            for(var i in detail.web){
                                                result += detail.web[i].key + ': ';
                                                result += detail.web[i]["value"].join(', ') + '<br>';
                                            }
                                        }
                                        result += '</p>';
                                        break;
                                    default:
                                        result = '未知错误, code ' + detail.errorCode;
                                }
                                writeResult(type, result, false, false, false);
                                that.text('Translate').attr('disabled', false);
                            });
                        }catch (e) {
                            writeResult(type, e.message || e);
                        }
                        break;
                    case 'pinyin':
                        writeResult(type, PinyinHelper.convertToPinyinString(formData.pinyin_string, formData.pinyin_separator, formData.pinyin_format));
                        break;
                    case 'qrcode':
                        let fReader = new FileReader(),
                            logo = document.getElementById("qrcode_logo").files[0];
                        if(logo){
                            fReader.readAsDataURL(logo);
                            fReader.onloadend = function(event){
                                writeResult(type, '');
                                $('#result-qrcode').qrcode({
                                    text: formData.qrcode_string,
                                    width: formData.qrcode_size,
                                    height: formData.qrcode_size,
                                    src: event.target.result
                                });
                            };
                        }else{
                            writeResult(type, '');
                            $('#result-qrcode').qrcode({
                                text: formData.qrcode_string,
                                width: formData.qrcode_size,
                                height: formData.qrcode_size
                            });
                        }
                        break;
                    case 'location':
                        $.getJSON('http://ip.taobao.com/service/getIpInfo.php?ip=' + (formData.location_string || 'myip'), function(json){
                            writeResult(type, json.data.ip+':'+ json.data.country+' '+json.data.region+' '+json.data.city+' '+json.data.isp);
                        });
                        break;
                    case 'xor':
                        if(formData.xor_type === '1'){
                            writeResult(type, XORCipher.encode(formData.xor_key, formData.xor_string));
                        }else{
                            writeResult(type, XORCipher.decode(formData.xor_key, formData.xor_string));
                        }
                        break;
                    case 'sign':
                        let inputJson = JSON.parse(formData.sign_string), ordered = {}, orderString = '';
                        Object.keys(inputJson).sort().forEach(function(key) {
                            ordered[key] = inputJson[key];
                        });
                        if(formData.sign_exclude) formData.sign_exclude = formData.sign_exclude.split(",");
                        for(let i in ordered){
                            if(!formData.sign_exclude || formData.sign_exclude.indexOf(i) == -1){
                                orderString += i + '=' + ordered[i] + '&';
                            }
                        }
                        orderString = orderString.substr(0, orderString.length - 1) + formData.sign_key;
                        writeResult(type, formData.sign_type === 'md5' ? new Hashes.MD5().hex(orderString) : new Hashes.SHA1().hex(orderString));
                        break;
                    case 'beian':
                        if(formData.beian_code){
                            $.ajax({
                                url: 'http://beian.miit.gov.cn/icp/publish/query/icpMemoInfo_searchExecute.action',
                                type: 'post',
                                data: {
                                    siteName: '',
                                    condition: 1,
                                    siteDomain: formData.beian_string,
                                    siteUrl: '',
                                    mainLicense: '',
                                    siteIp: '',
                                    unitName: '',
                                    mainUnitNature: -1,
                                    certType: -1,
                                    mainUnitCertNo: '',
                                    verifyCode: formData.beian_code
                                },
                                success: function(html){
                                    var result = $(html).find('td').filter(function() {
                                        return $(this).text().indexOf(formData.beian_string) >= 0;
                                    });
                                    if(result){
                                        result = result.html();
                                        var wrapped = $("<div>" + result + "</div>");
                                        if(wrapped.find('td').length > 0){
                                            wrapped.find('td').each(function(){
                                                var text = $(this).text().trim();
                                                if(text.indexOf(formData.beian_string) >= 0){
                                                    $(this).html('<a href="http://'+text+'" target="_blank">'+text+'</a> | <a href="https://whois.aliyun.com/whois/domain/'+formData.beian_string+'" target="_blank">whois</a> | <a href="https://www.ip.cn/?ip='+text+'" target="_blank">ip</a>');
                                                }else{
                                                    $(this).text(text);
                                                }
                                            });
                                            wrapped.find('td:empty').parent().remove();
                                            result = wrapped.html();
                                        }else{
                                            result = $($(html).find('tr').html()).text().trim();
                                        }
                                    }
                                    writeResult(type, result?result:'无数据', false, false);
                                },
                                error: function(){
                                    writeResult(type, '返回失败', false);
                                }
                            });
                        }
                        break;
                }
            }catch (e) {
                writeResult(type, e.message || e);
            }
        });
        $('#location_ip').click(function(){
            window.open('https://www.ip.cn/?ip='+$('#location_string').val());
        });
        $('#beian-code-refresh').click(function(){
            getBeianCode();
            $('#beian-code').focus();
        });
    });
})(window, document);