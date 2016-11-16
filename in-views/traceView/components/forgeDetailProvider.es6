/* global require:false */

const context = require.context('../../../in-forge/tracing', true, /\/[a-zA-Z0-9]+\.es6$/);

export default function loadSpanDetailComponent(type, detailViewPath) {
  return context('./' + type + '/' + detailViewPath + '.es6').default;
}
