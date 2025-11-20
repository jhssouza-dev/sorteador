const btnSortear = document.querySelector("#btn-sortear")
const btnSortearNovamente = document.querySelector("#btn-sortear-novamente")
const btnVoltar = document.querySelector("#btn-voltar")

const inpQuantidade = document.querySelector("#input-quantidade")
const inpMinimo = document.querySelector("#input-minimo")
const inpMaximo = document.querySelector("#input-maximo")
const inpSemRepeticao = document.querySelector("#input-sem-repeticao")

const mensagemErro = document.querySelector("#mensagem-erro")
const mensagemStatus = document.querySelector("#mensagem-status")

const telaFormulario = document.querySelector("#tela-formulario")
const telaResultado = document.querySelector("#tela-resultado")
const areaResultadoNumeros = document.querySelector("#resultado-numeros")

let ultimaConfiguracao = null

// ---------------------- BOTÃO SORTEAR ----------------------
btnSortear.addEventListener("click", () => {
  if (btnSortear.disabled) return
  btnSortear.disabled = true

  const dados = coletarDados()

  const resultadoValidacao = validarSorteio(dados)
  if (!resultadoValidacao.ok) {
    mensagemErro.textContent = resultadoValidacao.mensagem
    btnSortear.disabled = false
    return
  }

  mensagemErro.textContent = ""

  const numeros = sortearNumeros(dados)
  ultimaConfiguracao = dados

  telaFormulario.classList.add("hidden")
  telaResultado.classList.remove("hidden")

  mensagemStatus.textContent = "Sorteio realizado com sucesso!"

  // na primeira vez, quem importa bloquear é o "Sortear novamente"
  btnSortearNovamente.disabled = true
  const duracao = mostrarResultado(numeros)
  desabilitarBotaoDuranteAnimacao(btnSortearNovamente, duracao)
})

// ---------------- BOTÃO SORTEAR NOVAMENTE -----------------
btnSortearNovamente.addEventListener("click", () => {
  if (btnSortearNovamente.disabled) return
  if (!ultimaConfiguracao) return

  btnSortearNovamente.disabled = true

  const numeros = sortearNumeros(ultimaConfiguracao)

  mensagemStatus.textContent = "Sorteio realizado com sucesso!"

  const duracao = mostrarResultado(numeros)
  desabilitarBotaoDuranteAnimacao(btnSortearNovamente, duracao)
})

// ---------------- BOTÃO VOLTAR PARA O INÍCIO --------------
btnVoltar.addEventListener("click", () => {
  telaResultado.classList.add("hidden")
  telaFormulario.classList.remove("hidden")

  areaResultadoNumeros.innerHTML = ""
  mensagemErro.textContent = ""
  mensagemStatus.textContent = ""
  ultimaConfiguracao = null

  // reseta campos
  inpQuantidade.value = 2
  inpMinimo.value = 1
  inpMaximo.value = 100
  inpSemRepeticao.checked = false

  // garante que botões estejam habilitados novamente
  btnSortear.disabled = false
  btnSortearNovamente.disabled = false

  window.scrollTo({ top: 0, behavior: "smooth" })
})

// ===================== FUNÇÕES ============================

function coletarDados() {
  return {
    quantidade: Number(inpQuantidade.value),
    minimo: Number(inpMinimo.value),
    maximo: Number(inpMaximo.value),
    semRepeticao: inpSemRepeticao.checked
  }
}

function validarSorteio(dados) {
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

  if (isNaN(dados.quantidade) || isNaN(dados.minimo) || isNaN(dados.maximo)) {
    return {
      ok: false,
      mensagem: "Digite valores numéricos válidos."
    }
  }

  if (dados.maximo <= dados.minimo) {
    return {
      ok: false,
      mensagem: "O valor máximo deve ser maior que o valor mínimo."
    }
  }

  if (dados.quantidade <= 0) {
    return {
      ok: false,
      mensagem: "A quantidade de números deve ser maior que zero."
    }
  }

  if (dados.semRepeticao) {
    const totalPossivel = dados.maximo - dados.minimo + 1
    if (dados.quantidade > totalPossivel) {
      return {
        ok: false,
        mensagem:
          "A quantidade de números não pode ser maior que o intervalo quando 'não repetir' estiver marcado."
      }
    }
  }

  return {
    ok: true,
    mensagem: ""
  }
}

function sortearNumeros(dados) {
  const numeros = []

  if (!dados.semRepeticao) {
    for (let i = 0; i < dados.quantidade; i++) {
      const n = numeroAleatorio(dados.minimo, dados.maximo)
      numeros.push(n)
    }
    return numeros
  }

  const disponiveis = []
  for (let n = dados.minimo; n <= dados.maximo; n++) {
    disponiveis.push(n)
  }

  for (let i = 0; i < dados.quantidade; i++) {
    const indice = Math.floor(Math.random() * disponiveis.length)
    const escolhido = disponiveis.splice(indice, 1)[0]
    numeros.push(escolhido)
  }

  return numeros
}

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function mostrarResultado(numeros) {
  areaResultadoNumeros.innerHTML = ""

  let totalMs = 0
  const delayBase = 150
  const duracaoAnimacao = 300

  numeros.forEach((numero, index) => {
    const span = document.createElement("span")
    span.textContent = numero
    span.classList.add("numero-sorteado")

    const delay = index * delayBase
    span.style.animationDelay = `${delay}ms`

    totalMs = delay + duracaoAnimacao
    areaResultadoNumeros.appendChild(span)
  })

  return totalMs + 100
}

function desabilitarBotaoDuranteAnimacao(botao, duracaoMs) {
  setTimeout(() => {
    botao.disabled = false
  }, duracaoMs)
}
