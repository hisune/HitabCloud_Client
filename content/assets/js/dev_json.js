$(document).ready(function(){
    HitabUtil.initDev(1);
    function initJson(json) {
        let left = document.getElementById('json-left'), right = document.getElementById('json-right');
        $(left).empty();
        $(right).empty();
        let editor1 = new JSONEditor(left, {
            mode: 'code',
            onChangeText: function (jsonString) {
                editor2.updateText(jsonString);
                json.content = jsonString;
                localStorage.setItem('dev-json', JSON.stringify(json));
            }
        });
        // create editor 2
        let editor2 = new JSONEditor(right, {
            onChangeText: function (jsonString) {
                editor1.updateText(jsonString);
            }
        });
        // set initial data in both editors
        editor1.set(JSON.parse(json.content));
        editor2.set(JSON.parse(json.content));
    }
    initJson(HitabUtil.dev);

    HitabUtil.sidebar(function(data){
        initJson(data);
    });
});