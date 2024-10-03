/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import DashboardSwitcherOverlayPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherOverlayPresenter';
import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import Overlay from 'in-components/overlays/Overlay';
import Lettering from 'in-components/Lettering';
import { t } from 'in-i18n';

import locals from './DashboardSwitcherPresenter.mless';

export default function DashboardSwitcherPresenter(props) {
  const { activeDashboardTitle, isCockpit } = props;

  return (
    <Overlay withoutWrapper content={DashboardSwitcherOverlayPresenter} props={props}>
      {({ toggle, isOpen, refSetter }) => (
        <DropdownButton
          expanded={isOpen}
          onClick={toggle}
          refSetter={refSetter}
          size="normal"
          kind={carbonButtonEnabled ? 'tertiary' : 'secondary'}
          className={locals.button}
          iconSize={carbonButtonEnabled ? 'xs' : 'regular'}
        >
          {carbonButtonEnabled &&
            (activeDashboardTitle || t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherPresenter.loading'))}
          {!carbonButtonEnabled && isCockpit && <Lettering className={locals.lettering} tag="h1" />}
          {!carbonButtonEnabled && !isCockpit && (
            <h1 className={locals.normalText}>
              {activeDashboardTitle || t('in-custom-dashboards:dashboardSwitcher.dashboardSwitcherPresenter.loading')}
            </h1>
          )}
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
