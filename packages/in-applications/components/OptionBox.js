/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import classNames from 'classnames';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import SvgIcon from 'in-components/SvgIcon';

import locals from './OptionBox.mless';

export default function OptionBox({ checked, icon, title, description, onChange, asRadioButton, className }) {
  const labelContent = (
    <Fragment>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <div className={locals.title}>{title}</div>
        <div className={locals.description}>{description}</div>
      </div>
    </Fragment>
  );

  return (
    <div className={classNames(className, locals.wrapper)}>
      <CheckboxFancy
        label={labelContent}
        asRadioButton={asRadioButton}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        size={'large'}
        verticalLabel
      />
    </div>
  );
}
