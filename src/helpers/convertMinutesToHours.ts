/**
 * Converte minutos (duração) em horas.
 * @param {number } minutes Os minutos a serem convertidos.
 * @returns {string} Os minutos convertidos em horas.
 */

export const convertMinutesToHours = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour}h ${minute}min`;
};
