$(function(){
    $.get('/lyric.json').then(function(object){
        let {lyric} = object
        let array = lyric.split('\n')
        let regex = /^\[(.+)\](.*)$/  // 声明一个正则
        array = array.map(function(string, index){
            let matches = string.match(regex) // 匹配数组
            if(matches){
                return {time: matches[1], words: matches[2]}
            }
        })
        let $lyric = $('.lyric')
        array.map(function(object){
            if(!object){return}
            let $p = $('<p/>')
            $p.attr('data-time',object.time).text(object.words)
            $p.appendTo($lyric.children('.lines'))
        })
    })

    let audio = document.createElement('audio')
    audio.src = 'http://osb6hhg60.bkt.clouddn.com/%E6%96%AF%E5%BE%B7%E5%93%A5%E5%B0%94%E6%91%A9%E6%83%85%E4%BA%BA-%E9%99%88%E5%A5%95%E8%BF%85.m4a'
    audio.oncanplay = function(){
        audio.play()
    }
    $('.disc-container').addClass('playing') // 音乐播放时转动碟片
})