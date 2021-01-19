/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Button from 'in-new-components/Button';

import locals from './LearnMore.mless';

export default function LearnMore({ explanation, href, buttonLabel }) {
  return (
    <p className={locals.explanation}>
      {explanation}

      <span className={locals.buttonWrapper}>
        <Button href={href} kind="primaryv2" target="_blank">
          {buttonLabel}
        </Button>
      </span>
    </p>
  );
}
