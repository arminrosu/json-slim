# JSON-Slim

[![Build Status](https://travis-ci.org/arminrosu/json-slim.svg?branch=master)](https://travis-ci.org/arminrosu/json-slim)
[![Dependencies](https://david-dm.org/arminrosu/json-slim.svg)](https://david-dm.org/arminrosu/json-slim)

Minify JSON better than `JSON.stringify()`.

It achieves this by converting Numbers, number Strings and Booleans to a shorter form. Unicode characters are converted automatically by _JSON.stringify()_, which is used internally.

You should be aware of the potential type conversion _json-slim_ performs, as type checks in your application might fail.

## Installation

```sh
npm i json-slim
```

## Example

```js
var slim = require('json-slim');

var json = slim({
	boolean:     true,
	number:      '123000',
	unicode:     '\u03A9',
	customField: 'Tom Marvolo Riddle'
}, {
	// JSON-slim reports only to you
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
JSON-Slim: 93% of original.
```

```bash
{"boolean":1,"number":123e3,"unicode":"Ω","customField":"I am Lord Voldemort"}
```

## Even less?

Check out [json-lean](https://github.com/arminrosu/json-lean) if your JSON requests have the same object structure.
