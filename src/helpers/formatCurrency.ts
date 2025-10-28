const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
});

/**
 *  Formata um valor para moeda (BRL).
 * @param {number} amount - Valor a ser formatado para moeda (BRL)
 * @returns {string} - Valor formatado
 * @example
 * const currency = formatCurrency(1500);
 * console.log(currency) // R$ 1.500,00
 */
export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount);
}
