document.getElementById('calculate-btn').addEventListener('click', function() {
    const targetValue = parseInt(document.getElementById('target-value').value);
    const maxCables = parseInt(document.getElementById('max-cables').value);
    const cableCheckboxes = document.querySelectorAll('.cable-checkbox');
    
    if (isNaN(targetValue) || isNaN(maxCables)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const selectedValues = Array.from(cableCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.value));

    if (selectedValues.length === 0) {
        alert('Por favor, selecione ao menos um tipo de cabo.');
        return;
    }

    const result = findCombinations(selectedValues, targetValue, maxCables);
    const [closestBelow, closestAbove] = findClosestValues(selectedValues, targetValue, maxCables);

    // Exibe o resultado
    document.getElementById('exact-result').textContent = result ? formatResult(result) : 'Nenhuma combinação exata encontrada.';
    document.getElementById('above-result').textContent = closestAbove !== null ? `Valor mais próximo acima: ${closestAbove}\nCabos usados: ${formatResult(findCombinations(selectedValues, closestAbove, maxCables))}` : 'Nenhum valor acima encontrado.';
    document.getElementById('below-result').textContent = closestBelow !== null ? `Valor mais próximo abaixo: ${closestBelow}\nCabos usados: ${formatResult(findCombinations(selectedValues, closestBelow, maxCables))}` : 'Nenhum valor abaixo encontrado.';
});

function findCombinations(values, target, maxCables) {
    const dp = {};
    dp[0] = { count: 0, used: {} };
    values.forEach(value => {
        Object.keys(dp).forEach(t => {
            for (let k = 1; k <= maxCables; k++) {
                const newSum = parseInt(t) + value * k;
                if (dp[newSum] === undefined || dp[newSum].count > dp[t].count + k) {
                    dp[newSum] = { count: dp[t].count + k, used: { ...dp[t].used } };
                    dp[newSum].used[value] = (dp[newSum].used[value] || 0) + k;
                }
            }
        });
    });

    return dp[target] ? dp[target].used : null;
}

function findClosestValues(values, target, maxCables) {
    let closestBelow = null;
    let closestAbove = null;

    const dp = {};
    dp[0] = { count: 0, used: {} };
    values.forEach(value => {
        Object.keys(dp).forEach(t => {
            for (let k = 1; k <= maxCables; k++) {
                const newSum = parseInt(t) + value * k;
                if (dp[newSum] === undefined || dp[newSum].count > dp[t].count + k) {
                    dp[newSum] = { count: dp[t].count + k, used: { ...dp[t].used } };
                    dp[newSum].used[value] = (dp[newSum].used[value] || 0) + k;
                }
            }
        });
    });

    Object.keys(dp).forEach(s => {
        if (parseInt(s) <= target) {
            if (closestBelow === null || parseInt(s) > closestBelow) {
                closestBelow = parseInt(s);
            }
        }
        if (parseInt(s) >= target) {
            if (closestAbove === null || parseInt(s) < closestAbove) {
                closestAbove = parseInt(s);
            }
        }
    });

    return [closestBelow, closestAbove];
}

function formatResult(result) {
    return Object.entries(result).map(([cable, count]) => `${count}x ${cable}`).join('\n');
}
