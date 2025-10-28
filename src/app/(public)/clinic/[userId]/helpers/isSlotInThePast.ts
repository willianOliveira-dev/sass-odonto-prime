export function isToday(date: Date) {
    const today: Date = new Date();
    return (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
    );
}

/**
 * Verificar se um determinado slot está no passado.
 * @param {string} slotTime
 * @returns {boolean}
 */
export function isSlotInThePast(slotTime: string): boolean {
    const [slotHour, slotMinutes] = slotTime.split(':').map(Number);

    const now: Date = new Date();
    const currentHours: number = now.getHours();
    const currentMinutes: number = now.getMinutes();

    if (slotHour < currentHours) return true;

    if (slotHour === currentHours && slotMinutes <= currentMinutes) return true;

    return false;
}

interface IsSlotSequenceAvailableProps {
    startSlot: string;
    filledSlots: number;
    allSlots: string[];
    blockedTimes: string[];
}

/**
 * Verificar se uma sequência de slots está disponível.
 * Exemplo: Se um serviço tem 2 required slots e começa no time 15:00, precisa garantir que 15:00 e 15:30 não estejam no nosso blockedSlots
 * @param {IsSlotSequenceAvailableProps} props
 * @returns {boolean}
 *
 */
export function isSlotSequenceAvailable({
    startSlot, // Primeiro horário disponivel
    filledSlots, // Quantidade de slots necessários
    allSlots, // Todos horários da clínica
    blockedTimes, // Horários bloqueados
}: IsSlotSequenceAvailableProps) {
    const startIndex: number = allSlots.indexOf(startSlot);
    if (startIndex === -1 || startIndex + filledSlots > allSlots.length)
        return false;

    for (let i = startIndex; i < startIndex + filledSlots; i++) {
        const slotTime: string = allSlots[i];
        if (blockedTimes.includes(slotTime)) return false;
    }

    return true;
}
