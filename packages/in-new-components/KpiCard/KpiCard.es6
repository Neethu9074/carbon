import React from 'react';

import Card from 'in-new-components/Card';

import locals from './KpiCard.mless';

export default function KpiCard({ title, value }) {
  let major = '––';
  let minor = null;

  if (value != null) {
    const match = String(value).match(/^([0-9\,\.]+)(.*)$/);
    if (!match) {
      major = value;
    } else {
      major = match[1];
      minor = match[2];
    }
  }

  return (
    <Card title={title}>
      <span className={locals.major}>{major}</span>
      {minor && <span className={locals.minor}>{minor}</span>}
    </Card>
  );
}
