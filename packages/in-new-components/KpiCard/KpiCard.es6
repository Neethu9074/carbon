import React from 'react';

import Card from 'in-new-components/Card';

import locals from './KpiCard.mless';

export default function KpiCard({ title, value, suffix }) {
  return (
    <Card title={title}>
      <span className={locals.value}>{value}</span>
      {suffix != null && <span className={locals.suffix}>{suffix}</span>}
    </Card>
  );
}
