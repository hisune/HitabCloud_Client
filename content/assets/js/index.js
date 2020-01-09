window.HitabIndex = function(){
    let index = {
        tpl: {
            item_group: "<li data-type='group' class='nav-item index-group-item context-menu {active}' data-id='{id}' data-name='{name}' data-sort='{sort}'>" +
                "<a class='nav-link' href='#'>{name}</a>" +
                "</li>",
            item_url: "<div class='col text-truncate'>" +
                "    <div data-type='url' class='info-box context-menu' data-id='{id}' data-sort='{sort}' data-name='{name}' data-link='{link}' data-group_id='{group_id}' data-color='{color}'>" +
                "        <div class='info-box-content' style='background-color: {color}'>" +
                "            <a href='{link}'>" +
                "                <span class='info-box-number'>{name}</span>" +
                "                <span class='info-box-text-app'>{link_display}</span>" +
                "            </a>" +
                "        </div>" +
                "    </div>" +
                "</div>",
            dialog_group: "<div class='form-group'>" +
                "    <label>Name</label>" +
                "    <input type='hidden' id='index-group-id'>" +
                "    <input type='text' class='form-control' id='index-group-name' placeholder='Group Name'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Sort</label>" +
                "    <input value='0' type='number' class='form-control' id='index-group-sort' placeholder='Bigger in Front'>" +
                "</div>",
            dialog_url: "<div class='form-group'>" +
                "    <label>Link</label>" +
                "    <input type='text' class='form-control' id='index-url-link' placeholder='Url'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Name</label>" +
                "    <input type='hidden' id='index-url-id'>" +
                "    <input type='text' class='form-control' id='index-url-name' placeholder='Customer Name'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Color</label>" +
                "    <div class='input-group' id='index-color-input'>" +
                "    <input type='text' class='form-control' id='index-url-color' value='' placeholder='Background Color'>" +
                "    <span class=\"input-group-append\">\n" +
                "    <span class=\"input-group-text colorpicker-input-addon\"><i></i></span>\n" +
                "    </span>" +
                "    </div>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Sort</label>" +
                "    <input value='0' type='number' class='form-control' id='index-url-sort' placeholder='Bigger in Front'>" +
                "</div>",
            dialog_setting: "<div class='form-group'>" +
                "    <label>ID</label>" +
                "    <input type='text' class='form-control' id='index-cos-id' placeholder='Get it from https://hisune.com'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Sync Secret</label>" +
                "    <input type='password' class='form-control' id='index-cos-secret' placeholder='Get it from https://hisune.com'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Column Size</label>" +
                "    <select class='form-control' id='index-cos-column_size'>" +
                "        <option value='4' selected>4</option>" +
                "        <option value='5'>5</option>" +
                "        <option value='6'>6</option>" +
                "    </select>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Dark Mode</label>" +
                "    " +
                "        <label class='custom-control custom-switch'>" +
                "            <input type='checkbox' class='custom-control-input' id='index-cos-dark_mode'>" +
                "            <div class='custom-control-label'></div>" +
                "        </label>" +
                "    " +
                "</div>",
            empty_icon: "<div class='row'><div class='col-xs-4 col-md-1-5'>" +
                "    <div class='info-box context-normal' data-type='url'>" +
                "        <a id='index-url-add'><i class='fas fa-plus'></i></a>" +
                "    </div>" +
                "</div></div>"
        },
        currentGroup: 0,
        colors: ['#816ec2','#556aa0','#556aa0','#7fb3c9','#b29583','#707ba8','#accf43','#7fb3c9','#7ac95f', '#78b8f9','#660066','#999966','#FFCC00','#330066','#663333','#990000'],
        groupUpsert: function(data){
            data = data || {};
            let that = this, id = data.id || 0, name = data.name || '', sort = data.sort || 0;
            bootbox.dialog({
                title: 'Upsert a Group',
                message: that.tpl.dialog_group,
                onShow: function(e){
                    if(id) $('#index-group-id').val(id);
                    if(name) $('#index-group-name').val(name);
                    if(sort) $('#index-group-sort').val(sort);
                },
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: 'btn-default'
                    },
                    ok: {
                        label: "Save",
                        className: 'btn-primary',
                        callback: function(){
                            HitabUtil.setRemoteOrLocal('/group/upsert', {
                                'id': $('#index-group-id').val(),
                                'name': $('#index-group-name').val(),
                                'sort': $('#index-group-sort').val()
                            }, function(){
                                that.initGroup();
                            });
                        }
                    }
                }
            });
        },
        urlUpsert: function(data){
            data = data || {};
            let that = this, id = data.id || 0, name = data.name || '', link = data.link || '', color = data.color || '', sort = data.sort || 0;
            bootbox.dialog({
                title: 'Upsert a Url',
                message: that.tpl.dialog_url,
                onShow: function(e){
                    color = color || that.colors[HitabUtil.getRandomInt(0, 15)];
                    if(id) $('#index-url-id').val(id);
                    if(name) $('#index-url-name').val(name);
                    if(link) $('#index-url-link').val(link);
                    if(color) $('#index-url-color').val(color);
                    if(sort) $('#index-url-sort').val(sort);
                    $('#index-color-input').colorpicker();
                    $('#index-url-link').change(function(){
                        if($('#index-url-name').val() === ''){
                            $('#index-url-name').val($(this).val().replace(/^(https?|ftp):\/\//, ''))
                        }
                    });
                },
                buttons: {
                    cancel: {
                        label: "Cancel",
                        className: 'btn-default'
                    },
                    ok: {
                        label: "Save",
                        className: 'btn-primary',
                        callback: function(){
                            let link = $('#index-url-link').val();
                            if(link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0){
                                link = 'http://' + link;
                            }
                            HitabUtil.setRemoteOrLocal('/url/upsert', {
                                'id': $('#index-url-id').val(),
                                'name': $('#index-url-name').val(),
                                'group_id': that.currentGroup,
                                'link': link,
                                'color': $('#index-url-color').val(),
                                'sort': $('#index-url-sort').val()
                            }, function(){
                                that.initGroup();
                            });
                        }
                    }
                }
            })
        },
        setWeather: function(obj, cb){
            if (obj && obj.value){
                $('#weather-text-detail').text(obj.value.normal);
                if(obj.value.special){
                    $('#weather-special').addClass('glyphicon glyphicon-info-sign').tooltip({
                        title: obj.value.special,
                        placement: 'bottom'
                    })
                }
            }
            cb && cb();
        },
        init: function(){
            let that = this;
            // bind click
            $('#index-cog').click(function(){
                bootbox.dialog({
                    title: 'System Setting',
                    message: that.tpl.dialog_setting,
                    size: 'middle',
                    onShow: function(e){
                        HitabUtil.getLocalOrRemote('/user/get', null, function(user){
                            for(let i in user){
                                if(user.hasOwnProperty(i)){
                                    if(i === 'dark_mode'){
                                        $('#index-cos-' + i).attr('checked', !!user[i]);
                                    }else{
                                        $('#index-cos-' + i).val(user[i]);
                                    }
                                }
                            }
                        });
                    },
                    buttons: {
                        cancel: {
                            label: "Cancel",
                            className: 'btn-default'
                        },
                        ok: {
                            label: "Save",
                            className: 'btn-primary',
                            callback: function(){
                                HitabUtil.setRemoteOrLocal('/user/set', {
                                    id: $('#index-cos-id').val(),
                                    secret: $('#index-cos-secret').val(),
                                    column_size: $('#index-cos-column_size').val(),
                                    dark_mode: $('#index-cos-dark_mode:checked').length,
                                }, null, true);
                            }
                        }
                    }
                });
            });
            $('#index-group-add').click(function(){
                that.groupUpsert();
            });
            $('#index-icon').on('click', '#index-url-add', function(){
                that.urlUpsert();
            });
            $(document).on("click", ".index-group-item" , function() {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                that.currentGroup = $(this).data('id');
                localStorage.setItem('active.group', $(this).data('id'));
                that.initGroup();
            });
            // context
            $.contextMenu({
                selector: '.context-menu',
                callback: function(key, options) {
                    let context = this, type = context.data('type');
                    switch (key) {
                        case 'add':
                            that[type + 'Upsert']();
                            break;
                        case 'edit':
                            that[type + 'Upsert'](context.data());
                            break;
                        case 'delete':
                            bootbox.confirm("Are you sure to delete 【" + context.data('name') + "】?", function(result){
                                if(result) HitabUtil.setRemoteOrLocal('/' + type + '/del/' + context.data('id'), null, null, true);
                            });
                            break;
                    }
                },
                items: {
                    "add": {name: "Add", icon: "add"},
                    "edit": {name: "Edit", icon: "edit"},
                    "sep1": "---------",
                    "delete": {name: "Delete", icon: "delete"},
                }
            });
            that.initGroup();
            // weather
            let weather = localStorage.getItem('weather'),
                frameDom = $('#weather-iframe'),
                weatherTopDom = $('#weather-text-top');
            let week = {0:'日',1:'一',2:'二',3:'三',4:'四',5:'五',6:'六'};
            $('#weather-text-week').text('周' + week[new Date().getDay()]);
            let lunar = HitabUtil.getLunar(), date = new Date();
            $('#weather-text-bottom').text((date.getMonth() + 1) + '月' + date.getDate() + '日 ' + lunar.IMonthCn + lunar.IDayCn);
            if(weather){
                weather = JSON.parse(weather);
                that.setWeather(weather);
            }
            if(!weather || weather.at < new Date().getTime() - 1800000){
                localStorage.removeItem('weather');
            }
            $('#weather-text').hover(function(){
                if(!frameDom.attr('src')){
                    frameDom.attr('src', 'https://tianqi.qq.com/');
                }
            });
            window.addEventListener("message", function(event) {
                console.log(event);
                console.log('event');
                switch (event.data.call) {
                    case 'setWeather':
                        that.setWeather(event.data, function(){
                            localStorage.setItem('weather', JSON.stringify({value:event.data.value,at:new Date().getTime()}));
                        });
                        $('#weather-iframe').height(event.data.value.height);
                        break;
                }
            });
        },
        initGroup: function(){
            let that = this;
            HitabUtil.getLocalOrRemote('/group/get', null, function(data){
                let group = $('#index-group');
                if(data !== null) group.empty();
                if(data && data.length > 0){
                    that.currentGroup = localStorage.getItem('active.group');
                    localStorage.setItem('/group/get', JSON.stringify(data));
                    for(let i in data){
                        if(data.hasOwnProperty(i)){
                            let active = '';
                            if(!that.currentGroup && i === '0'){
                                that.currentGroup = data[i].id;
                                active = 'active';
                            }else{
                                active = data[i].id == that.currentGroup ? 'active' : '';
                            }
                            group.append(HitabUtil.format(that.tpl.item_group, {
                                active: active,
                                id: data[i].id,
                                name: data[i].name,
                                sort: data[i].sort
                            }));
                        }
                    }
                    // init urls
                    if(that.currentGroup){
                        that.initUrl();
                    }
                }
            });
        },
        initUrl: function(){
            let that = this;
            HitabUtil.getLocalOrRemote('/url/get/' + that.currentGroup, null, function(data){
                let icon = $('#index-icon'), left = HitabUtil.user.column_size;
                if(data !== null) icon.empty();
                if(data && data.length > 0){
                    let html = '<div class="row">';
                    localStorage.setItem('/url/get/' + that.currentGroup, JSON.stringify(data));
                    for(let i in data){
                        if(data.hasOwnProperty(i)) {
                            if((parseInt(i)) % HitabUtil.user.column_size === 0){
                                html += '</div><div class="row">';
                                left = HitabUtil.user.column_size;
                            }
                            left --;
                            let link_display = data[i].link.replace(/^(https?|ftp):\/\//, '');
                            html += HitabUtil.format(that.tpl.item_url, {
                                size: HitabUtil.user.column_size,
                                id: data[i].id,
                                name: data[i].name,
                                sort: data[i].sort,
                                color: data[i].color,
                                group_id: data[i].group_id,
                                link: data[i].link,
                                link_display: link_display
                            });
                        }
                    }
                    if(left > 0){ // 补充剩余的col
                        for(let i=0;i<left;i++){
                            html += '<div class="col"></div>';
                        }
                    }
                    html += '</div>';
                    icon.html(html);
                }else{
                    icon.html(that.tpl.empty_icon);
                }
            })
        },
    };
    return index;
}(window, document);

HitabIndex.init();