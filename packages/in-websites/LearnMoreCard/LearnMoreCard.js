/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Card } from '@instana/components';

import locals from './LearnMoreCard.mless';

export default function LearnMoreCard({
  title,
  explanation,
  learnMoreHref,
  learnMoreLabel,
  className,
  useMaxAvailableHeight = false
}) {
  return (
    <Card title={title} className={className} useMaxAvailableHeight={useMaxAvailableHeight}>
      <p className={locals.explanation}>{explanation}</p>
      <div className={locals.actionWrapper}>
        <Button href={learnMoreHref} kind="primaryv2" target="_blank">
          {learnMoreLabel}
        </Button>
      </div>
    </Card>
  );
}
