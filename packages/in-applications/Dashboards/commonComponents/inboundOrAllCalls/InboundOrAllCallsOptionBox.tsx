/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import OptionBox from 'in-applications/components/OptionBox';
import { boundaryScopes } from 'in-applications/constants';

import locals from './InboundOrAllCallsChoiceHorizontal.mless';

interface InboundOrAllCallsOptionBoxProps {
  boundaryScope: string;
  onBoundaryStateChange: (value: { boundaryScope: string }) => void;
  scope: string;
  noPaddingBottom: boolean;
}
interface BoundaryScopeInfoProps {
  [key: string]: {
    text: string;
    icon: string;
    dashboard: string;
    overrideDefault: string;
  };
}
export default function InboundOrAllCallsOptionBox({
  boundaryScope,
  onBoundaryStateChange,
  scope,
  noPaddingBottom
}: InboundOrAllCallsOptionBoxProps): JSX.Element {
  const boundsaryScopeInfo: BoundaryScopeInfoProps = boundaryScopes.info;
  const { icon, text, dashboard } = boundsaryScopeInfo[scope];
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
      description={dashboard}
      checked={scope === boundaryScope}
      onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
    />
  );
}
