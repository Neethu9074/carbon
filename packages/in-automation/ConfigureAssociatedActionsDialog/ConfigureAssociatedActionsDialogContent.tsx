/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import {
  ConfigureAssociatedActionsDialogProps,
  OnSubmit,
  ConfigureAssociatedActionsDialogState
} from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import SelectedActions from 'in-automation/ConfigureAssociatedActionsDialog/SelectedActions';
import SelectActions from 'in-automation/ConfigureAssociatedActionsDialog/SelectActions';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import NotificationComponent from 'in-components/form/Notification/Notification';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

import locals from './ConfigureAssociatedActionsDialog.mless';

const formId = 'configure-associated-actions-dialog';

export type ConfigureAssociatedActionsDialogContentProps = Pick<
  ConfigureAssociatedActionsDialogProps,
  'eventSpecification' | 'onClose'
> &
  Pick<ConfigureAssociatedActionsDialogState, 'setForm' | 'form' | 'isSaving' | 'savingError'> & {
    onSubmit: OnSubmit;
  };

export type ConfigureAssociatedActionsDialogContentState = {
  slideInViewVisible: boolean;
  setSlideInViewVisible: React.Dispatch<
    React.SetStateAction<ConfigureAssociatedActionsDialogContentState['slideInViewVisible']>
  >;
};

export default function ConfigureAssociatedActionsDialog({
  onSubmit,
  onClose,
  isSaving,
  form,
  setForm,
  eventSpecification,
  savingError
}: ConfigureAssociatedActionsDialogContentProps) {
  const [slideInViewVisible, setSlideInViewVisible] =
    useState<ConfigureAssociatedActionsDialogContentState['slideInViewVisible']>(false);

  return (
    <DialogWithSlideInView
      footer={
        <DialogFooter
          onSecondaryActionClick={onClose}
          secondaryActionText={t('forms.actions.cancel')}
          primaryActionText={t('forms.actions.save')}
          primaryActionDisabled={isSaving}
          saving={isSaving}
          form={form}
          formId={formId}
          onPrimaryActionClick={onSubmit}
        />
      }
      title={t('in-automation:associateActions')}
      slideInViewTitle={t('in-automation:addActions')}
      onSlideInViewTitleClick={() => setSlideInViewVisible(false)}
      titleIconType="lib_openclose_add_circle_outline"
      onClose={onClose}
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={
        <SelectActions
          setSlideInViewVisible={setSlideInViewVisible}
          form={form}
          eventSpecification={eventSpecification}
          onSubmit={onSubmitSlideInView({ setForm, setSlideInViewVisible })}
        />
      }
      doNotCloseOnOutsideClick
    >
      <StaticContent {...{ form, setForm, savingError, setSlideInViewVisible, onSubmit, eventSpecification }} />
    </DialogWithSlideInView>
  );
}

type OnSubmitSlideInViewParams = Pick<ConfigureAssociatedActionsDialogState, 'setForm'> &
  Pick<ConfigureAssociatedActionsDialogContentState, 'setSlideInViewVisible'>;

function onSubmitSlideInView({ setForm, setSlideInViewVisible }: OnSubmitSlideInViewParams) {
  return (selectedIds: string[]) => {
    setForm(form =>
      form.updateIn(['actionIds'], field =>
        (field as Field<string[]>).setValue([...(field as Field<string[]>).value, ...selectedIds]).setTouched(true)
      )
    );
    setSlideInViewVisible(false);
  };
}

type StaticContentProps = Pick<
  ConfigureAssociatedActionsDialogContentProps,
  'form' | 'setForm' | 'savingError' | 'onSubmit' | 'eventSpecification'
> &
  Pick<ConfigureAssociatedActionsDialogContentState, 'setSlideInViewVisible'>;

function StaticContent({
  form,
  setForm,
  savingError,
  setSlideInViewVisible,
  onSubmit,
  eventSpecification
}: StaticContentProps) {
  return (
    <Form form={form} setForm={form => setForm(form as MapForm<any>)} formId={formId} onSubmit={onSubmit}>
      <div className={locals.dialog}>
        {savingError && (
          <NotificationComponent failure>{t('in-automation:failedToSaveAssocations')}</NotificationComponent>
        )}
        <DashboardNotification type="info">{t('in-automation:actionsAssociationsNote')}</DashboardNotification>
        <SelectedActions
          setSlideInViewVisible={setSlideInViewVisible}
          form={form}
          setForm={setForm}
          eventSpecification={eventSpecification}
        />
      </div>
    </Form>
  );
}
