/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';
import { SvgIcon } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { boundaryScopes } from 'in-applications/constants';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './InboundAllCallsDropdown.mless';

interface Props {
  boundaryScope?: string;
  data?: any;
  disabled: boolean;
  onBoundaryStateChange: (value: { boundaryScope: string }) => void;
}
interface BoundaryScopeInfoProps {
  text: string;
  icon: string;
  dashboard: string;
  overrideDefault: string;
}

interface OptionProps {
  value: string;
  label: any;
}
export default function InboundAllCallsDropdown(props: Props) {
  const { boundaryScope: urlBoundaryScope, data: application, disabled, onBoundaryStateChange } = props;
  const defaultBoundaryScope = application?.boundaryScope;
  const boundaryScope = disabled ? 'ALL' : urlBoundaryScope || defaultBoundaryScope;
  if (!boundaryScope) {
    return null;
  }
  const boundaryScopeLabel =
    boundaryScope === 'ALL'
      ? t('in-applications:inboundOutboundCalls.config.all.text')
      : t('in-applications:inboundOutboundCalls.config.inbound.text');

  const upperCaseBoundaryScope = boundaryScope?.toUpperCase() as ApplicationBoundaryScope;
  const boundaryScopeInfo: BoundaryScopeInfoProps = boundaryScopes.info[upperCaseBoundaryScope];
  const upperCaseDefaultBoundaryScope = defaultBoundaryScope?.toUpperCase() as ApplicationBoundaryScope;
  const defaultBoundarySCopeInfo = boundaryScopes.info[upperCaseDefaultBoundaryScope]?.overrideDefault;
  return (
    <ComboBoxBehavior
      value={boundaryScope}
      options={
        [
          { value: 'INBOUND', label: renderItemContent('INBOUND') },
          { value: 'ALL', label: renderItemContent('ALL') }
        ] as OptionProps[]
      }
      onChange={value => onBoundaryStateChange({ boundaryScope: value })}
    >
      {({ elementProps, isOpen }) => (
        // @ts-expect-error not fully matching expected type
        <DropdownButton {...elementProps} expanded={isOpen} kind="secondary" disabled={disabled}>
          <div className={locals.buttonContent}>
            <SvgIcon className={locals.icon} type={boundaryScopeInfo.icon} color="currentColor" />
            {boundaryScopeLabel}
            {defaultBoundaryScope && !disabled ? (
              <Tooltip content={defaultBoundarySCopeInfo} align="leftMiddle">
                <SvgIcon className={locals.tooltipIcon} type="lib_help_error_info_outline" size="xs" />
              </Tooltip>
            ) : null}
          </div>
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderItemContent(item: ApplicationBoundaryScope) {
  const { icon, text, dashboard } = boundaryScopes.info[item];
  return (
    <div className={locals.option}>
      <SvgIcon className={locals.optionIcon} type={icon} />
      <div className={locals.optionText}>
        <div className={locals.label}>{text}</div>
        <div className={locals.description}>{dashboard}</div>
      </div>
    </div>
  );
}
