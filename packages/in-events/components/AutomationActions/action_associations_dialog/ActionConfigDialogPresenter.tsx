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
  SetSliderStateProps,
  EventProps
} from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import SelectActions from 'in-events/components/AutomationActions/action_associations_dialog/selectActions';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { emptyObject } from 'in-services/fixedObjects';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionConfigDialogPresenter.mless';

interface ActionConfigDialogPresenterProps {
  actions: Action[];
  eventDetails: EventProps;
  withTrackClose: () => void;
  applicationLabel: string;
  messages: MessageType[];
  withTrackCreate: () => void;
  handleSubmit: () => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  form: MapForm;
  formId: string;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  footer: ReactNode;
  isSaving: boolean;
  numberOfActionChannelListRows?: number;
}

export default function ActionConfigDialogPresenter(props: ActionConfigDialogPresenterProps) {
  const { formId, handleSubmit, withTrackClose, footer } = props;

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
        <div className={locals.actionContainer}>
          <SelectActions
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
            numberOfActionChannelListRows={5}
            setSliderState={setSliderState}
            {...props}
          />
        </div>
      </form>
    </DialogWithSlideInView>
  );
}
