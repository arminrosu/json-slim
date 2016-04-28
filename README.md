# JSON-Slim

Minify JSON better than JSON.stringify().

It achieves this by converting Numbers and number Strings to a shorter form.

## Example

```js
var slim = require('./index.js');

var json = slim({
	number:                '1230000',
	numberString:          '1230132101231323',
	decimalFraction:       0.000000000013,
	decimalFractionString: '0.000000000023',
	exponent:              1.62e5,
	exponentString:        '1.62e+7'
}, {
	report: true
});

console.log(json);
```

Output:

```bash
JSON-Slim: 86% of original.
{"number":123e4,"numberString":1230132101231323,"decimalFraction":13e-12,"decimalFractionString":23e-12,"exponent":162e3,"exponentString":162e5}
```

## Even less?

Check out [json-lean](https://github.com/arminrosu/json-lean) if your JSON requests have the same object structure.
