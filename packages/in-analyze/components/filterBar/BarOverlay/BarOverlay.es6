import React from 'react';

import locals from './BarOverlay.mless';

export default function BarOverlay({ children }) {
  return <div className={locals.overlay}>{children}</div>;
}
