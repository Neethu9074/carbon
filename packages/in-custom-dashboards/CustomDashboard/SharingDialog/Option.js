/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './Option.mless';

export default function Option({ label, explanation, checked, onChange }) {
  return (
    <CheckboxFancy
      label={
        <span
          className={classNames({
            [locals.label]: true,
            [locals.checked]: checked
          })}
        >
          {label}
        </span>
      }
      explanation={<span className={locals.explanation}>{explanation}</span>}
      size="larger"
      wrapperClassName={locals.checkbox}
      checked={checked}
      onChange={onChange}
      asRadioButton
    />
  );
}
