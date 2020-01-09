setTimeout(function(){
    try{
        let selTemp = document.getElementById('txt-temperature'),
            selWeather = document.getElementById('txt-name'),
            selP = document.querySelectorAll('.local-box .local-news'),
            special = selP.length > 0 ? selP[0].innerText : '',
            height = document.body.scrollHeight,
            text;
        try{
            text = selTemp.innerText + '' + selWeather.innerText;
        }catch (e) {}
        window.parent.postMessage({
            call:'setWeather',
            value:{
                normal: text,
                height: height,
                special: special.trim()
            }
        },'*');
    }catch (e) {

    }
}, 2000);
