/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import { t } from 'in-i18n';

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
    featureFeedbackElement, // to be removed after GA
    isGlobalSmartAlert
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
      title={getDialogTitle(isGlobalSmartAlert, editMode)}
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
          {!editMode && simpleMode && (
            <Button
              onClick={() => {
                resetFormDirtyState();
                trackModeSwitch(simpleMode, simpleModeStep, form);
                const newMode = !simpleMode;
                setSimpleMode(newMode);
                resetScrollShadow();
              }}
              kind="action"
            >
              {t(
                'in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterButtonSwitchToAdvancedMode'
              )}
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
}

function getDialogTitle(isGlobalSmartAlert, editMode) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';
  return editMode
    ? t(`in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert${mode}`)
    : t(`in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert${mode}`);
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
  featureFeedbackElement: PropTypes.element,
  initialConfiguredApplications: PropTypes.object,
  isGlobalSmartAlert: PropTypes.bool
};
