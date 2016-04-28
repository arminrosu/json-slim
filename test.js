var assert = require('assert');
var slim   = require('./index.js');
var json   = slim({
	true:                  true,
	false:                 false,
	number:                123000,
	numberString:          '123000',
	decimalFraction:       0.00123,
	decimalFractionString: '0.00123',
	exponent:              1.23E+5,
	exponentString:        '1.23e+5',
	customField:           'Tom Marvolo Riddle'
}, {
	minifiers: [
		{
			pattern: '"Tom Marvolo Riddle"',
			replace: function( /* string */ ) {
				return '"I am Lord Voldemort"';
			}
		}
	]
});

process.on('exit', function() {
	var expectedOutput = '{"true":1,"false":0,"number":123e3,"numberString":123e3,"decimalFraction":123e-5,"decimalFractionString":123e-5,"exponent":123e3,"exponentString":123e3,"customField":"I am Lord Voldemort"}';

	assert.equal(json, expectedOutput);

	process.reallyExit(0);
});
