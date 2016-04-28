module.exports = function() {
	/**
	 * Minify values in JSON.
	 * Doesn't minify the JSON. Use JSON.stringify() without `space` parameter for that.
	 * @param  {string|object|array} json - JSON string to minify.
	 * @param  {object} options
	 * @return {string}
	 */
	var minifyOutput = function(input, options) {
		options = options || {};

		var json        = '';
		var inputString = '';

		// No pretty JSON in this joint
		if (typeof input === 'string') {
			inputString = input;
			input       = JSON.parse(input);
		} else {
			inputString = JSON.stringify(input);
		}

		json = JSON.stringify(input);

		// Minify Numbers
		var numbers = getNumbers(json);
		numbers.reverse();

		// Replace them for shorter versions
		// In reverse order so we don't affect indexes
		numbers.forEach(function(match) {
			json = spliceStrings(json, match.string, minifyNumber(match.string), match.index);
		});

		if (options.report) {
			console.log('JSON-Slim: ' + Math.floor(json.length / inputString.length * 100) + '% of original.');
		}

		return json;
	};

	/**
	 * Find all Number values in a JSON
	 * @param  {string} string
	 * @return {Object[]} - Array of matched numers, with index
	 */
	var getNumbers = function(string) {
		var regexp  = /(?:[^\\]": ?)("?[\d\.eE\+\-]+"?)(?:,|\})/g;
		var matches = [];
		var match   = regexp.exec(string);

		while (match != null) {
			matches.push({
				string: match[1],
				index:  match.index + match[0].indexOf(match[1])
			});
			match = regexp.exec(string);
		}

		return matches;
	};

	/**
	 * Replace a string in string at index
	 * @param  {string} haystack - String to operate on
	 * @param  {string} needle - String to replace
	 * @param  {string} replacement - String to replace the needle with
	 * @param  {integer} start - Index at which to start changing the string
	 * @return {string}
	 */
	var spliceStrings = function(haystack, needle, replacement, start) {
		return haystack.substring(0, start) + replacement + haystack.substring(start + needle.length);
	};

	/**
	 * Represent Number in a shorter form
	 * @param  {string} input
	 * @return {string}
	 */
	var minifyNumber = function(input) {
		var string = input.replace(/"/g, '');

		if (!isNumber(string)) {
			return input;
		}

		var value = parseFloat(string);

		// Exponential
		// Exponential notation is positive by default
		var exp = value.toExponential().replace('+', '');

		// Remove "." from exponential notation when possible.
		// E.g. 1.23e6 = 123e4
		var digitsPastDot = exp.indexOf('e') - exp.indexOf('.') - 1;
		var exponent      = parseInt(exp.substring(exp.indexOf('e') + 1), 10);
		exp = exp.replace('e' + exponent, 'e' + (exponent - digitsPastDot)).replace('.', '');

		if (string.length > exp.length) {
			string = exp;
		}

		return value.toString().length > string.length ? string : value.toString();
	};

	/**
	 * Check if a string contains a number.
	 * @see {@link http://stackoverflow.com/a/35759874/584441|Stackoverflow source}
	 * @param  {string} string
	 * @return {Boolean}
	 */
	var isNumber = function(string) {
		return !isNaN(string) && !isNaN(parseFloat(string));
	};

	return minifyOutput;
}();
