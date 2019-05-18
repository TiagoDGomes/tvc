var conversa = document.getElementsByClassName('conversa');
var conversa_i = 0;
var lista_pipocada;

function pipocar_conversa(local_atual, force) {
    console.log('force 1:', force)
    if (force == undefined) {
        try {
            lista_pipocada = localStorage.getItem(local_atual + '_ja_pipocada');
            if (lista_pipocada == 'true' || lista_pipocada == true) {
                force = false;
            } else {
                force = true;
            }
        } catch (e) {
            force = true;
        }
    }
    console.log('force 2:', force)

    if (force) {
        for (i = 0; i < conversa.length; i++) {
            conversa[i].style.display = 'none';
        }

        var conversa_pipocando = setInterval(function () {
            if (conversa_i < conversa.length) {
                conversa[conversa_i].style.display = 'inherit';
                conversa_i++;
            } else {
                clearInterval(conversa_pipocando);
                localStorage.setItem(local_atual + '_ja_pipocada', true);
            }
        }, 1000);
    }
}

function escrever_mensagem(texto) {
    var conversa_lista = document.getElementById('conversa_lista');
    var conversa_item = document.createElement('section');
    conversa_item.className = 'conversa';
    conversa_item.innerHTML = texto;
    conversa_lista.appendChild(conversa_item);
    //$(conversa_item).delay(800*i).fadeIn(400);
}


function escrever_mensagem_complexa(obj) {
    var conversa_lista = document.getElementById('conversa_lista');
    var conversa_item = document.createElement('section');
    conversa_item.className = 'conversa';
    conversa_item.appendChild(obj);
    conversa_lista.appendChild(conversa_item);
    //$(conversa_item).delay(800*i).fadeIn(400);
}
var modal;
function wa_show_modal(content) {

    var p;
    if (document.getElementById('wa_modal')) {
        modal = document.getElementById('wa_modal');
        p = document.getElementById('wa_modal_content');
    } else {
        modal = document.createElement('div');
        modal.id = 'wa_modal';
        modal.className = 'modal';
        var modal_content = document.createElement('div');
        var botao_fechar = document.createElement('span');
        p = document.createElement('div');
        p.id = 'wa_modal_content';
        modal_content.appendChild(botao_fechar);
        modal_content.appendChild(p);
        modal_content.className = 'modal-content';
        modal.appendChild(modal_content);
        document.body.appendChild(modal);
    }

    modal.style.display = "block";
    p.innerHTML = content;
    
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}