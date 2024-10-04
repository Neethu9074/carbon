/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/components';

import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonButtonEnabled } from 'in-services/featureFlags';

import locals from './DashboardHeaderButton.mless';

export default forwardRef(function DashboardHeaderButton(
  { darkTheme, expanded, className, kind, size = 'xl', isBreadCrumbButton, ...buttonProps },
  ref
) {
  const Component = expanded != null ? DropdownButton : Button;
  const walkmeId = expanded != null ? 'wm-time-picker' : 'normal-button';
  // temporary till breadcrumb button is migrated
  const isCarbonUsed = carbonButtonEnabled && !isBreadCrumbButton;
  return (
    <div className={isCarbonUsed && darkTheme ? locals.carbonDark : undefined}>
      <Component
        {...buttonProps}
        kind={isCarbonUsed ? (kind ? kind : 'tertiary') : darkTheme ? 'info' : 'secondary'}
        size={size}
        className={classNames(className, {
          [locals.light]: !darkTheme && !isCarbonUsed,
          [locals.dark]: darkTheme && !isCarbonUsed
        })}
        ref={ref}
        data-walkme-id={walkmeId}
        {...(isCarbonUsed ? { darkTheme: darkTheme } : {})}
        //add prop only for drop down button
        {...(expanded != null ? { isBreadCrumbButton: isBreadCrumbButton } : {})}
      />
    </div>
  );
});
