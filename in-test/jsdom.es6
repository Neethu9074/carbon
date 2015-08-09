/*eslint-env mocha,node*/



import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import mochaJsdom from 'mocha-jsdom';

import setupWebSocketGlobals from './setupWebSocketGlobals';

export default function jsdomReact() {
  mochaJsdom({
    useEach: true,
    skipWindowCheck: true
  });

  ExecutionEnvironment.canUseDOM = true;

  beforeEach(() => {
    setupWebSocketGlobals();
  });
}
