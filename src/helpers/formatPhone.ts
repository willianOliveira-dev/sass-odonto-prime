export function formatPhone(phone: string) {

    const cleanedValue: string = phone.replace(/\D/g, '');
    
    if (cleanedValue.length > 11) {
        return phone.slice(0, 15);
    }

    // Máscara
    const formattedValue = cleanedValue
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');

    return formattedValue;
}
// 21999443433