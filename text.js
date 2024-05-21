const { SerialPort } = require('serialport');

let jizPoslano = "";
const port = new SerialPort({
  path: 'COM15',
  baudRate: 1200,
  dataBits: 7,
  parity: 'even',
  stopBits: 2,
});


// Funkce pro převod hexadecimálního řetězce na buffer
function hexStringToBuffer(hex) {
  return Buffer.from(hex, 'hex');
}


function checksum8XOR(hexString) {
  // Převod hexadecimálního řetězce na pole bajtů
  let bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  // Inicializace checksum
  let checksum = 0x00;

  // Provedení XOR přes všechny bajty
  for (let byte of bytes) {
    checksum ^= byte;
  }

  // Převod výsledného checksumu na hexadecimální řetězec
  return checksum.toString(16).padStart(2, '0').toUpperCase();
}

function stringToHex(str) {
  let hexKodSlova = '';
  for (let i = 0; i < str.length; i++) {
    let hex = str.charCodeAt(i).toString(16);
    hexKodSlova += hex.length === 1 ? '0' + hex : hex;
  }
  return hexKodSlova;
}

function getCas() {
  const nyní = new Date();
  let hodiny = nyní.getHours();
  let minuty = nyní.getMinutes();
  let sekundy = nyní.getSeconds();
  
  // Přidání přední nuly pouze pro sekundy, pokud je hodnota menší než 10
  sekundy = sekundy < 10 ? '0' + sekundy : sekundy;

  const cas = `${hodiny}:${minuty}`;
  return cas;
}


  const slovo = "test";
  const hexKodSlova = stringToHex(slovo);
  console.log(hexKodSlova); // Výstup: 61686f6a


  let hexString = "7f" + "7A4920" + hexKodSlova + "0D";
  let checksum = checksum8XOR(hexString);

  console.log(hexString);
  console.log(checksum);

  const hexCode = hexString.substring(2) + checksum;

  console.log(hexCode);



  // Hex kód, který chcete poslat (například 'A1B2C3')
  // const hexCode = '7A4920424146210D05';
  const buffer = hexStringToBuffer(hexCode);
  console.log(buffer);
  // Poslání dat
  port.write(buffer, (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Message written');
  });

  // Chybová obsluha
  port.on('error', (err) => {
    console.log('Error: ', err.message);
  });
