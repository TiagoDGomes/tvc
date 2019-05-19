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
                } /**/
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

                if (lista_nova[i]['cliques'] > 0 && !lista_nova[i]['interessados']) {
                    var cc = document.createElement('div');
                    cc.className = 'olhada';
                    var olho = document.createElement('img');
                    cc.appendChild(olho);
                    if (lista_nova[i]['cliques'] > 0) {
                        olho.src = 'img/eyeglasses.png';
                        txt = document.createTextNode(lista_nova[i]['cliques']);
                    } else {
                        olho.src = 'img/eyeglasses.png';
                        txt = document.createTextNode('Nenhuma pessoa foi ver este presente nas lojas');
                    }
                    cc.appendChild(txt)
                    feedback.appendChild(cc);

                    var br = document.createElement('br');
                    feedback.appendChild(br);
                }
                var joinha = document.createElement('img');
                joinha.src = 'img/joinha.png';
                feedback.appendChild(joinha);
                if (lista_nova[i]['interessados'] > 0) {
                    txt_ = document.createTextNode('Pessoas que se interessaram em dar esse presente: ' + lista_nova[i]['interessados'] + '');
                    txt = document.createElement('strong');
                    txt.appendChild(txt_);
                    imagem.src = 'img/presente_rodando.gif';
                    container.className += ' interessado';
                    imagem_yoshi = document.createElement('img');
                    imagem_yoshi.src = "img/yoshi_animado.gif";
                    link.appendChild(imagem_yoshi);
                    joinha.src = 'img/shopping_cart_full.png';
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
        var msg;
        if (lista_nova[item]['interessados'] > 0){
            msg = 'Opa, acho que alguém já escolheu esse, mas se você quiser dar também este presente, tá legal! <br>Para facilitar, estes são alguns sites que vão direto para a busca desse presente.';
        } else {
            msg = 'Legal, e para facilitar, estes são alguns sites que vão direto para a busca desse presente.';
        }
        texto.innerHTML = msg + '<br>Não precisa ser nestes sites, mas caso escolha em algum deles, não se esqueça de voltar aqui para nos avisar :)<br>' +
            '<a target="_blank" class="loja" href="https://www.buscape.com.br/search/' + palavra_chave + '"><img src="https://imagebuscape-a.akamaihd.net/material/logo-buscape.svg" alt="Buscapé"></a><br>' +
            '<a target="_blank" class="loja" href="https://buscas2.casasbahia.com.br/busca?q=' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo903294.gif" alt="Casas Bahia"></a>' +
            '<a target="_blank" class="loja" href="https://www.americanas.com.br/busca/?rc=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo81.gif" alt="Americanas"></a>' +
            '<a target="_blank" class="loja" href="https://search3.pontofrio.com.br/busca?q=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo114286.gif" alt="Ponto Frio"></a>' +
            '<a target="_blank" class="loja" href="https://www.carrefour.com.br/busca/?termo=' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo1154910.gif" alt="Carrefour"></a>' +
            '<a target="_blank" class="loja" href="https://www.shoptime.com.br/busca/?rc=' + palavra_chave.replace(' ', '-') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo125.gif" alt="Shop Time"></a>' +
            '<a target="_blank" class="loja" href="https://www.magazineluiza.com.br/busca/' + palavra_chave + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo79.gif" alt="Magazine Luiza"></a>' +
            '<a target="_blank" class="loja" href="https://www.pernambucanas.com.br/catalogsearch/result/?q=' + palavra_chave.replace(' ', '+') + '"><img src="https://www.pernambucanas.com.br/static/version1557978721/frontend/Innersite/pernambucanas/pt_BR/images/logo_pernambucanas.svg" alt="Pernambucanas"></a>' +
            '<a target="_blank" class="loja" href="https://www.fastshop.com.br/web/s/' + palavra_chave + '"><img src="data:image/png;base64,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" alt="Fast Shop"></a>' +
            '<a target="_blank" class="loja" href="https://www.amazon.com.br/s?k=' + palavra_chave.replace(' ', '+') + '"><img src="https://imagembuscapebr-a.akamaihd.net/vitrine/logo1161136.gif" alt="Amazon"></a>' +
            '<a target="_blank" class="loja" href="https://www.lojascem.com.br/site/encontre-a-loja-mais-proxima/"><img src="data:image/jpeg;base64,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" alt="Lojas CEM"></a>' +

            ' <br>';

        div_expandido.appendChild(texto);

        texto = document.createElement('p');
        texto.innerHTML = 'E aí? Você vai comprar pra gente? <img src="img/feliz.png" style="width: 24px; height: 24px"><br><strong style="text-transform: uppercase">' + lista_nova[item]['nome'] + '</strong>';
        div_expandido.appendChild(texto);

        var botao_sim = document.createElement('button');
        botao_sim.innerHTML = 'Sim';
        botao_sim.onclick = function () {
            var c = document.createElement('div');
            c.innerHTML = '<h4>Oba!</h4><p><span class="texto_hello">Vamos lá! Insira o código que os noivos te entregaram:</span><br><input maxlength="4" class="codigo_convidado" type="text" name="codigo" value="' + getCookie('codigo') +'">';
            c.innerHTML += '<br>E é só confirmar:';
            c.innerHTML += '<br><button onclick="interessado(\'\',' + item + ', document.getElementsByClassName(\'codigo_convidado\')[0].value)">Sim, eu vou dar ' + lista_nova[item]['nome'].toUpperCase() + '</button>';
            c.innerHTML += '<br><button onclick="modal.style.display = \'none\';">Espere, acho que não é isso</button>';
            
            
            wa_show_modal(c);
            var codigo_convidado = document.getElementsByClassName('codigo_convidado')[0].focus();
        }
        div_expandido.appendChild(botao_sim)
        var botao_nao = document.createElement('button');
        botao_nao.innerHTML = 'Não';
        botao_nao.onclick = function () {
            ocultar_item(item);
        }
        div_expandido.appendChild(botao_nao)
        presente_container.appendChild(div_expandido);
        $('#presente_' + item + ' .clicado a').click(function () {
            clicado(local, item, this.href);
        })
        
    }



}

