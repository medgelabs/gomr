function noop() {
  return {}
}

// prevent mocha tests from breaking when trying to require a css file
require.extensions['.css'] = noop