$(document).ready(function(){
    HitabUtil.init(function(){
        let editor = new tui.Editor({
            el: document.querySelector('#content'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            initialValue: HitabUtil.dev.content !== '{}' ? HitabUtil.dev.content : '',
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
        editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function(){
            HitabUtil.setDev({content: editor.getMarkdown()});
            if(HitabUtil.dev.id){
                HitabUtil.setRemoteOrLocal('/content/upsert', {
                    'id': HitabUtil.dev.id,
                    'type': HitabUtil.dev.type,
                    'name': HitabUtil.dev.name,
                    'tags': HitabUtil.dev.tags,
                    'status': 0,
                    'content': HitabUtil.dev.content
                }, function(result){

                });
            }
        });
        HitabUtil.sidebar(function(data){
            editor.setValue(data.content !== '{}' ? data.content : '')
        });
    },4);
});