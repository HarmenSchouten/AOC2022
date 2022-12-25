const text = await Deno.readTextFile("./Day25/input.txt")
const items = text.split("\r\n")

const chars = [ '=', '-', '0', '1', '2' ]
const [ base, offset ] = [ 5, 2 ];

/** converts SNAFU to decimal */
function toDecimal( snafu: string ): number {
    return snafu.split( '' ).reverse().reduce(
        (total, symbol, i) => total + base**i * (chars.indexOf(symbol) - offset),
        0
    );
}

/** converts decimal to SNAFU */
function toSnafu( num: number ): string {
    const digits = [];
    while ( num > 0 ) {
        // SNAFU is base 5, but each digits place is shifted by 2
        num += offset;
        digits.unshift( num % base );
        num = Math.floor( num / base );
    }
    // convert regular digits to SNAFU glyphs
    return digits.map( digit => chars[digit] ).join( '' );
}

console.log('Answer:', toSnafu(items.map(toDecimal).reduce((acc, item) => acc += item, 0)));