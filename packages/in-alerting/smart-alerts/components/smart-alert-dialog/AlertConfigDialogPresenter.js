/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { Title } from 'in-components/Dialog/Header';
import { t } from 'in-i18n';

import locals from './AlertConfigDialogPresenter.mless';

export default function AlertConfigDialogPresenter(props) {
  const {
    editMode,
    form,
    formId,
    handleSubmit,
    AdvancedModeElement,
    SimpleModeElement,
    setSimpleMode,
    simpleMode,
    trackModeSwitch,
    withTrackClose,
    withTrackCreate,
    updateForm,
    footer,
    featureFeedbackElement, // to be removed after GA
    isGlobalSmartAlert
  } = props;

  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideInConfig] = useState(null);
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState({
    title: null,
    onClose: null
  });

  const builtIn = form.get('builtIn')?.value;

  const setSliderState = ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  return (
    <DialogWithSlideInView
      footer={footer}
      title={getDialogTitle(isGlobalSmartAlert, editMode, builtIn)}
      slideInViewTitle={customSlideInHeaderConfig.title ?? slideInConfig?.title}
      onSlideInViewTitleClick={() =>
        customSlideInHeaderConfig.onClose
          ? customSlideInHeaderConfig.onClose()
          : setSlideInViewVisible(!slideInViewVisible)
      }
      titleIconType="lib_alerts_create"
      onClose={() => withTrackClose(simpleMode && simpleModeStep)}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
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
      removeBottomPaddingWhenFooterIsShown
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
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
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          />
        ) : (
          <AdvancedModeElement
            {...props}
            onCreate={withTrackCreate}
            onClose={withTrackClose}
            setSliderState={setSliderState}
            setSimpleModeStep={setSimpleModeStep}
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          />
        )}
      </form>
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

function getDialogTitle(isGlobalSmartAlert, editMode, builtIn) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';
  return (
    <HorizontalFlexWrapper className={locals.titleWrapper}>
      <Title
        title={
          editMode
            ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert', {
                context: mode
              })
            : t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert', {
                context: mode
              })
        }
      />
      <BuiltInIndicator builtIn={builtIn} />
    </HorizontalFlexWrapper>
  );
}

AlertConfigDialogPresenter.propTypes = {
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ),
  stepRenderers: PropTypes.arrayOf(PropTypes.func).isRequired,
  step: PropTypes.number,
  AdvancedModeElement: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  SimpleModeElement: PropTypes.func.isRequired,
  footer: PropTypes.node,
  trackModeSwitch: PropTypes.func.isRequired,
  updateForm: PropTypes.func,
  withTrackClose: PropTypes.func.isRequired,
  withTrackCreate: PropTypes.func.isRequired,
  simpleMode: PropTypes.bool,
  setSimpleMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  featureFeedbackElement: PropTypes.element,
  initialConfiguredApplications: PropTypes.object,
  isGlobalSmartAlert: PropTypes.bool
};
