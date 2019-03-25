import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    name: 'createAnalogClock',
    file: 'dist/index.js',
    format: 'iife'
  }
};
