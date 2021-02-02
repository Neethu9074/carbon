/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button/Button';
import { t } from 'in-i18n';

import locals from './CreateApplicationDialogPresenter.mless';

export default function CreateApplicationDialogPresenter(props) {
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  const {
    simpleMode,
    SimpleModeElement,
    AdvancedModeElement,
    onCreate,
    setSimpleMode,
    trackModeSwitch,
    withTrackClose
  } = props;

  const SimpleMode = SimpleModeElement({
    ...props,
    setSimpleModeStep: setSimpleModeStep,
    simpleModeStep: simpleModeStep,
    onCreate: onCreate,
    onClose: withTrackClose
  });

  const AdvancedMode = AdvancedModeElement({
    ...props,
    onCreate: onCreate,
    onClose: withTrackClose
  });

  return (
    <Dialog
      titleIconType="lib_application"
      title={t('in-applications:creation.newAP')}
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
          {simpleMode
            ? t('in-applications:creation.switchAdvancedMode')
            : t('in-applications:creation.switchSimpleMode')}
        </Button>
      )}
      withoutBodyPadding
    >
      <div className={simpleMode ? locals.simpleDialog : locals.advancedDialog}>
        {simpleMode ? SimpleMode : AdvancedMode}
      </div>
    </Dialog>
  );
}
