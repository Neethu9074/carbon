/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import DashboardSwitcherOverlayPresenter from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcherOverlayPresenter';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import Lettering from 'in-components/Lettering';

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
          kind="secondary"
          className={locals.button}
        >
          {isCockpit && <Lettering className={locals.lettering} />}
          {!isCockpit && (activeDashboardTitle || 'Loading…')}
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
