var request_dados;
var request_feedback;

var lista_nova = [];
var local;

function atualiza_lista_geral() {
    if (request_dados.readyState == 4 && request_feedback.readyState == 4) {
        console.log('atualizando...');
        var lista = JSON.parse(request_dados.responseText);
        var feedback = JSON.parse(request_feedback.responseText);
        var url_string = window.location.href;
        var url = new URL(url_string);
        local = url.searchParams.get("local");
        conversa_lista.innerHTML = '';

        var mensagem_inicial = lista[local]['mensagem_inicial'];
        if (mensagem_inicial != undefined && mensagem_inicial != '') {
            escrever_mensagem(mensagem_inicial);
        }
        escrever_mensagem('Clique em qualquer um dos presentes para abrir as opções.')
        lista_nova = [];
        if (lista[local]['coisas'] != undefined && lista[local]['coisas'].length > 0) {
            //var lista_nova = JSON.parse(JSON.stringify(lista[local]['coisas']));
            var lista_velha = lista[local]['coisas'];

            var lista_interessados = [];
            var lista_cliques = [];

            for (i = 0; i < lista_velha.length; i++) {

                var feedback_item = feedback[lista_velha[i]['nome']];
                if (feedback_item != undefined) {

                    lista_velha[i]['cliques'] = feedback_item['cliques'];
                    lista_velha[i]['interessados'] = feedback_item['interessados'];
                    if (feedback_item['interessados'] > 0) {
                        lista_interessados.unshift(lista_velha[i]);
                    } else {
                        if (feedback_item['cliques'] > 0) {
                            lista_cliques.unshift(lista_velha[i]);
                        } else {
                            lista_nova.push(lista_velha[i]);
                        }
                    }
                } else {
                    console.log('push', lista_velha[i]['nome']);
                    lista_nova.push(lista_velha[i]);
                }/**/
                /*if (lista_velha[i]['cliques'] != undefined) {
                    lista_cliques.unshift(lista_velha[i]);
                } else if (lista_velha[i]['interessados'] != undefined) {
                    lista_interessados.unshift(lista_velha[i]);
                } else {
                    lista_nova.push(lista_velha[i]);
                }*/
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
                container.id = 'presente_' + i;
                var titulo = document.createElement('h2');
                titulo.innerHTML = lista_nova[i]['nome'];
                container.appendChild(titulo);
                var link = document.createElement('a');
                var nome;
                if (lista_nova[i]['nome-original']) {
                    nome = lista_nova[i]['nome-original'];
                } else {
                    nome = lista_nova[i]['nome'];
                }
                //link.href = "item_escolhido.html?escolha=" + nome;
                link.href = "javascript:mostrar_item(" + i + ");";
                link.className = 'imagem link_para_abrir';

                var imagem = document.createElement('img');
                imagem.src = 'img/presente.png';
                imagem.alt = lista_nova[i]['palavra_chave'];

                link.appendChild(imagem);
                var presente_aberto = document.createElement('img');
                presente_aberto.src = 'img/presente_aberto.png';
                var link_para_fechar = document.createElement('a');
                link_para_fechar.href = "javascript:ocultar_item(" + i + ");"
                link_para_fechar.style.display = 'none';
                link_para_fechar.className = 'imagem link_para_fechar';

                link_para_fechar.appendChild(presente_aberto);


                var feedback = document.createElement('p');

                feedback.className = 'feedback';


                var olho = document.createElement('img');

                feedback.appendChild(olho);

                if (lista_nova[i]['cliques'] > 0) {
                    olho.src = 'img/feliz.png';
                    txt = document.createTextNode('Pessoas que clicaram para ver: ' + lista_nova[i]['cliques']);
                } else {
                    olho.src = 'img/triste.png';
                    txt = document.createTextNode('Nenhuma pessoa clicou para ver');
                }
                feedback.appendChild(txt);

                var br = document.createElement('br');
                feedback.appendChild(br);

                var joinha = document.createElement('img');
                joinha.src = 'img/joinha.png';
                feedback.appendChild(joinha);
                if (lista_nova[i]['interessados'] > 0) {
                    txt = document.createTextNode('Pessoas que se interessaram em dar esse presente: ' + lista_nova[i]['interessados']);

                } else {
                    txt = document.createTextNode('Ninguém ainda se interessou em dar este presente. Que tal você?');
                }
                feedback.appendChild(txt);
                container.appendChild(feedback);
                container.appendChild(link);
                container.appendChild(link_para_fechar);
                escrever_mensagem_complexa(container);

            }
        } else {
            escrever_mensagem('???');
            escrever_mensagem('Acho que esqueci de algo...');
            escrever_mensagem('Ah, lembrei');
            escrever_mensagem('Não preparei a lista... sou muito burro');
        }

        var mensagem_final = lista[local]['mensagem_final'];
        if (mensagem_final != undefined && mensagem_final != '') {
            escrever_mensagem(mensagem_final);
        }

        pipocar_conversa(local);
    }
}


