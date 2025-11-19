const btnSortear = document.querySelector("#btn-sortear")
const inpQuantidade = document.querySelector("#input-quantidade")
const inpMinimo = document.querySelector("#input-minimo")
const inpMaximo = document.querySelector("#input-maximo")
const inpSemRepeticao = document.querySelector("#input-sem-repeticao")


// Adiciona um "ouvinte" de evento de clique no botão Sortear
btnSortear.addEventListener("click", function (event) {
    // Aqui você monta um objeto com os dados do sorteio
    // Já converte os valores dos inputs para Number (número)
    const novoSorteio = {
        id: new Date().getTime(),            
        inpQuantidade: Number(inpQuantidade.value), 
        inpMinimo: Number(inpMinimo.value),          
        inpMaximo: Number(inpMaximo.value),          
        inpSemRepeticao: inpSemRepeticao.checked     
    }

    // Mostra no console o objeto montado, útil para debug
    console.log(novoSorteio)

    // Chama a função de validação, passando o objeto como parâmetro
    const resultadoValidacao = validarSorteio(novoSorteio)

    // Mostra no console o resultado da validação (ok: true/false + mensagem)
    console.log(resultadoValidacao)
})


// Função responsável por validar os dados do sorteio
function validarSorteio(novoSorteio) {

    // Verificar se existem campos vazios
    if (
        inpQuantidade.value.trim() === "" ||  
        inpMinimo.value.trim() === "" ||      
        inpMaximo.value.trim() === ""         
    ) {
        return {
            ok: false,   
            mensagem: "Preencha todos os campos antes de sortear." 
        }
    }

    // REGRA 1: Verificar se os valores numéricos são realmente números
    if (
        isNaN(novoSorteio.inpQuantidade) ||
        isNaN(novoSorteio.inpMinimo) ||
        isNaN(novoSorteio.inpMaximo)
    ) {
        return {
            ok: false,
            mensagem: "Digite um número válido em todos os campos."
        }
    }

    // REGRA 2: o valor máximo precisa ser MAIOR que o valor mínimo
    if (novoSorteio.inpMaximo <= novoSorteio.inpMinimo) {
        return {
            ok: false,
            mensagem: "O valor máximo deve ser maior que o valor mínimo."
        }
    }

    // REGRA 3: a quantidade de números deve ser maior que zero
    if (novoSorteio.inpQuantidade <= 0) {
        return {
            ok: false,
            mensagem: "A quantidade de números deve ser maior que zero."
        }
    }

    // REGRA 4: caso a opção "não repetir" esteja marcada
    if (novoSorteio.inpSemRepeticao === true) {

        // Calcula quantos números existem no intervalo [mínimo, máximo]
        // Ex: de 1 a 10 → 10 - 1 + 1 = 10 números possíveis
        let totalPossivel = novoSorteio.inpMaximo - novoSorteio.inpMinimo + 1

        // Se a quantidade desejada for maior que o total possível, não tem como sortear sem repetir
        if (novoSorteio.inpQuantidade > totalPossivel) {

            return {
                ok: false,
                mensagem: "A quantidade de números não pode ser maior que o intervalo disponível quando 'não repetir' estiver marcado."
            }
        }
    }

    // Se passou por todas as validações sem dar return de erro,
    // então está tudo certo para seguir com o sorteio
    return {
        ok: true,
        mensagem: "valido"
    }

}