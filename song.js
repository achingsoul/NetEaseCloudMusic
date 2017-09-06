$(function () {

    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1], 10)

    // 歌曲切换
    $.get('./songs.json').then(function (response) {
        let songs = response
        let song = songs.filter((s) =>s.id === id)[0]
        let { url, name, lyric } = song

        initPlayer.call(undefined,  url) 
        initText(name, lyric)
    })

    function initText(name, lyric){
        $('.song-description > h1').text(name)
        parseLyric(lyric)
    }

    function initPlayer(url){
        let audio = document.createElement('audio')
        audio.src = url 
        audio.oncanplay = function () {
            audio.play()
            $('.disc-container').addClass('playing') // 音乐播放时转动碟片
        }
        $('.icon-pause').on('click', function () {
            audio.pause()
            $('.disc-container').removeClass('playing')
        })
        $('.icon-play').on('click', function () {
            audio.play()
            $('.disc-container').addClass('playing')
        })
    }

    

    function parseLyric(lyric){
        let array = lyric.split('\n')
        let regex = /^\[(.+)\](.*)$/  // 声明一个正则
        array = array.map(function (string, index) {
            let matches = string.match(regex) // 匹配数组
            if (matches) {
                return { time: matches[1], words: matches[2] }
            }
        })
        let $lyric = $('.lyric')
        array.map(function (object) {
            if (!object) { return }
            let $p = $('<p/>')
            $p.attr('data-time', object.time).text(object.words)
            $p.appendTo($lyric.children('.lines'))
        })
    }

})