import rpt from 'prop-types';
import React from 'react';

import locals from './Dot.mless';

export default Dot;
function Dot({ color = '#a5b6be' }) {
  return <span style={{ background: color }} className={locals.dot} />;
}

Dot.propTypes = {
  color: rpt.string
};
