import React, { useState } from 'react';

import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button/Button';

import locals from './CreateApplicationDialogPresenter.mless';

export default function CreateApplicationDialogPresenter(props) {
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const {
    simpleMode,
    simpleModeElement,
    advancedModeElement,
    onCreate,
    setSimpleMode,
    trackModeSwitch,
    withTrackClose
  } = props;

  const SimpleMode = simpleModeElement({
    ...props,
    setSimpleModeStep: setSimpleModeStep,
    simpleModeStep: simpleModeStep,
    onCreate: onCreate,
    onClose: withTrackClose
  });

  const AdvancedMode = advancedModeElement({
    ...props,
    onCreate: onCreate,
    onClose: withTrackClose
  });

  return (
    <Dialog
      titleIconType="lib_application"
      title="Create New Application Perspective"
      onClose={() => withTrackClose(simpleMode && simpleModeStep)}
      renderCustomCloseBehaviour={() => (
        <Button
          onClick={() => {
            trackModeSwitch(simpleMode, simpleModeStep);
            const newMode = !simpleMode;
            setSimpleMode(newMode);
          }}
          kind="action"
        >
          {simpleMode ? 'Advanced Mode' : 'Simple Mode'}
        </Button>
      )}
    >
      <div className={locals.dialog}>{simpleMode ? SimpleMode : AdvancedMode}</div>
    </Dialog>
  );
}
