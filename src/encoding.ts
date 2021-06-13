// https://ja.wikipedia.org/wiki/IEEE_754
const ieee754 = (n: number) => {
  const buf = Buffer.allocUnsafe(4);
  buf.writeFloatLE(n , 0);

  return Uint8Array.from(buf);
};

const encodeString = (str: string) => [
  str.length,
  ...str.split('').map(s => s.charCodeAt(0)),
];

const signedLEB128 = (n: number) => {
  const buffer = [];
  let more = true;

  while (more) {
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
    // https://ja.wikipedia.org/wiki/%E5%89%8A%E9%99%A4%E6%96%87%E5%AD%97
    let byte = n & 0x7f;

    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift_assignment
    n >>>= 7;

    // https://ja.wikipedia.org/wiki/ASCII
    if ((n === 0 && (byte & 0x40) === 0) || (n === -1 && (byte & 0x40) !== 0)) {
      more = false
    } else {
      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment
      byte |= 0x80;
    }

    buffer.push(byte);
  }

  return buffer;
};

const unsignedLEB128 = (n: number) => {
  const buffer = [];

  do {
    let byte = n & 0x7f;
    n >>>= 7;

    if (n !== 0) {
      byte |= 0x80;
    }

    buffer.push(byte);
  } while (n !== 0)
};

export {
  ieee754,
  encodeString,
  signedLEB128,
  unsignedLEB128,
};
