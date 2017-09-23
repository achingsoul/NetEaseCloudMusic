$(function () {

    // tab切换
    $('.siteNav').on('click', 'ol.tabItems>li', function (e) {
        let $li = $(e.currentTarget).addClass('active')
        $li.siblings().removeClass('active')
        let index = $li.index()
        $li.trigger('tabChange', index)
        $('.tabContent > li').eq(index).addClass('active').siblings().removeClass('active')
    })

    let $searchForm = $('.searchForm'),
        $searchInput = $('.searchForm input'),
        $searchInputCloseBtn = $('.searchForm .inputClose'),
        $searchDefault = $('.searchDefault'),
        $searchRecom = $('.searchRecom'),
        $searchResult = $('.searchResult'),
        songList, SearchInputTimer


    getLatestMusic()
    getSongList()
    getHotList()
    bindSearchTab()
    buildHistory()

    // 获取全局歌曲，用于搜索匹配
    function getSongList() {
        $.get('./song_list.json').then(function (response) {
            songList = response
        })
    }

    // 搜索组件事件绑定
    function bindSearchTab() {
        $searchForm.on('submit', function (e) {
            let value = $searchInput.val()
            e.preventDefault();
            showSearchResult(value)
            saveSearchHistory(value)
        })
        // 搜索输入框关闭按钮
        $searchInputCloseBtn.on('click', function (e) {
            $searchInput.val("")
            $searchInputCloseBtn.removeClass('active')
            $searchResult.find('ol.resultList').empty()
            show$searchDefault()
            clearTimeout(SearchInputTimer)
            buildHistory()
        })
        // 搜索建议 按钮
        $searchRecom.find('.sr-input-btn').on('click', function () {
            let value = $searchInput.val()
            showSearchResult(value)
            saveSearchHistory(value)
            buildHistory()
        })
        // 搜索输入框数值变化监听
        $searchInput.on('input change', function (e) {
            let value = $(this).val()
            if (value) {
                $searchInputCloseBtn.addClass('active')
                $searchRecom.addClass('active').find('.sr-input-btn').text(`搜索 “${value}”`)
                show$searchRecom()
                clearTimeout(SearchInputTimer)
                SearchInputTimer = setTimeout(function () {
                    matchResult(value)
                }, 600)
            } else {
                $searchResult.find('ol.resultList').empty()
                clearTimeout(SearchInputTimer)
                show$searchDefault()
            }
        })
        // 搜索历史按钮 事件委托
        $('.hotSearch').on('click', 'li', function () {
            let value = $(this).text()
            $searchInput.val(value)
            $searchInputCloseBtn.addClass('active')
            showSearchResult(value)
            saveSearchHistory(value)
        })
        $('.searchHistory .searchList')
            .on('click', '.item', function () {
                console.log('click')
                let value = $(this).find('p').text()
                showSearchResult(value)
                $searchInput.val(value)
                $searchInputCloseBtn.addClass('active')
            })
            .on('click', '.historyClose', function (e) {
                deleteSearchHistory($(this).siblings('p').text())
                buildHistory()
                e.stopPropagation()
            })
    }

    // 展示结果
    function showSearchResult(value) {
        let val = value ? value : undefined
        show$searchResult()
        let result = matchResult(value)
        if (result.length == 0) {
            let li = `<div class="noResult">暂无搜索结果</div>`
            $searchResult.find('ol.resultList').empty().append(li)
        } else {
            result.forEach(function (element) {
                appendList($searchResult.find('ol.resultList'), element, false)

            })
        }
    }



    // 根据song_list.json 匹配是否存在这首歌
    function matchResult(value) {
        let result = []
        if (value) {
            let regex = new RegExp(value)
            result = songList.filter(function (item) {
                return regex.test(item.id) || regex.test(item.album) || regex.test(item.name)
            })
        }
        return result
    }

    // 搜索：默认/推荐/结果 显示控制
    function show$searchRecom() {
        $searchDefault.removeClass('active')
        $searchRecom.addClass('active')
        $searchResult.removeClass('active')
    }
    function show$searchDefault() {
        $searchDefault.addClass('active')
        $searchRecom.removeClass('active')
        $searchResult.removeClass('active')
    }
    function show$searchResult() {
        $searchDefault.removeClass('active')
        $searchRecom.removeClass('active')
        $searchResult.addClass('active')
    }

    // 搜索历史组件
    function saveSearchHistory(value) {
        let history = localStorage.getItem('search-history')
        let array = history ? JSON.parse(history) : []
        array.indexOf(value) === -1 && array.push(value)
        localStorage.setItem('search-history', JSON.stringify(array))
    }
    function deleteSearchHistory(value) {
        let history = localStorage.getItem('search-history')
        let array = history ? JSON.parse(history) : []
        array = array.filter(function (item) {
            return value !== item
        })
        localStorage.setItem('search-history', JSON.stringify(array))
    }

    // 构建历史记录
    function buildHistory() {
        let $searchList = $('.searchHistory .searchList')
        $searchList.empty()
        let history = JSON.parse(localStorage.getItem('search-history'))
        history.forEach((i) => {
            let $li = $(`<li class="item"> <figure> <svg class="icon"> <use xlink:href="#icon-clock"></use> </svg> </figure> <p>${i}</p> <figure class="historyClose"> <svg class="icon"> <use xlink:href="#icon-close1"></use> </svg> </figure> </li>`)
            $searchList.append($li)
        })
    }


    // 最新音乐
    function getLatestMusic() {
        $.get('./songs.json').then(function (response) {
            let $ol = $(".latestMusic>ol#latestMusic")
            let hasRank = false
            response.forEach(function (element) {
                appendList($ol, element, hasRank)
            });
            $ol.siblings("#latestMusicLoading").remove()

        })
    }

    // 热歌榜
    function getHotList() {
        $.get('./hotsongs.json').then(function (response) {
            let $ol = $(".hottestMusic>ol#hottestSong")
            let hasRank = true
            response.forEach(function (element) {
                appendList($ol, element, hasRank)
            });
            $ol.siblings("#hottestMusicLoading").remove()
        })
    }

    // 插入统一歌曲列表
    function appendList($ol, element, hasRank) {
        let [id, name, singer, album] = [element.id, element.name, element.singer, element.album]
        let li
        if (hasRank) {
            let rank = (id > 9) ? id : `0${id}`
            let top = id > 3 ? "" : "top"
            li = `
               <li>
            <div class="rank  ${top}">${rank}</div>
                <a href="./song.html?id=${id}">
                    <h3>${name}</h3>
                    <p>
                        <svg class="sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${singer}-${album}</p>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                </a>
            </li>
            `
        } else {
            li = `
                <li>
                <a href="./song.html?id=${id}">
                    <h3>${name}</h3>
                    <p>
                        <svg class="sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${singer}-${album}</p>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                </a>
            </li>
            `
        }
        $ol.append(li)
    }

})

