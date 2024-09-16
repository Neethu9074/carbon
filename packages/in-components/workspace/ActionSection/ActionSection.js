/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './ActionSection.mless';

export function ActionSection({ left, right }) {
  return (
    <div className={locals.section}>
      <div className={locals.left}>{left}</div>

      <div className={locals.right}>{right}</div>
    </div>
  );
}

export function Action(props) {
  const { disabledTooltip, ...otherProps } = props;

  const button = <Button {...otherProps} kind="subtle" size="compact" className={locals.button} />;
  if (props.disabled && disabledTooltip) {
    return <Tooltip content={disabledTooltip}>{button}</Tooltip>;
  }
  return button;
}
