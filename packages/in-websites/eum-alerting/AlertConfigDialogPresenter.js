import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-websites/eum-alerting/tracker';
import AdvancedModeContainer from 'in-websites/eum-alerting/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-websites/eum-alerting/simple/SimpleModeContainer';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import { modeAdvanced, modeSimple } from 'in-websites/eum-alerting/constants';
import { getBlueprintObject } from 'in-websites/eum-alerting/trackingHelpers';
import evaluateClassNames from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';

import locals from './AlertConfigDialogPresenter.mless';

export default function AlertConfigDialogPresenter({
  editMode,
  form,
  granularity,
  onChange,
  onClose,
  onCreate,
  timeConfig,
  websiteLabel
}) {
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideInConfig] = useState(null);
  const [simpleMode, setSimpleMode] = useState(!editMode);
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  return (
    <BigHeaderDialog
      title={`${editMode ? 'Edit' : 'Create New'} Alert`}
      slideInViewTitle={slideInConfig && slideInConfig.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      titleIconType="lib_alerts_create"
      onClose={withTrackOnClose(onClose, simpleMode && simpleModeStep, form)}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig && <div className={locals.slideInContainer}>{slideInConfig.component}</div>}
      renderCustomCloseBehaviour={() =>
        !editMode && (
          <Button
            onClick={() => {
              withTrackModeSwitch(simpleMode, simpleModeStep, form);
              setSimpleMode(!simpleMode);
            }}
            kind="action"
          >
            {simpleMode ? 'Switch to Advanced Mode' : 'Switch to Simple Mode'}
          </Button>
        )
      }
    >
      <div
        className={evaluateClassNames({
          [locals.dialog]: true,
          [locals.advancedMode]: !simpleMode
        })}
      >
        {simpleMode && (
          <SimpleModeContainer
            setSimpleModeStep={setSimpleModeStep}
            editMode={editMode}
            form={form}
            granularity={granularity}
            onChange={onChange}
            onClose={withTrackOnClose(onClose, simpleModeStep, form)}
            setSliderState={setSliderState(setSlideInConfig, setSlideInViewVisible)}
            timeConfig={timeConfig}
            websiteLabel={websiteLabel}
            onCreate={withTrackOnCreate(onCreate, simpleMode)}
          />
        )}
        {!simpleMode && (
          <AdvancedModeContainer
            editMode={editMode}
            form={form}
            granularity={granularity}
            onChange={onChange}
            onClose={withTrackOnClose(onClose, null, form)}
            setSliderState={setSliderState(setSlideInConfig, setSlideInViewVisible)}
            timeConfig={timeConfig}
            websiteLabel={websiteLabel}
            onCreate={withTrackOnCreate(onCreate, simpleMode)}
          />
        )}
      </div>
    </BigHeaderDialog>
  );
}

AlertConfigDialogPresenter.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

function setSliderState(setSlideInConfig, setSlideInViewVisible) {
  return ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };
}

function withTrackOnClose(onClose, trackingConfig, form) {
  return () => {
    if (trackingConfig) {
      websitesAlertingCloseDialog({ step: trackingConfig, ...getBlueprintObject(form) });
    } else {
      websitesAlertingCloseDialog({ mode: modeAdvanced, ...getBlueprintObject(form) });
    }
    onClose();
  };
}

function withTrackModeSwitch(simpleMode, step, form) {
  if (simpleMode) {
    websitesAlertingSwitchMode({
      destinationMode: modeAdvanced,
      step,
      ...getBlueprintObject(form)
    });
  } else {
    websitesAlertingSwitchMode({
      destinationMode: modeSimple,
      ...getBlueprintObject(form)
    });
  }
}

function withTrackOnCreate(onCreate, simpleMode) {
  return () => {
    websitesAlertingAlertCreated({ mode: simpleMode ? modeSimple : modeAdvanced });
    onCreate();
  };
}
