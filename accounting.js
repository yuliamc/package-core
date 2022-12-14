'use strict';

const numeral = require('numeral');

numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    }
});

numeral.locale('id');

exports.formatCurrency = function (value, postfix = '') {
    const result = numeral(value).format('(0,0)');
    if (numeral(value).value() < 0) {
        return result.replace('(', '(Rp ').replace(')', `${postfix})`);
    }
    return `Rp ${result}${postfix}`;
};

exports.formatPercentage = function (value, decimal = 0) {
    let pad = '';

    if (decimal >= 6) {
        pad = '[.]000000';
    } else if (decimal > 0) {
        pad = `[.]${'000000'.substring(0, decimal)}`;
    }

    const format = `(0${pad}%)`;
    return numeral(value).format(format);
};


const formatBasicWords = (amount) => {
    if (amount === 11) return 'sebelas';
    if (amount === 10) return 'sepuluh';
    if (amount === 9) return 'sembilan';
    if (amount === 8) return 'delapan';
    if (amount === 7) return 'tujuh';
    if (amount === 6) return 'enam';
    if (amount === 5) return 'lima';
    if (amount === 4) return 'empat';
    if (amount === 3) return 'tiga';
    if (amount === 2) return 'dua';
    if (amount === 1) return 'satu';
    if (amount === 0) return 'nol';
    return '';
};

const formatDozenWords = (amount) => {
    if (amount >= 20) {
        const division = Math.floor(amount / 10);
        const remainder = Math.floor(amount % 10);
        return [formatBasicWords(division), 'puluh', remainder ? formatBasicWords(remainder) : ''].filter(x => x).join(' ');
    }

    if (amount >= 12) return [formatBasicWords(Math.floor(amount % 10)), 'belas'].filter(x => x).join(' ');
    return formatBasicWords(amount);
};

const formatHundredWords = (amount) => {
    if (amount >= 100) {
        const division = Math.floor(amount / 100);
        const remainder = Math.floor(amount % 100);
        const prefix = division === 1 ? 'seratus' : `${formatDozenWords(division)} ratus`;
        return [prefix, remainder ? formatDozenWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatDozenWords(amount);
};

const formatThousandWords = (amount) => {
    if (amount >= 1000) {
        const division = Math.floor(amount / 1000);
        const remainder = Math.floor(amount % 1000);
        const prefix = division === 1 ? 'seribu' : `${formatHundredWords(division)} ribu`;
        return [prefix, remainder ? formatHundredWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatHundredWords(amount);
};

const formatMillionWords = (amount) => {
    if (amount >= 1000000) {
        const division = Math.floor(amount / 1000000);
        const remainder = Math.floor(amount % 1000000);
        return [formatHundredWords(division), 'juta', remainder ? formatThousandWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatThousandWords(amount);
};

const formatBillionWords = (amount) => {
    if (amount >= 1000000000) {
        const division = Math.floor(amount / 1000000000);
        const remainder = Math.floor(amount % 1000000000);
        return [formatHundredWords(division), 'miliar', remainder ? formatMillionWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatMillionWords(amount);
};

const formatTrillionWords = (amount) => {
    if (amount >= 1000000000000) {
        const division = Math.floor(amount / 1000000000000);
        const remainder = Math.floor(amount % 1000000000000);
        return [formatHundredWords(division), 'triliun', remainder ? formatBillionWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatBillionWords(amount);
};

const formatQuadTrillionWords = (amount) => {
    if (amount >= 1000000000000000) {
        const division = Math.floor(amount / 1000000000000000);
        const remainder = Math.floor(amount % 1000000000000000);
        return [formatHundredWords(division), 'kuadtriliun', remainder ? formatTrillionWords(remainder) : ''].filter(x => x).join(' ');
    }

    return formatTrillionWords(amount);
};


const formatWords = (amount) => {
    const absolute = Math.floor(Math.abs(amount));
    const decimal = `${amount}`.split('.')[1];
    const part1 = amount < 0 ? 'negatif ' : '';
    const part2 = formatQuadTrillionWords(absolute);
    const part3 = decimal ? ` koma ${decimal.split('').map(x => formatBasicWords(parseInt(x))).join(' ')}` : '';
    return `${part1}${part2}${part3}`;
};

exports.formatWords = formatWords;

exports.formatCurrencyWords = amount => `${formatWords(amount)} rupiah`;

module.exports = exports;
