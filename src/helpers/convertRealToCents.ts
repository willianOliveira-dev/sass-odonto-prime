/**
 * Converte um valor monetário em reias (BRL) para centavos.
 * @param {string} amount Valor monetário em reais (BRL) em ser convertido.
 * @returns {number} Valor convertido em centavos.
 * @example 
 * const realAmount = "1.500,00";
 * const priceInCents = convertRealToCents(realAmount);
 * console.log(priceInCents) // 150000
 */
export function convertRealToCents(amount: string): number {
    const numericPrice = parseFloat(
        amount.replace(/\./g, '').replace(',', '.')
    );

    const priceInCents = numericPrice * 100;

    return priceInCents;
}
