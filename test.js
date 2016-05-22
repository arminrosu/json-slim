var assert = require('assert')
var slim = require('./index.js')
var json = slim({
  true: true,
  false: false,
  array: [0.00123, '123000', 123000],
  arrayMixed: [0.00123, false, '123000'],
  arrayNumbers: ['0.00123', 123000, '123000'],
  number: 123000,
  numberString: '123000',
  decimalFraction: 0.00123,
  decimalFractionString: '0.00123',
  exponent: 1.23E+5,
  exponentString: '1.23e+5',
  customField: 'Tom Marvolo Riddle'
}, {
  report: true,
  minifiers: [
    {
      pattern: '"Tom Marvolo Riddle"',
      replace: function (string) {
        return '"I am Lord Voldemort"'
      }
    }
  ]
})

// Travis doesn't display the entire output, so we print it here
console.log('Slimming output: ')
console.log(json)

process.on('exit', function () {
  var expectedOutput = '{"true":1,"false":0,"array":[123e-5,123e3,123e3],"arrayMixed":[123e-5,0,123e3],"arrayNumbers":[123e-5,123e3,123e3],"number":123e3,"numberString":123e3,"decimalFraction":123e-5,"decimalFractionString":123e-5,"exponent":123e3,"exponentString":123e3,"customField":"I am Lord Voldemort"}'

  assert.equal(json, expectedOutput)

  process.reallyExit(0)
})
