import React from 'react';

import locals from './KpiLabel.mless';

export default function KpiLabel({ label }) {
  return <div className={locals.label}>{label}</div>;
}
