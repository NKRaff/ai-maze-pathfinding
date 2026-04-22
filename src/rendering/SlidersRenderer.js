export default class SlidersRenderer {
  constructor(containers) {
    this.ranges = Array.from(containers).map(c => ({
      input: c.querySelector('input[type="range"]'),
      output: c.querySelector('.range-value')
    }));
  }

  updateUi() {
    this.ranges.forEach(r => {
      // Usamos Math.round para exibir números inteiros bonitos na interface
      r.output.textContent = Math.round(r.input.value) + "%";
    });
  }

  normalize(changedInput) {
    const newValue = parseFloat(changedInput.value);
    const others = this.ranges.filter(r => r.input !== changedInput);
    
    const targetOthersTotal = 100 - newValue;
    const currentOthersTotal = others.reduce((sum, r) => sum + parseFloat(r.input.value), 0);

    if (currentOthersTotal <= 0) {
      // Se os outros eram zero, divide o que sobrou igualmente
      const share = targetOthersTotal / others.length;
      others.forEach(r => r.input.value = share);
    } else {
      // Distribuição proporcional baseada no valor atual
      others.forEach(r => {
        const currentVal = parseFloat(r.input.value);
        const ratio = currentVal / currentOthersTotal;
        r.input.value = ratio * targetOthersTotal;
      });
    }

    // A correção de arredondamento deve ser feita nos valores numéricos
    this.#fixRoundingErrors(changedInput);
    this.updateUi();
  }

  #fixRoundingErrors(changedInput) {
    // Calculamos o total atual
    let total = this.ranges.reduce((sum, r) => sum + parseFloat(r.input.value), 0);
    let diff = 100 - total;

    // Se houver diferença (ex: 100.0001 ou 99.999), ajustamos no primeiro slider 
    // disponível que NÃO seja o que o usuário está movendo.
    if (Math.abs(diff) > 0.01) {
      const targetAdjust = this.ranges.find(r => r.input !== changedInput);
      if (targetAdjust) {
        const currentVal = parseFloat(targetAdjust.input.value);
        targetAdjust.input.value = currentVal + diff;
      }
    }
  }
}