/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import locals from './TermsProgressIndicator.mless';

export default function TermsProgressIndicator({ pageNumber, nrPages }) {
  const steps = [];
  for (let i = 1; i <= nrPages; i++) {
    if (i < pageNumber) {
      steps.push(
        <SvgIcon
          key={`${i}-icon`}
          className={locals.icon}
          type="lib_check"
          color={themes.default.ids.color.option.white}
          size="regular"
        />
      );
    } else {
      steps.push(
        <div
          key={`${i}-number`}
          className={classNames({
            [locals.pageIndicator]: true,
            [locals.highlightCurrentPage]: pageNumber === i
          })}
        >
          {i}
        </div>
      );
    }

    if (i != nrPages) {
      steps.push(<div key={`${i}-line`} className={locals.line} />);
    }
  }

  return <div className={locals.container}>{steps}</div>;
}
