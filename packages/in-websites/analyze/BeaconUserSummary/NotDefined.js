/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import Button from 'in-new-components/Button';

import locals from './NotDefined.mless';

export default function NotDefined({ explanation, learnMoreHref, learnMoreLabel }) {
  return (
    <Fragment>
      <p className={locals.explanation}>{explanation}</p>

      {learnMoreHref && (
        <div className={locals.actionWrapper}>
          <Button href={learnMoreHref} kind="primaryv2" target="_blank">
            {learnMoreLabel}
          </Button>
        </div>
      )}
    </Fragment>
  );
}
