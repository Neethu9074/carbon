/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import DashboardSwitcherOverlayPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherOverlayPresenter';
import DropdownButton from 'in-components/Button/DropdownButton';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './DashboardSwitcherOverlayPresenter.mless';

export default function DashboardSwitcherPresenter(props) {
  const { activeDashboardTitle } = props;

  const buttonContent =
    activeDashboardTitle || t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherPresenter.loading');
  return (
    <Overlay withoutWrapper content={DashboardSwitcherOverlayPresenter} props={props}>
      {({ toggle, isOpen, refSetter }) => (
        <DropdownButton
          spanClassName={locals.dashboardLongName_ellipses}
          className={locals.dashboardDropdownButton}
          expanded={isOpen}
          onClick={toggle}
          refSetter={refSetter}
          size="normal"
          kind="tertiary"
          iconSize="xs"
          title={buttonContent}
        >
          {buttonContent}
        </DropdownButton>
      )}
    </Overlay>
  );
}

if (__DEV__) {
  DashboardSwitcherPresenter.propTypes = {
    ...DashboardSwitcherOverlayPresenter.propTypes,
    activeDashboardTitle: rpt.string.isRequired
  };

  // Close is provided by the Overlay wrapper around
  // DashboardSwitcherOverlayPresenter
  delete DashboardSwitcherPresenter.propTypes.close;
}
