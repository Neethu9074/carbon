/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import locals from './Spacer.mless';

export const spaces = [
  'tiny',
  'xxsmall',
  'xsmall',
  'small',
  'normal',
  'medium',
  'large',
  'xlarge',
  'xxlarge',
  'gutter'
];

export default function Spacer({ horizontal, vertical }) {
  return (
    <div className={classNames(locals.spacer, locals[`horizontal-${horizontal}`], locals[`vertical-${vertical}`])} />
  );
}

Spacer.propTypes = {
  horizontal: rpt.oneOf(spaces),
  vertical: rpt.oneOf(spaces)
};
