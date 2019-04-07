var request = null;

function createRequest() {
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

    if (request == null)
        console.log("Error creating request object!");
}

function atualiza_lista_geral() {
    if (request.readyState == 4) {
        var lista = JSON.parse(request.responseText);
        var url_string = window.location.href;
        var url = new URL(url_string);
        var local = url.searchParams.get("local");
        console.log(lista);
        conversa_lista.innerHTML = '';

        var mensagem_inicial = lista[local]['mensagem_inicial'];
        if (mensagem_inicial != undefined && mensagem_inicial != ''){
            escrever_mensagem(mensagem_inicial);
        }
        
        if (lista[local]['coisas'] != undefined && lista[local]['coisas'].length > 0){
            for (i = 0; i < lista[local]['coisas'].length; i++) {  
                var container = document.createElement('div');   
                container.className = 'produto';       
                var titulo = document.createElement('h2');
                titulo.innerHTML = lista[local]['coisas'][i]['nome'];
                container.appendChild(titulo);
                var link = document.createElement('a');
                link.href = "lista_escolhido.html?escolha=" + lista[local]['coisas'][i]['nome'];
                link.className = 'imagem';
                var imagem = document.createElement('img');
                if (lista[local]['coisas'][i]['imagem'] != '' && lista[local]['coisas'][i]['imagem'] != undefined){
                    imagem.src = lista[local]['coisas'][i]['imagem'];
                } else {
                    imagem.src = 'img/presente.png';
                    imagem.style.width = '120px';
                }
                imagem.alt = lista[local]['coisas'][i]['palavra-chave'];
                link.appendChild(imagem);


                container.appendChild(link);
                escrever_mensagem_complexa(container);
                
            }
        } else {
            escrever_mensagem('???');
            escrever_mensagem('Acho que esqueci de algo...');
            escrever_mensagem('Ah, lembrei');            
            escrever_mensagem('Não preparei a lista... sou muito burro');
        }        

        var mensagem_final = lista[local]['mensagem_final'];
        if (mensagem_final != undefined && mensagem_final != ''){
            escrever_mensagem(mensagem_final);
        }
        
        pipocar_conversa(local);
    }
}

function get_conversa_presentes(func_atualizar) {
    createRequest();
    var url = "conversa_presentes.json?__=" + Math.floor((Math.random() * 100000) + 1);
    request.open("GET", url, true);
    request.onreadystatechange = func_atualizar;
    request.send(null);
}