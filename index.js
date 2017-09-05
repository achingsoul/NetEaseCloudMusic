$(function(){
    $.get('./songs.json').then(function(response){
        let items = response
        items.forEach((i)=>{
            let $li = $(`
            <li>
                <a href="./song.html?id=${i.id}">
                    <h3>${i.name}</h3>
                    <p>
                        <svg class="sq">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        演唱者-专辑</p>
                    <svg class="play">
                        <use xlink:href="#icon-play-circled"></use>
                    </svg>
                </a>
            </li>
            `)
            $('#latestMusic').append($li)
        })
        $('#latestMusicLoading').remove()
    },function(){

    })
})