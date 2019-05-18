
function createRequest() {
    var request;
    try {
        request = new XMLHttpRequest();
    } catch (trymicrosoft) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (othermicrosoft) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                request = null;
            }
        }
    }
    return request;
    if (request == null)
        console.log("Error creating request object!");
}


function busca_feedback(){    
    console.log('feedback...')
    request_feedback = createRequest();
    var url = URL_SAVE + "feedback.json?__=" + Math.floor((Math.random() * 100000) + 1);
    request_feedback.open("GET", url, true);
    request_feedback.onreadystatechange = atualiza_lista_geral;
    request_feedback.send(null);
}

function get_conversa_presentes() {
    console.log('Conversa...')
    request_dados = createRequest();
    var url = "https://api.myjson.com/bins/1fz7py?__=" + Math.floor((Math.random() * 100000) + 1);
    request_dados.open("GET", url, true);
    request_dados.onreadystatechange = busca_feedback;
    request_dados.send(null);
}