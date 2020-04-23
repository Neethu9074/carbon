import { withProps, compose, withState, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

import BigHeaderDialogWithSlideInView from 'in-new-components/BigHeaderDialog/BigHeaderDialogWithSlideInView';
import evaluateClassNames from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';

import locals from './AlertConfigDialogPresenter.mless';

export default compose(
  setPropTypes({
    editMode: PropTypes.bool,
    form: PropTypes.object.isRequired,
    advancedModeElement: PropTypes.func.isRequired,
    simpleModeElement: PropTypes.func.isRequired,
    trackModeSwitch: PropTypes.func.isRequired,
    withTrackClose: PropTypes.func.isRequired,
    withTrackCreate: PropTypes.func.isRequired,
    simpleMode: PropTypes.bool.isRequired,
    setSimpleMode: PropTypes.func.isRequired
  }),
  withState('slideInViewVisible', 'setSlideInViewVisible', false),
  withState('slideInConfig', 'setSlideInConfig', null),
  withState('simpleModeStep', 'setSimpleModeStep', 0),
  withProps(props => {
    return {
      setSliderState: ({ slideInConfig, isVisible }) => {
        if (slideInConfig) {
          props.setSlideInConfig(slideInConfig);
        }
        props.setSlideInViewVisible(isVisible);
      }
    };
  })
)(AlertConfigDialogPresenter);

function AlertConfigDialogPresenter(props) {
  const {
    editMode,
    form,
    advancedModeElement,
    simpleModeElement,
    setSimpleMode,
    setSlideInViewVisible,
    simpleMode,
    simpleModeStep,
    slideInConfig,
    slideInViewVisible,
    trackModeSwitch,
    withTrackClose,
    withTrackCreate,
    setSliderState,
    setSimpleModeStep,
    updateForm
  } = props;

  const SimpleMode = simpleModeElement({
    ...props,
    onCreate: withTrackCreate,
    onClose: withTrackClose,
    setSliderState: setSliderState,
    setSimpleModeStep: setSimpleModeStep
  });

  const AdvancedMode = advancedModeElement({
    ...props,
    onClose: withTrackClose,
    onCreate: withTrackCreate,
    setSliderState: setSliderState,
    setSimpleModeStep: setSimpleModeStep
  });
  return (
    <BigHeaderDialogWithSlideInView
      title={`${editMode ? 'Edit' : 'Create New'} Alert`}
      slideInViewTitle={slideInConfig && slideInConfig.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      titleIconType="lib_alerts_create"
      onClose={() => withTrackClose(simpleMode && simpleModeStep)}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig && <div className={locals.slideInContainer}>{slideInConfig.component}</div>}
      renderCustomCloseBehaviour={() =>
        !editMode && (
          <Button
            onClick={() => {
              resetFormDirtyState();
              trackModeSwitch(simpleMode, simpleModeStep, form);
              const newMode = !simpleMode;
              setSimpleMode(newMode);
              updateChartForBaselineSupportedBlueprint(newMode);
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
        {simpleMode ? SimpleMode : AdvancedMode}
      </div>
    </BigHeaderDialogWithSlideInView>
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
