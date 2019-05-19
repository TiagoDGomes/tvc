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


function busca_feedback() {
    console.log('feedback...')
    request_feedback = createRequest();
    var url = "https://sbv.ifsp.edu.br/proxy/tvc/feedback.php?__=" + Math.floor((Math.random() * 100000) + 1);
    request_feedback.open("GET", url, true);
    request_feedback.onreadystatechange = atualiza_lista_geral;
    request_feedback.send(null);
}

function get_conversa_presentes() {
    console.log('Conversa...')
    request_dados = createRequest();
    var url = "conversa_presentes.json?__=" + Math.floor((Math.random() * 100000) + 1);
    request_dados.open("GET", url, true);
    request_dados.onreadystatechange = busca_feedback;
    request_dados.send(null);
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}


function atualizar_presente(codigo) {
    if (!codigo){
        codigo = getCookie('codigo').toUpperCase();
    }
    $.ajax({
        url: 'https://sbv.ifsp.edu.br/proxy/tvc/presente.php?codigo=' + codigo,        
        success: function (data) {
            if ('nome' in data) {
                $('.obrigado').html('Obrigado pelo presente: ' + data.nome);
                setCookie('presente', data.nome, 360);
            } else {
                setCookie('presente', null, 360)
            }
        }
    })
}