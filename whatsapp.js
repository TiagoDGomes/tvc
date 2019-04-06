var conversa = document.getElementsByClassName('conversa');
var conversa_i = 0;

setInterval(function () {
    if (conversa_i < conversa.length) {
        conversa[conversa_i].style.display = 'inherit';
        conversa_i++;
    }
}, 1000);