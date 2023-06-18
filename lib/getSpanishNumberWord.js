function getSpanishNumberWord(num) {
    const uniqueNums = {
        1: 'Una',
        2: 'Dos',
        3: 'Tres',
        4: 'Cuatro',
        5: 'Cinco',
        6: 'Seis',
        7: 'Siete',
        8: 'Ocho',
        9: 'Nueve',
        10: 'Diez',
        11: 'Once',
        12: 'Doce',
        13: 'Trece',
        14: 'Catorce',
        15: 'Quince',
        20: 'Veinte',
        30: 'Treinta',
        40: 'Cuarenta',
        50: 'Cincuenta',
        60: 'Sesenta',
        70: 'Setenta',
        80: 'Ochenta',
        90: 'Noventa'
    }

    if (num === 0) {
        return "Añade"
    }

    if (num in uniqueNums) { 
        return uniqueNums[num];
    }
    if (num < 20) { 
        return "dieci" + uniqueNums[num % 10] 
    }
    if (num < 30) { 
        return "veinti" + uniqueNums[num % 10] 
    }
    if (num < 100) { 
        return uniqueNums[Math.floor(num / 10) * 10] + " y " + uniqueNums[num % 10];
    }

    return "Ay, Papá, Cuantas"
}


module.exports = getSpanishNumberWord