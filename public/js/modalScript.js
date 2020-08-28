$( document ).ready(function() {
console.log('Come on now! :>> ');
})

$('#nickname-input').keypress(function(e) {
    // console.log('object :>> ',e.target.value);
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
        $('#myModal').css("display","none");
    }

})