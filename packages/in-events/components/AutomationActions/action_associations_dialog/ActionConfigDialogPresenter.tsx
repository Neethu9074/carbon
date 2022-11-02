/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, ReactNode } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import {
  MessageType,
  SetSliderStateProps
} from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { emptyObject } from 'in-services/fixedObjects';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionConfigDialogPresenter.mless';

interface SimpleModeElementProps {
  step: number;
  stepConfigs: {
    title: string;
    validateIntermediately?: string[][];
  }[];
  messages: MessageType[];
  stepRenderers: ((props: any) => JSX.Element)[];
  onCreate: () => void;
  onClose: () => void;
  setSliderState: ({ slideInConfig, isVisible }: SetSliderStateProps) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<
    React.SetStateAction<{
      title: null;
      onClose: null;
    }>
  >;
}

interface ActionConfigDialogPresenterProps {
  actions: Action[];
  withTrackClose: () => void;
  applicationLabel: string;
  messages: MessageType[];
  withTrackCreate: () => void;
  handleSubmit: () => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  form: MapForm;
  step: number;
  formId: string;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  footer: ReactNode;
  isSaving: boolean;
  stepConfigs: {
    title: string;
    validateIntermediately?: string[][];
  }[];
  stepRenderers: ((props: any) => JSX.Element)[];
  SimpleModeElement: (props: SimpleModeElementProps) => JSX.Element;
}

export default function ActionConfigDialogPresenter(props: ActionConfigDialogPresenterProps) {
  const { formId, handleSubmit, SimpleModeElement, withTrackClose, withTrackCreate, footer } = props;

  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideInConfig] = useState<{ component?: ReactNode; title?: string }>(emptyObject);
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState({
    title: null,
    onClose: null
  });

  const setSliderState = ({ slideInConfig, isVisible }: SetSliderStateProps) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  return (
    <DialogWithSlideInView
      footer={footer}
      title={t('in-events:associateActions')}
      slideInViewTitle={customSlideInHeaderConfig.title ?? slideInConfig?.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      titleIconType="lib_openclose_add_circle_outline"
      onClose={withTrackClose}
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      doNotCloseOnOutsideClick
      removeBottomPaddingWhenFooterIsShown
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        className={classNames({
          [locals.dialog]: true
        })}
      >
        <SimpleModeElement
          {...props}
          onCreate={withTrackCreate}
          onClose={withTrackClose}
          setSliderState={setSliderState}
          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
        />
      </form>
    </DialogWithSlideInView>
  );
}
