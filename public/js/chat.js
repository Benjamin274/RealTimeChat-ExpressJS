$('#nickname-input').on('onkeypress',function(e){
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
        $('#myModal').style.display = "none";
    }
})