function clicado(secao, item, url){  
    console.log('Clicado ' + secao + ' ' +  lista_nova[item]['nome'] + ' ' + url);    
    var url = "https://sbv.ifsp.edu.br/proxy/tvc/clique.php?nome=" + lista_nova[item]['nome'] + "&__=" + Math.floor((Math.random() * 100000) + 1);    
    $.ajax({
        url: url,
        type: "GET",
        success: function(data, textStatus, jqXHR){    
        }
    });     
}

function interessado(secao, item, codigo){
    console.log('Clicado ' + secao + ' ' +  lista_nova[item]['nome'] + ' ' + url);    
    var url = "https://sbv.ifsp.edu.br/proxy/tvc/interessado.php?nome=" + lista_nova[item]['nome'] + "&__=" + Math.floor((Math.random() * 100000) + 1) + '&codigo=' + codigo.toUpperCase();  
    setCookie('codigo_digitado', codigo.toUpperCase(), 360);  
    $.ajax({
        url: url,
        type: "GET",
        success: function(data, textStatus, jqXHR){  
            if (data.erro == 0){
                setCookie('codigo', getCookie('codigo_digitado'), 360);
                alert('Muito obrigado. A gente registrou sua ação. Esperamos você no casamento!');
                window.location = './';
            }  else {
                $('.texto_hello').html('Oops! ' + data.msg + ' Digite novamente o código enviado pelos noivos:');
                $('.texto_hello').addClass('erro');
                var codigo_convidado = document.getElementsByClassName('codigo_convidado')[0];
                codigo_convidado.focus();
                codigo_convidado.setSelectionRange(0, codigo_convidado.value.length);
                codigo_convidado.onkeydown = (function(ev){
                    $('.texto_hello').removeClass('erro');
                });
            }
        }
    });   
}