function ocultar_item(item) {
    var presente_container = document.getElementById('presente_' + item);
    presente_container.getElementsByClassName('clicado')[0].style.display = 'none';
    presente_container.getElementsByClassName('link_para_abrir')[0].style.display = 'inherit';
    presente_container.getElementsByClassName('link_para_fechar')[0].style.display = 'none';
}

function mostrar_item(item) {
    var presente_container = document.getElementById('presente_' + item);
    presente_container.getElementsByClassName('link_para_abrir')[0].style.display = 'none';
    presente_container.getElementsByClassName('link_para_fechar')[0].style.display = 'inherit';
    if (presente_container.getElementsByClassName('clicado').length > 0) {
        presente_container.getElementsByClassName('clicado')[0].style.display = 'inherit';
    } else {

        var div_expandido = document.createElement('div');
        div_expandido.className = 'clicado';

        var texto = document.createElement('p');
        texto.className = 'texto_lojas';
        var palavra_chave;
        if (lista_nova[item]['palavra_chave']) {
            palavra_chave = lista_nova[item]['palavra_chave'];
        } else {
            palavra_chave = lista_nova[item]['nome'];
        }

        texto.innerHTML = 'Legal, e para facilitar, estas são alguns sites que vão direto para a busca desse presente:<br>Não precisa ser nestes sites, mas caso escolha em algum deles, não se esqueça de voltar aqui para nos avisar :).<br>' +
            '<a target="_blank" class="loja" href="https://www.buscape.com.br/search/' + palavra_chave + '"><img src="https://imagebuscape-a.akamaihd.net/material/logo-buscape.svg" alt="Buscapé"></a>' +
            '<a target="_blank" class="loja" href="https://buscas2.casasbahia.com.br/busca?q=' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo903294.gif" alt="Casas Bahia"></a>' +
            '<a target="_blank" class="loja" href="https://www.americanas.com.br/busca/?rc=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo81.gif" alt="Americanas"></a>' +
            '<a target="_blank" class="loja" href="https://search3.pontofrio.com.br/busca?q=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo114286.gif" alt="Ponto Frio"></a>' +
            '<a target="_blank" class="loja" href="https://www.carrefour.com.br/busca/?termo=' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo1154910.gif" alt="Carrefour"></a>' +
            '<a target="_blank" class="loja" href="https://www.shoptime.com.br/busca/?rc=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo125.gif" alt="Shop Time"></a>' +
            '<a target="_blank" class="loja" href="https://www.magazineluiza.com.br/busca/' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo79.gif" alt="Magazine Luiza"></a>' +
            '<a target="_blank" class="loja" href="https://www.pernambucanas.com.br/catalogsearch/result/?q=' + palavra_chave.replace(' ', '+') + '"><img src="https://www.pernambucanas.com.br/static/version1557978721/frontend/Innersite/pernambucanas/pt_BR/images/logo_pernambucanas.svg" alt="Pernambucanas"></a>' +

            ' <br>';

        div_expandido.appendChild(texto);

        texto = document.createElement('p');
        texto.innerHTML = 'E aí? Você vai comprar pra gente? <img src="img/feliz.png" style="width: 24px; height: 24px"><br><strong style="text-transform: uppercase">' + lista_nova[item]['nome'] + '</strong>';
        div_expandido.appendChild(texto);

        var botao_sim = document.createElement('button');
        botao_sim.innerHTML = 'Sim';
        botao_sim.onclick = function () {
            wa_show_modal(item);
        }
        div_expandido.appendChild(botao_sim)
        var botao_nao = document.createElement('button');
        botao_nao.innerHTML = 'Não';
        botao_nao.onclick = function () {
            ocultar_item(item);
        }
        div_expandido.appendChild(botao_nao)
        presente_container.appendChild(div_expandido);
        jQuery('#presente_' + item +  ' .clicado a').click(function(){
            clicado(local, item, this.href);
        })
    }

}