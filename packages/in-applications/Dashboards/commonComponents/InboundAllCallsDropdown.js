import React from 'react';

import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { boundaryScopes } from 'in-applications/constants';
import { capitalize } from 'in-services/formatters/string';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './InboundAllCallsDropdown.mless';

export default function InboundAllCallsDropdown(props) {
  const { boundaryScope: urlBoundaryScope, data: application, defaultBoundaryScope, disabled } = props;
  const boundaryScope = disabled ? 'ALL' : urlBoundaryScope || application.boundaryScope;

  const boundaryScopeLabel = capitalize(boundaryScope);
  return (
    <>
      {boundaryScope && (
        <Overlay withoutWrapper content={InboundAllCallsDropdownOverlay} props={props}>
          {({ toggle, isOpen, refSetter }) => (
            <DropdownButton
              expanded={isOpen}
              onClick={toggle}
              refSetter={refSetter}
              kind="secondary"
              disabled={disabled}
            >
              <div className={locals.buttonContent}>
                <SvgIcon className={locals.icon} type={boundaryScopes.info[boundaryScope.toUpperCase()].icon} />
                {boundaryScopeLabel} Calls
                <Tooltip
                  content={boundaryScopes.info[defaultBoundaryScope.toUpperCase()].overrideDefault}
                  align="rightMiddle"
                >
                  <SvgIcon className={locals.tooltipIcon} type="lib_help_error_info_outline" size="xs" />
                </Tooltip>
              </div>
            </DropdownButton>
          )}
        </Overlay>
      )}
    </>
  );
}

function InboundAllCallsDropdownOverlay(props) {
  const { boundaryScope: urlBoundaryScope, data: application, onBoundaryStateChange } = props;
  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  return (
    <div className={locals.overlay}>
      <InboundOrAllCallsChoiceVertical boundaryScope={boundaryScope} onBoundaryStateChange={onBoundaryStateChange} />
    </div>
  );
}
