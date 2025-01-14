/* eslint-disable no-var */
// Simple JavaScript Templating
// Paul Miller (http://paulmillr.com)
// http://underscorejs.org
// (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
/**
 * @typedef SettingsTmplType
 * @type {object}
 * @property {RegExp} evaluate
 * @property {RegExp} interpolate
 * @property {RegExp} escape
 */
/**
 * @type {SettingsTmplType}
 */
var settings = {
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
}

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
/**
 * @type {RegExp}
 */
var noMatch = /(.)^/
// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  '\'':      '\'',
  '\\':     '\\',
  '\r':     'r',
  '\n':     'n',
  '\t':     't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
}

/**
 * @type {RegExp}
 */
var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g

// List of HTML entities for escaping.
var htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;'
}

/**
 * @type {RegExp}
 */
var entityRe = new RegExp('[&<>"\']', 'g')

var escapeExpr = function(string) {
  if (string === null) return ''
  return ('' + string).replace(entityRe, function(match) {
    return htmlEntities[match]
  })
}

var counter = 0

/**
 * JavaScript micro-templating, similar to John Resig's implementation.
 * Underscore templating handles arbitrary delimiters, preserves whitespace,
 * and correctly escapes quotes within interpolated code.
 *
 * @param {string} text
 * @param {*=} data
 * @returns
 */
var tmpl = function(text, data) {
  var render

  // Combine delimiters into one regular expression via alternation.
  var matcher = new RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g')

  // Compile the template source, escaping string literals appropriately.
  var index = 0
  var source = '__p+=\''
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset)
      .replace(escaper, function(match) { return '\\' + escapes[match] })

    if (escape)
      source += '\'+\n((__t=(' + escape + '))==null?\'\':escapeExpr(__t))+\n\''

    if (interpolate)
      source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\''

    if (evaluate)
      source += '\';\n' + evaluate + '\n__p+=\''

    index = offset + match.length
    return match
  })
  source += '\';\n'

  // If a variable is not specified, place data values in local scope.
  if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n'

  source = 'var __t,__p=\'\',__j=Array.prototype.join,' +
    'print=function(){__p+=__j.call(arguments,\'\');};\n' +
    source + 'return __p;\n//# sourceURL=/microtemplates/source[' + counter++ + ']'

  try {
    /*jshint -W054 */
    // TODO: find a way to avoid eval
    render = new Function(settings.variable || 'obj', 'escapeExpr', source)
  } catch (e) {
    e.source = source
    throw e
  }

  if (data) return render(data, escapeExpr)
  var template = function(data) {
    return render.call(this, data, escapeExpr)
  }

  // Provide the compiled function source as a convenience for precompilation.
  template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}'

  return template
}

tmpl.settings = settings
export default tmpl
