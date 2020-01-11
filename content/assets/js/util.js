window.HitabUtil = function(){
    let user = JSON.parse(localStorage.getItem('user')) || {}, util = {
        user: {
            id: user.id || 0,
            secret: user.secret || '',
            column_size: user.column_size || 4,
            dark_mode: user.dark_mode || 0,
        },
        devType: {
            1: 'dev-json',
            2: 'dev-request',
            3: 'dev-calender',
            4: 'dev-md'
        },
        tags: {},
        dev: {
            id: 0,
            type: 0,
            name: "",
            content: '{}',
            tags: []
        },
        db: null,
        tplTag: "<div class='form-check form-check-inline custom-switch'>" +
            "  <input name='icon-tag' {checked} type=\"checkbox\" class=\"custom-control-input\" value='{id}' id=\"icon-tag{id}\">\n" +
            "  <label class=\"custom-control-label\" for=\"icon-tag{id}\">{name} ({count})</label>" +
            "</div>",
        tplIcon: function(){
            let tpl = "<div class='form-group'>" +
                "    <label>Name</label>" +
                "    <input type='text' value='"+this.dev.name+"' class='form-control' id='icon-name' placeholder='Enter a Name'>" +
                "</div>" +
                "<div class='form-group'>" +
                "    <label>Tags</label>" +
                "    <div id='icon-tags'>{tags}</div>" +
                "</div>";
            let html = '';
            for(let i in this.tags){
                let checked = this.dev.tags.indexOf(this.tags[i].id) >=0 ? 'checked' : '';
                html += this.format(this.tplTag, {id: this.tags[i].id, name: this.tags[i].name, checked: checked, count: this.tags[i].count});
            }
            return this.format(tpl, {tags: html});
        },
        initTodo: function(count){
            let dom = $('#todo');
            if(!count) count = localStorage.getItem('todo') || 0;
            if(count > 0){
                dom.text(count);
            }else{
                dom.text('');
            }
        },
        showError: function(msg){
            let dom = $('#error-alert');
            dom.text(msg).fadeIn();
            setTimeout(function () {
                dom.fadeOut();
            }, 5000);
        },
        format: function(string, arguments){
            for( let arg in arguments ) {
                string = string.replace(new RegExp("{" + arg + "}", 'g'), arguments[arg]);
            }
            return string;
        },
        getLunar: function (date) {
            let day = date || new Date(),
                calendar = {lunarInfo:[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,21952,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],solarMonth:[31,28,31,30,31,30,31,31,30,31,30,31],Gan:["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],Zhi:["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],Animals:["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],solarTerm:["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"],sTermInfo:["9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd0b06bdb0722c965ce1cfcc920f","b027097bd097c36b0b6fc9274c91aa","9778397bd19801ec9210c965cc920e","97b6b97bd19801ec95f8c965cc920f","97bd09801d98082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd197c36c9210c9274c91aa","97b6b97bd19801ec95f8c965cc920e","97bd09801d98082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec95f8c965cc920e","97bcf97c3598082c95f8e1cfcc920f","97bd097bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c3598082c95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf97c359801ec95f8c965cc920f","97bd097bd07f595b0b6fc920fb0722","9778397bd097c36b0b6fc9210c8dc2","9778397bd19801ec9210c9274c920e","97b6b97bd19801ec95f8c965cc920f","97bd07f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c920e","97b6b97bd19801ec95f8c965cc920f","97bd07f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c91aa","97b6b97bd19801ec9210c965cc920e","97bd07f1487f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c965cc920e","97bcf7f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b97bd19801ec9210c9274c920e","97bcf7f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c91aa","97b6b97bd197c36c9210c9274c920e","97bcf7f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c8dc2","9778397bd097c36c9210c9274c920e","97b6b7f0e47f531b0723b0b6fb0722","7f0e37f5307f595b0b0bc920fb0722","7f0e397bd097c36b0b6fc9210c8dc2","9778397bd097c36b0b70c9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e37f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc9210c8dc2","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9274c91aa","97b6b7f0e47f531b0723b0787b0721","7f0e27f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c91aa","97b6b7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","9778397bd097c36b0b6fc9210c8dc2","977837f0e37f149b0723b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f5307f595b0b0bc920fb0722","7f0e397bd097c35b0b6fc9210c8dc2","977837f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0721","7f0e37f1487f595b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc9210c8dc2","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd097c35b0b6fc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0787b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0b0bb0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14998082b0723b06bd","7f07e7f0e37f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e397bd07f595b0b0bc920fb0722","977837f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f1487f595b0b0bb0b6fb0722","7f0e37f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e37f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e37f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f1487f531b0b0bb0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0723b06bd","7f07e7f0e47f149b0723b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14998082b0723b06bd","7f07e7f0e37f14998083b0787b0721","7f0e27f0e47f531b0723b0b6fb0722","7f0e37f0e366aa89801eb072297c35","7ec967f0e37f14898082b0723b02d5","7f07e7f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e36665b66aa89801e9808297c35","665f67f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b0721","7f07e7f0e47f531b0723b0b6fb0722","7f0e36665b66a449801e9808297c35","665f67f0e37f14898082b0723b02d5","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e36665b66a449801e9808297c35","665f67f0e37f14898082b072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e26665b66a449801e9808297c35","665f67f0e37f1489801eb072297c35","7ec967f0e37f14998082b0787b06bd","7f07e7f0e47f531b0723b0b6fb0721","7f0e27f1487f531b0b0bb0b6fb0722"],nStr1:["日","一","二","三","四","五","六","七","八","九","十"],nStr2:["初","十","廿","卅"],nStr3:["正","二","三","四","五","六","七","八","九","十","冬","腊"],lYearDays:function(y){var i,sum=348;for(i=32768;i>8;i>>=1)sum+=calendar.lunarInfo[y-1900]&i?1:0;return sum+calendar.leapDays(y)},leapMonth:function(y){return 15&calendar.lunarInfo[y-1900]},leapDays:function(y){return calendar.leapMonth(y)?65536&calendar.lunarInfo[y-1900]?30:29:0},monthDays:function(y,m){return m>12||m<1?-1:calendar.lunarInfo[y-1900]&65536>>m?30:29},solarDays:function(y,m){if(m>12||m<1)return-1;var ms=m-1;return 1==ms?y%4==0&&y%100!=0||y%400==0?29:28:calendar.solarMonth[ms]},toGanZhiYear:function(lYear){var ganKey=(lYear-3)%10,zhiKey=(lYear-3)%12;return 0==ganKey&&(ganKey=10),0==zhiKey&&(zhiKey=12),calendar.Gan[ganKey-1]+calendar.Zhi[zhiKey-1]},toAstro:function(cMonth,cDay){var s="魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯",arr=[20,19,21,21,21,22,23,23,23,23,22,22];return s.substr(2*cMonth-(cDay<arr[cMonth-1]?2:0),2)+"座"},toGanZhi:function(offset){return calendar.Gan[offset%10]+calendar.Zhi[offset%12]},getTerm:function(y,n){if(y<1900||y>2100)return-1;if(n<1||n>24)return-1;var _table=calendar.sTermInfo[y-1900],_info=[parseInt("0x"+_table.substr(0,5)).toString(),parseInt("0x"+_table.substr(5,5)).toString(),parseInt("0x"+_table.substr(10,5)).toString(),parseInt("0x"+_table.substr(15,5)).toString(),parseInt("0x"+_table.substr(20,5)).toString(),parseInt("0x"+_table.substr(25,5)).toString()],_calday=[_info[0].substr(0,1),_info[0].substr(1,2),_info[0].substr(3,1),_info[0].substr(4,2),_info[1].substr(0,1),_info[1].substr(1,2),_info[1].substr(3,1),_info[1].substr(4,2),_info[2].substr(0,1),_info[2].substr(1,2),_info[2].substr(3,1),_info[2].substr(4,2),_info[3].substr(0,1),_info[3].substr(1,2),_info[3].substr(3,1),_info[3].substr(4,2),_info[4].substr(0,1),_info[4].substr(1,2),_info[4].substr(3,1),_info[4].substr(4,2),_info[5].substr(0,1),_info[5].substr(1,2),_info[5].substr(3,1),_info[5].substr(4,2)];return parseInt(_calday[n-1])},toChinaMonth:function(m){if(m>12||m<1)return-1;var s=calendar.nStr3[m-1];return s+="月"},toChinaDay:function(d){var s;switch(d){case 10:s="初十";break;case 20:s="二十";break;case 30:s="三十";break;default:s=calendar.nStr2[Math.floor(d/10)],s+=calendar.nStr1[d%10]}return s},getAnimal:function(y){return calendar.Animals[(y-4)%12]},solar2lunar:function(y,m,d){if(y<1900||y>2100)return-1;if(1900==y&&1==m&&d<31)return-1;if(y)var objDate=new Date(y,parseInt(m)-1,d);else var objDate=new Date;var i,leap=0,temp=0,y=objDate.getFullYear(),m=objDate.getMonth()+1,d=objDate.getDate(),offset=(Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate())-Date.UTC(1900,0,31))/864e5;for(i=1900;i<2101&&offset>0;i++)temp=calendar.lYearDays(i),offset-=temp;offset<0&&(offset+=temp,i--);var isTodayObj=new Date,isToday=!1;isTodayObj.getFullYear()==y&&isTodayObj.getMonth()+1==m&&isTodayObj.getDate()==d&&(isToday=!0);var nWeek=objDate.getDay(),cWeek=calendar.nStr1[nWeek];0==nWeek&&(nWeek=7);var year=i,leap=calendar.leapMonth(i),isLeap=!1;for(i=1;i<13&&offset>0;i++)leap>0&&i==leap+1&&0==isLeap?(--i,isLeap=!0,temp=calendar.leapDays(year)):temp=calendar.monthDays(year,i),1==isLeap&&i==leap+1&&(isLeap=!1),offset-=temp;0==offset&&leap>0&&i==leap+1&&(isLeap?isLeap=!1:(isLeap=!0,--i)),offset<0&&(offset+=temp,--i);var month=i,day=offset+1,sm=m-1,gzY=calendar.toGanZhiYear(year),firstNode=calendar.getTerm(year,2*m-1),secondNode=calendar.getTerm(year,2*m),gzM=calendar.toGanZhi(12*(y-1900)+m+11);d>=firstNode&&(gzM=calendar.toGanZhi(12*(y-1900)+m+12));var isTerm=!1,Term=null;firstNode==d&&(isTerm=!0,Term=calendar.solarTerm[2*m-2]),secondNode==d&&(isTerm=!0,Term=calendar.solarTerm[2*m-1]);var dayCyclical=Date.UTC(y,sm,1,0,0,0,0)/864e5+25567+10,gzD=calendar.toGanZhi(dayCyclical+d-1),astro=calendar.toAstro(m,d);return{lYear:year,lMonth:month,lDay:day,Animal:calendar.getAnimal(year),IMonthCn:(isLeap?"闰":"")+calendar.toChinaMonth(month),IDayCn:calendar.toChinaDay(day),cYear:y,cMonth:m,cDay:d,gzYear:gzY,gzMonth:gzM,gzDay:gzD,isToday:isToday,isLeap:isLeap,nWeek:nWeek,ncWeek:"星期"+cWeek,isTerm:isTerm,Term:Term,astro:astro}},lunar2solar:function(y,m,d,isLeapMonth){var isLeapMonth=!!isLeapMonth,leapMonth=calendar.leapMonth(y);calendar.leapDays(y);if(isLeapMonth&&leapMonth!=m)return-1;if(2100==y&&12==m&&d>1||1900==y&&1==m&&d<31)return-1;var day=calendar.monthDays(y,m),_day=day;if(isLeapMonth&&(_day=calendar.leapDays(y,m)),y<1900||y>2100||d>_day)return-1;for(var offset=0,i=1900;i<y;i++)offset+=calendar.lYearDays(i);for(var leap=0,isAdd=!1,i=1;i<m;i++)leap=calendar.leapMonth(y),isAdd||leap<=i&&leap>0&&(offset+=calendar.leapDays(y),isAdd=!0),offset+=calendar.monthDays(y,i);isLeapMonth&&(offset+=day);var stmap=Date.UTC(1900,1,30,0,0,0),calObj=new Date(864e5*(offset+d-31)+stmap),cY=calObj.getUTCFullYear(),cM=calObj.getUTCMonth()+1,cD=calObj.getUTCDate();return calendar.solar2lunar(cY,cM,cD)}};
            return calendar.solar2lunar(day.getFullYear(), day.getMonth() + 1, day.getDate());
        },
        serializeObject: function($form){
            let serializeObj = {}, array = $form.serializeArray();
            $(array).each(function(){
                if(serializeObj[this.name]){
                    if($.isArray(serializeObj[this.name])){
                        serializeObj[this.name].push(this.value);
                    }else{
                        serializeObj[this.name]=[serializeObj[this.name],this.value];
                    }
                }else{
                    serializeObj[this.name]=this.value;
                }
            });
            return serializeObj;
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        request : function(uri, data, callback){
            let that = this;
            $.ajax({
                type: "POST",
                url: 'https://hitab.hisune.com' + uri,
                data: data,
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", util.user.id + ':' + util.user.secret);
                },
                success: function(result) {
                    callback(result, null);
                },
                error: function(){
                    that.showError('网络错误，请检查您的网络');
                }
            });
        },
        setToDB: function(key, value, callback, table){
            try{
                table = table || 'caches';
                let transaction = this.db.result.transaction([table], 'readwrite'),
                    objectStore = transaction.objectStore(table);
                let request = objectStore.put({uri: key, content: value});
                request.onsuccess = function(event){
                    callback && callback();
                };
                request.onerror = function(event) {
                    bootbox.alert('Error to Set in DB with key ' + key);
                };
            }catch (e) {
                this.showError(e.message);
            }
        },
        getInDB: function(key, callback, table){
            try{
                table = table || 'caches';
                console.log(table);
                let transaction = this.db.result.transaction([table], 'readwrite'),
                    objectStore = transaction.objectStore(table),
                    request = objectStore.get(key);
                request.onerror = function(event) {
                    bootbox.alert('Error to Get in DB with key ' + key);
                };
                request.onsuccess = function(event) {
                    if(callback){
                        if(request.result) callback(request.result.content);
                        else callback(null);
                    }
                };
            }catch (e) {
                this.showError(e.message);
            }
        },
        getLocalOrRemote: function(uri, data, callback){
            let that = this;
            that.getInDB(uri, function(result){
                if(result){
                    callback && callback(result);
                }
            });
            if(that.user.id && that.user.secret){
                that.request(uri, data, function(result, err){
                    if(err) return;
                    if(result && result.message){
                        bootbox.alert({
                            message: result.message,
                            onHide: function(){}
                        });
                    }else{
                        if(result.hash){
                            that.getInDB(uri, function(hash){
                                if(hash !== result.hash){ // 只有本地缓存和线上不一致才重新回调线上数据
                                    that.setToDB(uri, result.hash, null, 'hashes');
                                    that.setToDB(uri, result.data, function(){
                                        callback && callback(result.data);
                                    });
                                }
                            }, 'hashes');
                        }else{
                            callback && callback(result.data);
                        }
                    }
                });
            }
        },
        setRemoteOrLocal: function(uri, data, callback, reload) {
            reload = reload || false;
            if(this.user.id && this.user.secret){
                this.request(uri, data, function(result, err){
                    if(result.message){
                        bootbox.alert({
                            message: result.message,
                            onHide: function(){
                                reload && window.location.reload();
                            }
                        });
                    }else{
                        callback && callback(result);
                        reload && window.location.reload();
                    }
                });
            }else{
                bootbox.alert('请先在系统设置同步ID及Secret');
            }
        },
        autoSave: function(callback){
            let local = JSON.parse(localStorage.getItem('auto-save')) || {};
            for(let i in local){
                $('.auto-save[name='+i+']').val(local[i]);
            }
            $('.auto-save').change(function(){
                let local = JSON.parse(localStorage.getItem('auto-save')) || {};
                local[$(this).attr('name')] = $(this).val();
                localStorage.setItem('auto-save', JSON.stringify(local));
                callback && callback(local);
            });
            return this;
        },
        enableCopy: function(){
            let clipboard = new ClipboardJS('code', {
                text: function(trigger) {
                    return $(trigger).text();
                }
            });
            clipboard.on('success', function(e) {
                let trigger = $(e.trigger);
                trigger.tooltip({title: 'Copied!', trigger: 'click', placement: 'top'}).tooltip('show');
                setTimeout(function () {
                    trigger.tooltip('hide');
                }, 1000);
            });
            return this;
        },
        setDevIcon: function(){
            if(this.dev.id){
                $('.upsert-icon-edit').show();
                $('.delete-icon').show();
            }
        },
        setDev: function(data){
            let that = this;
            if(data.hasOwnProperty('id')) this.dev.id = data.id;
            if(data.hasOwnProperty('name')) this.dev.name = data.name;
            if(data.hasOwnProperty('tags')) this.dev.tags = data.tags;
            if(data.hasOwnProperty('content')) this.dev.content = typeof data.content === 'object' ? JSON.stringify(data.content) : data.content;
            localStorage.setItem(this.devType[this.dev.type], JSON.stringify(this.dev));
            this.setDevIcon();
        },
        appendSidebarContent: function(data){
            let list = $('#content-list'), that = this;
            list.empty();
            for(let i in data){
                let active = that.dev.id == data[i].id ? 'active' : '';
                list.append('<li class="content-list-li '+active+'" data-id="'+data[i].id+'"><a>'+data[i].name+'<span>'+data[i].created_at.split(" ")[0]+'</span></a></li>');
            }
        },
        sidebar: function(clickListItemCall){
            let that = this, initContent = function(){
                HitabUtil.getLocalOrRemote('/content/get/'+that.dev.type+'/', null, function(data){
                    that.appendSidebarContent(data);
                });
            };
            // event
            $('.sidebar-search').click(function(){
                $('#sidebar').toggleClass('active');
                let input = $('#submit-search input[name=word]');
                if(input.is(':visible')){
                    input.focus();
                }
            });
            $('#content').click(function(){
                $('#sidebar').addClass('active');
            });
            $('.delete-icon').click(function(){
                let data = JSON.parse(localStorage.getItem(that.devType[that.dev.type])) || {};
                bootbox.confirm('Are you sure to delete 【' + data.name + '】', function(result){
                    if(result){
                        HitabUtil.setRemoteOrLocal('/content/del/' + data.id, null, function(){
                            that.setDev({id: 0, name: '', content: '{}', tags: []});
                            initContent();
                        });
                    }
                });
            });
            $('.upsert-icon').click(function(){
                let data = that.dev;
                if($(this).hasClass('upsert-icon-add')){
                    data.id = null;
                }
                bootbox.dialog({
                    title: data.id ? 'Modify ID ' + data.id : 'Add a New Record',
                    message: that.tplIcon(),
                    buttons: {
                        cancel: {
                            label: "Cancel!"
                        },
                        noclose: {
                            label: "Add a Tag",
                            className: 'btn-warning',
                            callback: function(){
                                bootbox.prompt('Add a New Tag', function(result){
                                    if(result){
                                        HitabUtil.setRemoteOrLocal('/tag/upsert', {
                                            name: result,
                                            type: that.dev.type
                                        }, function(resultAddTag){
                                            if(resultAddTag.data){
                                                HitabUtil.tags.push({id: resultAddTag.data.id, type: that.dev.type, name: result, count: 0});
                                                $('#search-tag').append('<option value="'+resultAddTag.data.id+'">'+result+'(0)'+'</option>');
                                                $('#icon-tags').append(that.format(that.tplTag, {
                                                    id: resultAddTag.data.id,
                                                    name: result,
                                                    checked: '',
                                                    count: 0
                                                }));
                                            }
                                        });
                                    }
                                });
                                return false;
                            }
                        },
                        ok: {
                            label: "Save",
                            className: 'btn-info',
                            callback: function(){
                                let result = $('#icon-name').val(),
                                    tags = $('#icon-tags input[name=icon-tag]:checked').map(function() {
                                        return parseInt(this.value);
                                    }).get();
                                if(result){
                                    let setData = {
                                        'id': data.id || '',
                                        'type': data.type,
                                        'name': result,
                                        'tags': tags,
                                        'status': 0,
                                        'content': data.content
                                    };
                                    HitabUtil.setRemoteOrLocal('/content/upsert', setData, function(result){
                                        if(result){
                                            setData.id = result.data.id;
                                            that.setDev(setData);
                                            initContent();
                                        }else if(result.message){
                                            bootbox.alert(result.message);
                                        }
                                    });
                                }else{
                                    that.showError('No Name to Upsert');
                                    return false;
                                }
                            }
                        }
                    }
                });
            });
            $('#content-list').on("click", ".content-list-li", function(){
                let id = $(this).data('id');
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
                HitabUtil.getLocalOrRemote('/content/info/' + id, null, function(data){
                    if(data){
                        that.setDev(data);
                        clickListItemCall && clickListItemCall(data);
                    }
                })
            });
            // get content
            initContent();
        },
        initDev: function(type){
            this.dev.type = type;
            let data = localStorage.getItem(this.devType[this.dev.type]);
            if(data){
                this.dev = JSON.parse(data);
            }
            this.setDevIcon();
            return this;
        },
        init: function(callback, devType){
            let that = this;
            // database
            that.db = window.indexedDB.open('hitab',2);
            that.db.onupgradeneeded = function(event) {
                that.db.result.createObjectStore("caches", { keyPath: "uri" });
                that.db.result.createObjectStore("hashes", { keyPath: "uri" });
            };
            that.db.onsuccess = function(event){
                if(!util.user.id){
                    util.getLocalOrRemote('/user/get', null, function(user){
                        if(user){
                            util.user = user;
                        }
                    });
                }
                devType && that.initDev(devType);
                that.initTodo();
                // tags
                if($('#float-icon').length > 0){
                    HitabUtil.getLocalOrRemote('/tag/get/'+that.dev.type, null, function(data){
                        that.tags = data;
                        let dom = $('#search-tag');
                        dom.html('<option value="">None</option>');
                        for(let i in that.tags){
                            dom.append('<option value="'+that.tags[i].id+'">'+that.tags[i].name+'('+that.tags[i].count+')'+'</option>');
                        }
                    });
                }
                // search
                $('#submit-search').submit(function(){
                    let object = that.serializeObject($(this));
                    setTimeout(function(){
                        HitabUtil.getLocalOrRemote('/content/get/'+that.dev.type+'/' + object.tag, {word: object.word}, function(data){
                            that.appendSidebarContent(data);
                        });
                    }, 0);
                    return false;
                });
                $('.auto-submit-search').change(function(){
                    $('#submit-search').submit();
                });
                callback && callback();
            };
            that.db.onerror = function(event){
                bootbox.alert('初始化indexedDb错误！');
            };
            // auto submit
            $('.auto-submit').keypress(function(event){
                if ( event.which == 13 ) {
                    $(this).parents('form').find('.btn-auto-submit').click();
                }
            });
        }
    };
    return util;
}(window, document);
