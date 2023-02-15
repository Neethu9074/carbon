/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import {
  ConfigureAssociatedActionsDialogWrapperProps,
  OnSubmit,
  ConfigureAssociatedActionsDialogWrapperState
} from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogWrapper';
import SelectedActions from 'in-automation/ConfigureAssociatedActionsDialog/SelectedActions';
import SelectActions from 'in-automation/ConfigureAssociatedActionsDialog/SelectActions';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import NotificationComponent from 'in-components/form/Notification/Notification';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

import locals from './ConfigureAssociatedActionsDialog.mless';

export type ConfigureAssociatedActionsDialogProps = Pick<
  ConfigureAssociatedActionsDialogWrapperProps,
  'eventSpecification' | 'onClose'
> &
  Pick<ConfigureAssociatedActionsDialogWrapperState, 'setForm' | 'form' | 'isSaving' | 'savingError'> & {
    onSubmit: OnSubmit;
  };

export type ConfigureAssociatedActionsDialogState = {
  slideInViewVisible: boolean;
  setSlideInViewVisible: React.Dispatch<
    React.SetStateAction<ConfigureAssociatedActionsDialogState['slideInViewVisible']>
  >;
};
const formId = 'configure-associated-actions-dialog';
export default function ConfigureAssociatedActionsDialog({
  onSubmit,
  onClose,
  isSaving,
  form,
  setForm,
  eventSpecification,
  savingError
}: ConfigureAssociatedActionsDialogProps) {
  const [slideInViewVisible, setSlideInViewVisible] = useState<
    ConfigureAssociatedActionsDialogState['slideInViewVisible']
  >(false);

  const onSubmitSlideInView = (selectedIds: string[]) => {
    setForm(
      form.updateIn(['actionIds'], field => {
        return (field as Field<string[]>)
          .setValue((field as Field<string[]>).value.concat(selectedIds))
          .setTouched(true);
      })
    );
    setSlideInViewVisible(false);
  };

  return (
    <DialogWithSlideInView
      footer={
        <DialogFooter
          onSecondaryActionClick={onClose}
          secondaryActionText={t('in-events:cancelButton')}
          primaryActionText={t('in-events:saveButton')}
          primaryActionDisabled={isSaving}
          saving={isSaving}
          form={form}
          formId={formId}
          onPrimaryActionClick={onSubmit}
        />
      }
      title={t('in-events:associateActions')}
      slideInViewTitle={t('in-events:addActions')}
      onSlideInViewTitleClick={() => setSlideInViewVisible(false)}
      titleIconType="lib_openclose_add_circle_outline"
      onClose={onClose}
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={
        <SelectActions
          setSlideInViewVisible={setSlideInViewVisible}
          form={form}
          eventSpecification={eventSpecification}
          onSubmit={onSubmitSlideInView}
        />
      }
      doNotCloseOnOutsideClick
      removeBottomPaddingWhenFooterIsShown
    >
      <Form form={form} setForm={form => setForm(form as MapForm)} formId={formId} onSubmit={onSubmit}>
        <div className={locals.dialog}>
          {savingError && (
            <NotificationComponent failure>{t('in-events:failedToSaveAssocations')}</NotificationComponent>
          )}
          <DashboardNotification type="info">{t('in-events:actionsAssociationsNote')}</DashboardNotification>
          <SelectedActions
            setSlideInViewVisible={setSlideInViewVisible}
            form={form}
            setForm={setForm}
            eventSpecification={eventSpecification}
          />
        </div>
      </Form>
    </DialogWithSlideInView>
  );
}
