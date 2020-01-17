function initTheme() {
    let link = document.createElement('link'),
        html = document.getElementsByTagName("html")[0],
        dark_mode = 0;
    try{
        let user = JSON.parse(localStorage.getItem('user'));
        dark_mode = user.dark_mode || 0;
    }catch (e) {}
    link.rel='stylesheet';
    if(dark_mode){
        // https://github.com/ForEvolve/bootstrap-dark
        link.href='assets/plugin/bootstrap-dark/bootstrap-dark.min.css';
        document.getElementsByTagName('head')[0].appendChild(link);
        html.style.backgroundColor = "#191d21";
        html.className = 'dark-mode theme-init';
        window.onload = function(){
            html.className = 'dark-mode';
            document.getElementsByTagName("nav")[0].className += ' navbar-dark bg-dark';
            document.getElementsByTagName("body")[0].style.opacity = '1';
        };
    }else{
        link.href='assets/plugin/bootstrap/4.3.1/css/bootstrap.min.css';
        document.getElementsByTagName('head')[0].appendChild(link);
        window.onload = function(){
            if(document.getElementsByTagName("nav")[0].className !== 'active'){
                document.getElementsByTagName("nav")[0].className += ' navbar-light bg-light';
            }
            document.getElementsByTagName("body")[0].style.opacity = '1';
        }
    }
    let style = document.createElement('style');
    style.innerText = '::-webkit-scrollbar{width:8px;height:8px;background-color:rgba(255,255,255,0.6);-webkit-border-radius:100px}::-webkit-scrollbar:hover{background-color:rgba(255,255,255,0.3)}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);-webkit-border-radius:100px}::-webkit-scrollbar-thumb:active{background:rgba(0,0,0,0.61);-webkit-border-radius:100px}::-webkit-scrollbar-thumb:vertical{min-height:10px}::-webkit-scrollbar-thumb:horizontal{min-width:10px}';
    document.head.appendChild(style)
}
initTheme();