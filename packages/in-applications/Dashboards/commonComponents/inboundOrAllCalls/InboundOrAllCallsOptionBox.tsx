/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import OptionBox from 'in-applications/components/OptionBox';
import { boundaryScopes } from 'in-applications/constants';

import locals from './InboundOrAllCallsChoiceHorizontal.mless';

export default function InboundOrAllCallsOptionBox({
  boundaryScope,
  onBoundaryStateChange,
  scope,
  noPaddingBottom,
  apCreation
}) {
  const { icon, text, dashboard, creation } = boundaryScopes.info[scope];
  return (
    <OptionBox
      icon={icon}
      title={text}
      asRadioButton
      className={classNames({
        [locals.optionBox]: true,
        [locals.noPaddingBottom]: noPaddingBottom,
        [locals.optionBoxUnchecked]: scope !== boundaryScope
      })}
      description={apCreation ? creation : dashboard}
      checked={scope === boundaryScope}
      onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
    />
  );
}
