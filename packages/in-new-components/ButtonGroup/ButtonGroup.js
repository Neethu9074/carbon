/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ buttonPropsList, activeKey, segmented, className, ...remainingProps }) {
  return (
    <div
      className={classNames(className, {
        [locals.buttonGroup]: true
      })}
    >
      {buttonPropsList.map((buttonProps, i) => (
        <Button
          key={buttonProps.key}
          {...buttonProps}
          {...remainingProps}
          className={classNames(buttonProps.className, locals.button, {
            [locals.segmented]: segmented,
            [locals.first]: i === 0,
            [locals.last]: i === buttonPropsList.length - 1,
            [locals.active]: activeKey === buttonProps.key
          })}
        >
          {buttonProps.text}
        </Button>
      ))}
    </div>
  );
}
