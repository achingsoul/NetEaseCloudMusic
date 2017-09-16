$(function () {

    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1], 10)

    // 歌曲切换
    $.get('./song_list.json').then(function (response) {
        let songs = response
        let song = songs.filter((s) => s.id === id)[0]
        let { url, coverUrl, coverBlurUrl, name, singer, lyric } = song

        initPlayer.call(undefined, url)
        initText(name, singer, lyric)
        initPicture(coverUrl, coverBlurUrl)
    })

    // 歌曲背景&专辑封面
    function initPicture(coverUrl, coverBlurUrl) {
        $('.page').css("background", `url(${coverBlurUrl})`)
        $('.page').css("background-size", `cover`)
        $('.page').css("background-position", `center`)
        $('.cover').find('img').attr("src", coverUrl)
    }

    // 歌名歌手歌词
    function initText(name, singer, lyric) {
        $('.song-description .song-name').text(name)
        $('.song-description .song-gap').text("-")
        $('.song-description .singer').text(singer)
        parseLyric(lyric)
    }

    // 播放器
    function initPlayer(url) {
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
        setInterval(() => {
            let seconds = audio.currentTime
            let munites = ~~(seconds / 60)
            let left = seconds - munites * 60
            let time = `${pad(munites)}:${pad(left)}`
            let $lines = $('.lines > p')
            let $whichLine
            for (let i = 0; i < $lines.length; i++) {
                let currentLineTime = $lines.eq(i).attr('data-time')
                let nextLineTime = $lines.eq(i + 1).attr('data-time')
                if ($lines.eq(i + 1).length !== 0 && currentLineTime < time && nextLineTime > time) {
                    $whichLine = $lines.eq(i)
                    break
                }
            }
            if ($whichLine) {
                $whichLine.addClass('active').prev().removeClass('active')
                let top = $whichLine.offset().top
                let linesTop = $('.lines').offset().top
                let delta = top - linesTop - $('.lyric').height() / 3
                $('.lines').css('transform', `translateY(-${delta}px)`)
            }
        }, 200)
    }

    function pad(number) {
        return number >= 10 ? number + '' : '0' + number
    }

    function parseLyric(lyric) {
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