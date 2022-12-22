/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

// import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { MessageType, EventProps } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import ActionConfigDialogPresenter from 'in-events/components/AutomationActions/action_associations_dialog/ActionConfigDialogPresenter';
// import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { Action } from 'in-types';
import { stepRenderers } from 'in-events/components/AutomationActions/action_associations_dialog/steps/simpleModeSteps';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { t } from 'in-i18n';

interface ActionConfigDialogProps {
  actions: Action[];
  withTrackClose: () => void;
  applicationLabel: string;
  withTrackCreate: () => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  messages: MessageType[];
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  isSaving: boolean;
  eventDetails: EventProps;
}

export default function ActionConfigDialog(props: ActionConfigDialogProps) {
  const ACTION_ASSOCIATION_FORM_ID = 'action-association-editor';
  const { form, withTrackCreate, withTrackClose, isSaving } = props;

  // const { step, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
  //   // stepConfigs,
  //   form,
  //   setForm,
  //   onCreate: withTrackCreate,
  //   onClose: withTrackClose,
  //   onStepChanged: () => {}
  // });

  const footer = (
    <DialogFooter
      onSecondaryActionClick={withTrackClose}
      secondaryActionText={t('in-events:cancelButton')}
      primaryActionText={t('in-events:saveButton')}
      primaryActionDisabled={isSaving}
      saving={isSaving}
      form={form}
      onPrimaryActionClick={withTrackCreate}
      // renderCustomSaveAction={() => (
      //   <SaveButton type="submit" kind="create" disabled={isSaving}>
      //     {numberOfItems
      //       ? t('in-settings:tabs.addNumberOfItemsAction', {
      //           count: numberOfItems
      //         })
      //       : t('in-settings:tabs.addActions')}
      //   </SaveButton>
      // )}
    />
  );

  return (
    <ActionConfigDialogPresenter
      {...props}
      // stepConfigs={stepConfigs}
      stepRenderers={stepRenderers}
      step={0}
      formId={ACTION_ASSOCIATION_FORM_ID}
      handleSubmit={withTrackCreate}
      footer={footer}
      SimpleModeElement={SimpleModeContainer}
    />
  );
}
