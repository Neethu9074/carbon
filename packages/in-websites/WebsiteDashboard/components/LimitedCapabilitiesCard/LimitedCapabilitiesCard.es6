import React from 'react';

import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';

import locals from './LimitedCapabilitiesCard.mless';

export default function LimitedCapabilitiesCard({ cardTitle, explanation, learnMoreHref, learnMoreLabel, className }) {
  return (
    <Card title={cardTitle} className={className}>
      <p className={locals.explanation}>{explanation}</p>
      <div className={locals.actionWrapper}>
        <Button href={learnMoreHref} kind="primaryv2" target="_blank">
          {learnMoreLabel}
        </Button>
      </div>
    </Card>
  );
}
