/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem } from '@instana/components';
import { ApplicationBoundaryScope } from '@instana/types';

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
    <MenuButton
      id="inboundallcalls"
      kind="tertiary"
      size="sm"
      menuAlignment="bottom-end"
      //@ts-expect-error
      label={
        <div className={locals.menubutton}>
          <SvgIcon
            className={locals.icon}
            type={boundaryScopeInfo.icon}
            color="currentColor"
            size="xs"
            aria-label={boundaryScopeLabel}
          />
          {boundaryScopeLabel}
          {defaultBoundaryScope && !disabled ? (
            <Tooltip content={defaultBoundarySCopeInfo} align="topRight">
              <SvgIcon className={locals.tooltipIcon} type="lib_help_error_info_outline" size="xs" />
            </Tooltip>
          ) : null}
        </div>
      }
      title={boundaryScopeLabel}
      disabled={disabled}
    >
      <MenuItem
        //@ts-expect-error
        label={renderItemContent('INBOUND')}
        onClick={() => onBoundaryStateChange({ boundaryScope: 'INBOUND' })}
        className={classNames({
          [locals.menuitem]: true,
          [locals.selected]: boundaryScope === 'INBOUND'
        })}
        aria-label={getLabel('INBOUND')}
      />
      <MenuItem
        //@ts-expect-error
        label={renderItemContent('ALL')}
        onClick={() => onBoundaryStateChange({ boundaryScope: 'ALL' })}
        className={classNames({
          [locals.menuitem]: true,
          [locals.selected]: boundaryScope === 'ALL'
        })}
        aria-label={getLabel('ALL')}
      />
    </MenuButton>
  );
}

function getLabel(item: ApplicationBoundaryScope) {
  const { text } = boundaryScopes.info[item];
  return text;
}

function renderItemContent(item: ApplicationBoundaryScope) {
  const { icon, text, dashboard } = boundaryScopes.info[item];
  return (
    <div className={locals.option} title="">
      <SvgIcon className={locals.optionIcon} type={icon} aria-label={text} />
      <div className={locals.optionText}>
        <div className={locals.label}>{text}</div>
        <div className={locals.description}>{dashboard}</div>
      </div>
    </div>
  );
}
