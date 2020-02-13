import React from 'react';

import locals from './Key.mless';

export default function Key({ label }) {
  return <span className={locals.label}>{label}</span>;
}
