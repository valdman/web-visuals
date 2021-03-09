export type Complex = [number, number];

export function add(first: Complex, second: Complex): Complex {
    const [firstR, firstI] = first;
    const [secondR, secondI] = second;
    return [firstR + secondR, firstI + secondI];
}

export function sub(first: Complex, second: Complex): Complex {
    const [firstR, firstI] = first;
    const [secondR, secondI] = second;
    return [firstR - secondR, firstI - secondI];
}

export function mult(first: Complex, second: Complex): Complex {
    const [firstR, firstI] = first;
    const [secondR, secondI] = second;
    return [firstR * secondR - firstI * secondI, firstR * secondI + firstI * secondR];
}
