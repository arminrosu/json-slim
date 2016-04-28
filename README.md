# JSON-Slim

[![Build Status](https://travis-ci.org/arminrosu/json-slim.svg?branch=master)](https://travis-ci.org/arminrosu/json-slim)

Minify JSON better than JSON.stringify().

It achieves this by converting Numbers, number Strings and Booleans to a shorter form. You should be aware of this in your application, type checks might fail.

## Example

```js
var slim = require('./index.js');

var json = slim({
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
	// JSON-slim reports only to you, how good a job it did.
	report:    true,
	// You can add your own minifiers too
	minifiers: [
		{
			// RegExp Pattern
			pattern: '"Tom Marvolo Riddle"',
			replace: function(string) {
				return '"I am Lord Voldemort"';
			}
		}
	]
});

console.log(json);
```

Output:

```bash
JSON-Slim: 90% of original.
{"true":1,"false":0,"number":123e3,"numberString":123e3,"decimalFraction":123e-5,"decimalFractionString":123e-5,"exponent":123e3,"exponentString":123e3,"customField":"I am Lord Voldemort"}
```

## Even less?

Check out [json-lean](https://github.com/arminrosu/json-lean) if your JSON requests have the same object structure.
