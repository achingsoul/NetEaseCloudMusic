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
    audio.src = '//dl.stream.qqmusic.qq.com/C400003TgAeV2YzOCj.m4a?vkey=D369B9844412360E5CC37CAA570BD18D428B6C5F234A3E7EB4E406847092FCEB8E0A13AAAA7EF3C4EA8111AFB6D3EC6B9A2C7A2C3B1A72DF&guid=5946636130&uin=345004536&fromtag=66'
    audio.oncanplay = function(){
        audio.play()
        $('.disc-container').addClass('playing') // 音乐播放时转动碟片
    }
    $('.icon-pause').on('click', function(){
        audio.pause()
        $('.disc-container').removeClass('playing') 
    })
    $('.icon-play').on('click', function(){
        audio.play()
        $('.disc-container').addClass('playing')
    })
})