import { withProps, compose, withState, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import evaluateClassNames from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';

import locals from './AlertConfigDialogPresenter.mless';

export default compose(
  setPropTypes({
    editMode: PropTypes.bool,
    form: PropTypes.object.isRequired,
    renderAdvancedModeComponent: PropTypes.func.isRequired,
    renderSimpleModeComponent: PropTypes.func.isRequired,
    trackModeSwitch: PropTypes.func.isRequired,
    withTrackClose: PropTypes.func.isRequired,
    withTrackCreate: PropTypes.func.isRequired
  }),
  withState('slideInViewVisible', 'setSlideInViewVisible', false),
  withState('slideInConfig', 'setSlideInConfig', null),
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
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
  }),
  withProps(props => {
    return {
      renderSimpleModeComponent: props.renderSimpleModeComponent({
        ...props,
        onCreate: props.withTrackCreate,
        onClose: props.withTrackClose,
        setSliderState: props.setSliderState,
        setSimpleModeStep: props.setSimpleModeStep
      }),

      renderAdvancedModeComponent: props.renderAdvancedModeComponent({
        ...props,
        onClose: props.withTrackClose,
        onCreate: props.withTrackCreate,
        setSliderState: props.setSliderState,
        setSimpleModeStep: props.setSimpleModeStep
      })
    };
  })
)(AlertConfigDialogPresenter);

function AlertConfigDialogPresenter(props) {
  const {
    editMode,
    form,
    renderAdvancedModeComponent,
    renderSimpleModeComponent,
    setSimpleMode,
    setSlideInViewVisible,
    simpleMode,
    simpleModeStep,
    slideInConfig,
    slideInViewVisible,
    trackModeSwitch,
    withTrackClose
  } = props;

  return (
    <BigHeaderDialog
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
              trackModeSwitch(simpleMode, simpleModeStep, form);
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
        {simpleMode ? renderSimpleModeComponent : renderAdvancedModeComponent}
      </div>
    </BigHeaderDialog>
  );
}
