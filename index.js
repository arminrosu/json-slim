module.exports = (function () {
  /**
   * Minify a JSON object or string.
   * @param  {string|object|array} json - JSON string to minify.
   * @param  {object} options
   * @return {string}
   */
  var slim = (input, options = {}) => {
    let json = ''
    let inputString = ''
    let minifiers = [
      {
        pattern: '"?[\\d\\.eE\\+\\-]+"?',
        replace: slimNumber
      },
      {
        pattern: 'false|true',
        replace: slimBoolean
      }
    ]

    // No pretty JSON in this joint
    if (typeof input === 'string') {
      inputString = input
      input = JSON.parse(input)
    } else {
      inputString = JSON.stringify(input)
    }

    // We deal only in strings
    json = JSON.stringify(input)

    // Custom slimming functions
    if (options.minifiers && Array.isArray(options.minifiers) && options.minifiers.length > 0) {
      minifiers = minifiers.concat(options.minifiers)
    }

    // Apply minification functions
    minifiers.forEach(minifier => {
      json = parseValues(json, minifier.pattern, minifier.replace)
    })

    if (options.report) {
      console.log('JSON-Slim: ' + Math.floor(json.length / inputString.length * 100) + '% of original.')
    }

    return json
  }

  /**
   * Find all matching values in a JSON
   * @param  {string} string - JSON string
   * @param  {string} pattern - RegExp pattern that matches the value (only!)
   * @return {Object[]} - Array of matched values, with index
   */
  var getMatches = (string, pattern) => {
    const regexp = new RegExp('(?:[^\\\\]":|\\[?)(' + pattern + ')(?:[,\\]\\}])', 'g')
    let matches = []
    let match = regexp.exec(string)

    while (match != null) {
      matches.push({
        string: match[1],
        index: match.index + match[0].indexOf(match[1])
      })
      match = regexp.exec(string)
    }

    return matches
  }

  /**
   * Replace a string in string at index
   * @param  {string} haystack - String to operate on
   * @param  {string} needle - String to replace
   * @param  {string} replacement - String to replace the needle with
   * @param  {integer} start - Index at which to start changing the string
   * @return {string}
   */
  var spliceStrings = (haystack, needle, replacement, start) => {
    return haystack.substring(0, start) + replacement + haystack.substring(start + needle.length)
  }

  /**
   * Find values in a json and apply a callback to them
   * @param  {string}   json
   * @param  {string}   pattern - RegExp pattern to match values
   * @param  {Function} callback
   * @return {string}
   */
  var parseValues = (json, pattern, callback) => {
    let matches = getMatches(json, pattern)
    matches.reverse()

    // Replace them with shorter versions
    // In reverse order so we don't affect indexes
    matches.forEach(match => {
      json = spliceStrings(json, match.string, callback(match.string), match.index)
    })

    return json
  }

  /**
   * Represent Number in a shorter form
   * @param  {string} input
   * @return {string}
   */
  var slimNumber = input => {
    let string = input.replace(/"/g, '')

    // Check if the string contains a number
    if (isNaN(string) || isNaN(parseFloat(string))) {
      return input
    }

    let value = parseFloat(string)

    // Exponential
    // Exponential notation is positive by default
    let exp = value.toExponential().replace('+', '')

    // Remove "." from exponential notation when possible.
    // E.g. 1.23e6 = 123e4
    let digitsPastDot = exp.indexOf('e') - exp.indexOf('.') - 1
    let exponent = parseInt(exp.substring(exp.indexOf('e') + 1), 10)
    exp = exp.replace('e' + exponent, 'e' + (exponent - digitsPastDot)).replace('.', '')

    if (string.length > exp.length) {
      string = exp
    }

    return value.toString().length > string.length ? string : value.toString()
  }

  /**
   * Represent Booleans as Integers
   * @param  {string} input
   * @return {string}
   */
  var slimBoolean = input => {
    if (input === 'true') {
      return '1'
    }

    return '0'
  }

  return slim
})()
