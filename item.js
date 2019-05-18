


function atualiza_lista_geral(){
    if (request_dados.readyState == 4 && request_feedback.readyState == 4) {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var escolha = url.searchParams.get("escolha");
        escrever_mensagem('Vejo que você escolheu ' + escolha);
        escrever_mensagem('No momento ' + escolha);
        
        pipocar_conversa(btoa(escolha));
    }
}