import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AdvancedModeContainer from 'in-websites/eum-alerting/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-websites/eum-alerting/simple/SimpleModeContainer';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
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

  return (
    <BigHeaderDialog
      title={`${editMode ? 'Edit' : 'Create New'} Alert`}
      slideInViewTitle={slideInConfig && slideInConfig.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      titleIconType="lib_alerts_create"
      onClose={onClose}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig && <div className={locals.slideInContainer}>{slideInConfig.component}</div>}
      renderCustomCloseBehaviour={() =>
        !editMode && (
          <Button onClick={() => setSimpleMode(!simpleMode)} kind="action">
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
            editMode={editMode}
            form={form}
            granularity={granularity}
            onChange={onChange}
            onClose={onClose}
            setSliderState={setSliderState(setSlideInConfig, setSlideInViewVisible)}
            timeConfig={timeConfig}
            websiteLabel={websiteLabel}
            onCreate={onCreate}
          />
        )}
        {!simpleMode && (
          <AdvancedModeContainer
            editMode={editMode}
            form={form}
            granularity={granularity}
            onChange={onChange}
            onClose={onClose}
            setSliderState={setSliderState(setSlideInConfig, setSlideInViewVisible)}
            timeConfig={timeConfig}
            websiteLabel={websiteLabel}
            onCreate={onCreate}
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
