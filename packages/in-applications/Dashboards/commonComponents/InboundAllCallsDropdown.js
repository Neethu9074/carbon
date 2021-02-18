/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { boundaryScopes } from 'in-applications/constants';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './InboundAllCallsDropdown.mless';

export default function InboundAllCallsDropdown(props) {
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

  return (
    <ComboBoxBehavior
      value={boundaryScope}
      options={[
        { value: 'INBOUND', label: renderItemContent('INBOUND') },
        { value: 'ALL', label: renderItemContent('ALL') }
      ]}
      onChange={value => onBoundaryStateChange({ boundaryScope: value })}
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} expanded={isOpen} kind="secondary" disabled={disabled}>
          <div className={locals.buttonContent}>
            <SvgIcon className={locals.icon} type={boundaryScopes.info[boundaryScope.toUpperCase()].icon} />
            {boundaryScopeLabel}
            {defaultBoundaryScope && (
              <Tooltip
                content={boundaryScopes.info[defaultBoundaryScope.toUpperCase()].overrideDefault}
                align="rightMiddle"
              >
                <SvgIcon className={locals.tooltipIcon} type="lib_help_error_info_outline" size="xs" />
              </Tooltip>
            )}
          </div>
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderItemContent(item) {
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
