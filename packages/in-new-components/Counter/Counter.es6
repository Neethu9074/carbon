import rpt from 'prop-types';
import React from 'react';

import locals from './Counter.mless';

export default Counter;
function Counter({ children }) {
  return <span className={locals.counter}>{children}</span>;
}

Counter.propTypes = {
  children: rpt.node.isRequired
};
