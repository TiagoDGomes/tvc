
var request_dados;
var request_feedback;


function atualiza_lista_geral() {
    if (request_dados.readyState == 4 && request_feedback.readyState == 4) {
        console.log('atualizando...');
        console.log(request_feedback.responseText);
        var lista = JSON.parse(request_dados.responseText);
        var feedback = JSON.parse(request_feedback.responseText);
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
            //var lista_nova = JSON.parse(JSON.stringify(lista[local]['coisas']));
            var lista_velha = lista[local]['coisas'];
            var lista_nova = [];
            var lista_interessados = [];
            var lista_cliques = [];
            
            for (i = 0; i < lista_velha.length; i++) { 
                var feedback_item =  feedback[lista_velha[i]['nome']];
                if (feedback_item != undefined){
                    lista_velha[i]['cliques'] = feedback_item['cliques'];
                    lista_velha[i]['interessados'] = feedback_item['interessados'];                    
                    if (feedback_item['interessados']>0){
                        lista_interessados.unshift(lista_velha[i]);
                    } else{
                        if (feedback_item['cliques']>0){
                            lista_cliques.unshift(lista_velha[i]);
                        } else {
                            lista_nova.push(lista_velha[i]);
                        }
                    }
                } else{
                    console.log('push', lista_velha[i]['nome']);
                    lista_nova.push(lista_velha[i]);
                }
            }
            for (i = 0; i < lista_interessados.length; i++) { 
                lista_nova.push(lista_interessados[i]);
            }

            for (i = 0; i < lista_cliques.length; i++) {                
                lista_nova.unshift(lista_cliques[i]);
            }

            //var lista_nova = lista[local]['coisas'];
            for (i = 0; i < lista_nova.length; i++) {  
                var container = document.createElement('div');   
                container.className = 'produto';       
                var titulo = document.createElement('h2');
                titulo.innerHTML = lista_nova[i]['nome'];
                container.appendChild(titulo);
                var link = document.createElement('a');
                if (lista_nova[i]['nome-original']){
                    link.href = "item_escolhido.html?escolha=" + lista_nova[i]['nome-original'];
                } else {
                    link.href = "item_escolhido.html?escolha=" + lista_nova[i]['nome'];
                }
                link.className = 'imagem';
                var imagem = document.createElement('img');
                if (lista_nova[i]['imagem'] != '' && lista_nova[i]['imagem'] != undefined){
                    imagem.src = lista_nova[i]['imagem'];
                } else {
                    imagem.src = 'img/presente.png';
                    //imagem.style.width = '120px';
                }
                imagem.alt = lista_nova[i]['palavra-chave'];
                link.appendChild(imagem);
                
                var feedback = document.createElement('p');   
                
                feedback.className = 'feedback';             
                
                
                var olho = document.createElement('img');
                
                feedback.appendChild(olho);

                if (lista_nova[i]['cliques'] > 0){
                    olho.src= 'img/feliz.png';
                    txt = document.createTextNode('Pessoas que clicaram para ver: ' + lista_nova[i]['cliques']);
                } else {
                    olho.src= 'img/triste.png';
                    txt = document.createTextNode('Nenhuma pessoa clicou para ver');
                }
                feedback.appendChild(txt);

                var br = document.createElement('br');
                feedback.appendChild(br);

                var joinha = document.createElement('img');   
                joinha.src = 'img/joinha.png';
                feedback.appendChild(joinha);
                if (lista_nova[i]['interessados'] > 0){
                    txt = document.createTextNode('Pessoas que se interessaram em dar esse presente: ' + lista_nova[i]['cliques']);
                    
                } else {
                    txt = document.createTextNode('Ninguém ainda se interessou em dar este presente. Que tal você?');
                }
                feedback.appendChild(txt);
                container.appendChild(link);
                container.appendChild(feedback);
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

function busca_feedback(){    
    console.log('feedback...')
    request_feedback = createRequest();
    var url = "feedback.json?__=" + Math.floor((Math.random() * 100000) + 1);
    request_feedback.open("GET", url, true);
    request_feedback.onreadystatechange = atualiza_lista_geral;
    request_feedback.send(null);
}

function get_conversa_presentes() {
    console.log('Conversa...')
    request_dados = createRequest();
    var url = "https://cors-anywhere.herokuapp.com/http://tvc.rf.gd/presentes.php?__=" + Math.floor((Math.random() * 100000) + 1);
    request_dados.open("GET", url, true);
    request_dados.onreadystatechange = busca_feedback;
    request_dados.send(null);
}