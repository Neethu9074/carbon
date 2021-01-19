/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import Button from 'in-new-components/Button/Button';

import locals from './AlertConfigDialogPresenter.mless';

export default function AlertConfigDialogPresenter(props) {
  const {
    editMode,
    form,
    AdvancedModeElement,
    SimpleModeElement,
    setSimpleMode,
    simpleMode,
    trackModeSwitch,
    withTrackClose,
    withTrackCreate,
    updateForm,
    featureFeedbackElement // to be removed after GA
  } = props;

  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideInConfig] = useState(null);
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const setSliderState = ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  return (
    <DialogWithSlideInView
      title={`${editMode ? 'Edit' : 'Create New'} Alert`}
      slideInViewTitle={slideInConfig && slideInConfig.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      titleIconType="lib_alerts_create"
      onClose={() => withTrackClose(simpleMode && simpleModeStep)}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig && <div className={locals.slideInContainer}>{slideInConfig.component}</div>}
      renderCustomCloseBehaviour={resetScrollShadow => (
        <>
          {featureFeedbackElement}
          {!editMode && (
            <Button
              onClick={() => {
                resetFormDirtyState();
                trackModeSwitch(simpleMode, simpleModeStep, form);
                const newMode = !simpleMode;
                setSimpleMode(newMode);
                updateChartForBaselineSupportedBlueprint(newMode);
                resetScrollShadow();
              }}
              kind="action"
            >
              {simpleMode ? 'Switch to Advanced Mode' : 'Switch to Simple Mode'}
            </Button>
          )}
        </>
      )}
    >
      <div
        className={classNames({
          [locals.dialog]: true,
          [locals.advancedMode]: !simpleMode
        })}
      >
        {simpleMode ? (
          <SimpleModeElement
            {...props}
            onCreate={withTrackCreate}
            onClose={withTrackClose}
            setSliderState={setSliderState}
            setSimpleModeStep={setSimpleModeStep}
          />
        ) : (
          <AdvancedModeElement
            {...props}
            onCreate={withTrackCreate}
            onClose={withTrackClose}
            setSliderState={setSliderState}
            setSimpleModeStep={setSimpleModeStep}
          />
        )}
      </div>
    </DialogWithSlideInView>
  );

  /**
   * Reset the dirty state of the form, to be in a clean state in teh respective mode.
   * This prevents that buttons are disabled when violators evaluate to false and dirty state is true.
   */
  function resetFormDirtyState() {
    if (!form.hierarchyValid) {
      updateForm(form.setTouched(false, { recurse: true }));
    }
  }

  /**
   * Trigger update of the chart when switching back to Simple Mode, and a baseline-supported blueprint is selected.
   * So that the re re-request the threshold/baseline according to the fallback logic.
   * In all other cases, it is currently not needed to refresh the chart, because there is no baseline (yet).
   * @param simpleMode Whether simple mode is active or not.
   */
  function updateChartForBaselineSupportedBlueprint(simpleMode) {
    if (!simpleMode) {
      return;
    }

    const alertType = form.get('rule').get('alertType').value;
    if (alertType === 'slowness') {
      updateForm(form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true)));
    }
  }
}

AlertConfigDialogPresenter.propTypes = {
  AdvancedModeElement: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  SimpleModeElement: PropTypes.func.isRequired,
  trackModeSwitch: PropTypes.func.isRequired,
  updateForm: PropTypes.func,
  withTrackClose: PropTypes.func.isRequired,
  withTrackCreate: PropTypes.func.isRequired,
  simpleMode: PropTypes.bool.isRequired,
  setSimpleMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  featureFeedbackElement: PropTypes.element
};
