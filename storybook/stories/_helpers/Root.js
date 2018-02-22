import { defaults } from 'lodash';
import React from 'react';

export default function Root({children, style}) {
  return (
    <div style={defaults({}, style, {margin: '1rem'})}>
      {children}
    </div>
  );
}
