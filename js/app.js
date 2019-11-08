$(document).ready(function() {
    let nombres = [];
    
    SC.initialize({
        client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
    });

    
    //Creamos un keypress para el buscador.
    $(document).bind('keypress', function(teclado) {
        if(teclado.keyCode==13){ $('#searchSongs').trigger('click');}
    });
    //Creamos la funcion de busqueda para capturar lo que queremos.
    $("#searchSongs").click(function() {
        $("#songList").children().remove();
        let songQ = $("#querySong").val();
        SC.get('/tracks', {
            q: songQ
        })
        .then(function(tracks) {
            nombres = tracks;
            console.log(tracks);
            nombres.forEach( function(data) {
                let player = data.artwork_url;
                if(data.artwork_url === null) player = data.user.avatar_url;
                let persona = '<div class="col5 mb-3 mt-3 d-flex justify-content-center"><img title="'+ data.title +'" id="'+ data.id +'"ondragstart="drag(event)" draggable="true" src="'+ player + '"></img></div>';
                $("#resultado").append(persona);
            })
        });
    });
 });
 let myStream = null;
 //Realizamos el Drag y el Drop.

 function drag(ev){
    ev.dataTransfer.setData("text",ev.target.id);
 }
 function allowDrop(ev){
    ev.preventDefault();
 }
 function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    //console.log(document.getElementById(data));
    ev.target.value = document.getElementById(data).title;
    let query = data;
    $('#sound').toggleClass('pulse');

    myStream = SC.stream('/tracks/'+ query+'');
    myStream.then(function(player){
        player.play().then(function(){
            console.log('reproduciendo');
        }).catch(function(teclado){
            console.error('no funciona.', teclado);
        });
    });

}
//funciones de Play(stream) y Pause
document.getElementById('stream').addEventListener('click', () => {
    myStream.then(player => player.play());
});
document.getElementById('paused').addEventListener('click', () => {
    myStream.then(player => player.pause());
});
