// =====================================================
//  scripts.js — Parquímetro com POO
// =====================================================

// ─── Classe que representa uma faixa de tarifa ──────
class Tarifa {
  constructor(valorMinimo, valorMaximo, minutos) {
    this.valorMinimo = valorMinimo;  // valor mínimo para esta faixa (R$)
    this.valorMaximo = valorMaximo;  // valor cobrado por esta faixa (R$)
    this.minutos     = minutos;      // tempo concedido (minutos)
  }
}

// ─── Classe principal: Parquímetro ──────────────────
class Parquimetro {

  constructor() {
    // Tabela de tarifas conforme enunciado
    this.tarifas = [
      new Tarifa(1.00, 1.00, 30),   // R$1,00 → 30 min
      new Tarifa(1.75, 1.75, 60),   // R$1,75 → 60 min
      new Tarifa(3.00, 3.00, 120),  // R$3,00 → 120 min (máximo)
    ];

    this.TEMPO_MAXIMO = 120; // minutos
    this.VALOR_MAXIMO = 3.00;
  }

  // Calcula o tempo e o troco para um valor inserido
  calcular(valorInserido) {
    // Valor insuficiente
    if (valorInserido < 1.00) {
      return {
        sucesso: false,
        mensagem: "Valor insuficiente. O mínimo é R$ 1,00.",
      };
    }

    // Se o valor for maior ou igual ao máximo, garante 120 min
    if (valorInserido >= this.VALOR_MAXIMO) {
      var troco = valorInserido - this.VALOR_MAXIMO;
      return {
        sucesso:  true,
        minutos:  this.TEMPO_MAXIMO,
        cobrado:  this.VALOR_MAXIMO,
        troco:    troco,
        maximo:   true,
      };
    }

    // Encontra a melhor faixa (maior tarifa que cabe no valor)
    var melhorTarifa = null;

    for (var i = 0; i < this.tarifas.length; i++) {
      if (valorInserido >= this.tarifas[i].valorMaximo) {
        melhorTarifa = this.tarifas[i];
      }
    }

    if (!melhorTarifa) {
      return {
        sucesso: false,
        mensagem: "Valor insuficiente. O mínimo é R$ 1,00.",
      };
    }

    var troco = valorInserido - melhorTarifa.valorMaximo;

    return {
      sucesso:  true,
      minutos:  melhorTarifa.minutos,
      cobrado:  melhorTarifa.valorMaximo,
      troco:    troco,
      maximo:   false,
    };
  }

  // Formata minutos em horas e minutos legível
  formatarTempo(minutos) {
    if (minutos < 60) {
      return minutos + " minutos";
    }
    var horas = Math.floor(minutos / 60);
    var min   = minutos % 60;
    if (min === 0) {
      return horas + (horas === 1 ? " hora" : " horas");
    }
    return horas + "h " + min + "min";
  }

  // Formata valor em reais
  formatarValor(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
  }
}

// ─── Instância global ────────────────────────────────
var parquimetro = new Parquimetro();

// ─── Função chamada pelo botão ───────────────────────
function calcular() {
  var input         = document.getElementById("valorInput");
  var resultadoEl   = document.getElementById("resultado");
  var valorInserido = parseFloat(input.value);

  // Validação básica do campo
  if (isNaN(valorInserido) || valorInserido <= 0) {
    mostrarErro("⚠️ Digite um valor válido.", resultadoEl);
    return;
  }

  var resultado = parquimetro.calcular(valorInserido);

  if (!resultado.sucesso) {
    mostrarErro("🚫 " + resultado.mensagem, resultadoEl);
    return;
  }

  // Monta o HTML do resultado
  var trocoHTML = "";
  if (resultado.troco > 0) {
    trocoHTML = '<div class="res-item res-troco">'
      + '<span class="res-icon">💰</span>'
      + '<div>'
      + '<span class="res-label">Troco</span>'
      + '<span class="res-valor troco">' + parquimetro.formatarValor(resultado.troco) + '</span>'
      + '</div>'
      + '</div>';
  }

  var maximoHTML = resultado.maximo
    ? '<p class="badge-maximo">⏱ Tempo máximo atingido!</p>'
    : "";

  resultadoEl.innerHTML =
    '<div class="res-grid">'
    + '<div class="res-item">'
    + '<span class="res-icon">⏱️</span>'
    + '<div>'
    + '<span class="res-label">Tempo de permanência</span>'
    + '<span class="res-valor">' + parquimetro.formatarTempo(resultado.minutos) + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="res-item">'
    + '<span class="res-icon">💳</span>'
    + '<div>'
    + '<span class="res-label">Valor cobrado</span>'
    + '<span class="res-valor">' + parquimetro.formatarValor(resultado.cobrado) + '</span>'
    + '</div>'
    + '</div>'
    + trocoHTML
    + '</div>'
    + maximoHTML;

  resultadoEl.className = "resultado sucesso";
  resultadoEl.style.display = "block";

  // Animação de entrada
  resultadoEl.classList.remove("animar");
  void resultadoEl.offsetWidth;
  resultadoEl.classList.add("animar");
}

function mostrarErro(mensagem, el) {
  el.innerHTML   = '<p class="erro-msg">' + mensagem + '</p>';
  el.className   = "resultado erro";
  el.style.display = "block";
}

// Enter no input dispara cálculo
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("valorInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") calcular();
  });
});
