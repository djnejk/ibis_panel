const { SerialPort } = require('serialPort')

SerialPort.list().then(function (data) {
  debugger;
  console.log(data);  
});