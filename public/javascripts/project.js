$(document).ready(function(){
    $.getJSON('/flight/fetch_all_cities',function(city_data){
        city_data.data.map((item) => {
            $('#flightsource').append($('<option>').text(item.cityname).val(item.cityid));
            $('#flightdestination').append($('<option>').text(item.cityname).val(item.cityid));
        })
    })

    $('#flightsource').change(function () {
        $('#terminalsource').empty();
        $('#terminalsource').append($('<option>').text('Source Terminal'));
        $.getJSON('/flight/fetch_all_terminals',{cityid:$('#flightsource').val()},function(terminal_data){
            terminal_data.data.map((item) => {
                $('#terminalsource').append($('<option>').text(item.terminalname).val(item.terminalid));
            })
        })
    })

    $('#flightdestination').change(function () {
        if ($('#flightsource').val()==$('#flightdestination').val()) {
            {alert('Source and Destination Not Be Same')}
        }
        else {
        $('#terminaldestination').empty();
        $('#terminaldestination').append($('<option>').text('Destination Terminal'));
        $.getJSON('/flight/fetch_all_terminals',{cityid:$('#flightdestination').val()},function(terminal_data){
            terminal_data.data.map((item) => {
                $('#terminaldestination').append($('<option>').text(item.terminalname).val(item.terminalid));
            })
        })
             }
    })

})

function showPicture() {
    const selecetfile = clogo.files[0]
    cpic.src= URL.createObjectURL(selecetfile)
}

function showPicture2() {
    const selecetfile = clogo.files[0]
    cpic.src= URL.createObjectURL(selecetfile)
}