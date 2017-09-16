$(function () {
    $.get('./songs.json').then(function (response) {
        let items = response
        items.forEach((i) => {
            let $li = $(`
            <li>
                <a href="./song.html?id=${i.id}">
                    <h3>${i.name}</h3>
                    <p>
                        <svg class="sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${i.singer}-${i.album}</p>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                </a>
            </li>
            `)
            $('#latestMusic').append($li)
        })
        $('#latestMusicLoading').remove()
    })

    $.get('./hotsongs.json').then(function (response) {
        let items = response
        items.forEach((i) => {
            let $li = $(`<li>
            <div class="rank">${i.id}</div>
                <a href="./song.html?id=${i.id}">
                    <h3>${i.name}</h3>
                    <p>
                        <svg class="sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${i.singer}-${i.album}</p>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                </a>
            </li>`)
            $('#hottestSong').append($li)
        })
        $('#hottestMusicLoading').remove()
    })

    


    $('.siteNav').on('click', 'ol.tabItems>li', function (e) {
        let $li = $(e.currentTarget).addClass('active')
        $li.siblings().removeClass('active')
        let index = $li.index()
        $li.trigger('tabChange', index)
        $('.tabContent > li').eq(index).addClass('active').siblings().removeClass('active')
    })

    $('.siteNav').on('tabChange', function (e, index) {
        let $li = $('.tabContent > li').eq(index)
        if ($li.attr('data-downloaded') === 'yes') {
            return
        }
        else if (index === 2) {
            return
            $.get('./page3.json').then((response) => {
                $li.text(response.content)
                $li.attr('data-downloaded', 'yes')
            })
        }
    })

    let timer = undefined
    $('input#searchSong').on('input', function (e) {
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if (value === '') { return }

        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(function () {
            search(value).then((result) => {
                timer = undefined
                if (result.length !== 0) {
                    $('#output').text(result.map((r => r.name)).join(','))
                } else {
                    $('#output').text('没有结果')
                }
            })
        }, 300) // 设置定时器 等待用户输入


    })

    function search(keyword) {
        console.log('搜索' + keyword)
        return new Promise((resolve, reject) => {
            var database = [
                { "id": 1, "name": "斯德哥尔摩情人", },
                { "id": 2, "name": "知音难觅", },
                { "id": 3, "name": "全世界谁倾听你", },
                { "id": 4, "name": "I Am Me Once More", },
                { "id": 5, "name": "心臓を捧げよ! (TV Size)", },
                { "id": 6, "name": "你瞒我瞒", },
                { "id": 7, "name": "Mad World", },
                { "id": 8, "name": "别找我麻烦", },
                { "id": 9, "name": "The Winding Path", },
                { "id": 10, "name": "神经病之歌", }
            ]
            let result = database.filter(function (item) {
                return item.name.indexOf(keyword) >= 0
            }) // 如果 name 里含有该字符串，就找到这些数组并返回
            setTimeout(function () {
                console.log('搜到' + keyword + '的结果')
                resolve(result)
            }, (Math.random() * 200 + 500))
        })
    }
    window.search = search
})

