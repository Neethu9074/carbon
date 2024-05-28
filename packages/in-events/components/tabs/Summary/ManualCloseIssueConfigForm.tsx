/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { MapForm, createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { FormEvent, useState } from 'react';

import { Message, Stack, Typography } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { ManualCloseInfoForm, manuallyCloseIssue } from 'in-events/api';
import { close } from 'in-components/DialogPresenter/store';
import FormTextArea from 'in-components/form/TextArea';
import { EventOrMap } from 'in-events/types';
import { Error, ErrorCode } from 'in-types';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ManualCloseIssueConfigForm.mless';

interface ManualCloseIssueConfigFormProps {
  onSaveSuccess: () => void;
  onClose?: () => void;
  event: EventOrMap;
  problem: string;
  description?: string;
  iconComponent?: React.ReactNode;
}

export default function ManualCloseIssueConfigForm({
  onSaveSuccess,
  problem,
  onClose = close,
  event,
  description,
  iconComponent
}: ManualCloseIssueConfigFormProps) {
  const [form, setForm] = useState<MapForm<ManualCloseInfoForm>>(createForm());
  const [error, setError] = useState<Error[]>([]);

  const eventId = event.get('id') as string;

  if (!form) return <LoadingIndicator size="regular" />;

  const footer = (
    <DialogFooter
      form={form}
      primaryActionText={t('in-events:closeIssue')}
      primaryActionDisabled={!form.hierarchyValid}
      secondaryActionText={t('in-components:blueprintFormMultistep.buttonCancel')}
      onSecondaryActionClick={onClose}
    />
  );

  const onError = (data: any) => {
    setError([
      {
        code: (data.response.statusText as string).toUpperCase().replace(' ', '_') as ErrorCode,
        message: data.message as string
      }
    ]);
  };

  const onSubmit = (e: FormEvent | null) => {
    if (e) e.preventDefault();
    setError([]);
    if (!form.hierarchyValid) {
      form.setTouched(true, { recurse: true });
      return;
    }
    save(form, eventId, onSaveSuccess, onError);
  };

  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };

  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView title={t('in-events:titleManualCloseIssue')} footer={footer} onClose={onClose}>
        <div className={locals.dialog}>
          <Stack>
            <ErroneousResultPresenter errors={error} />
            <Stack gap="xxsmall">
              {problem && (
                <Stack direction="horizontal" gap="xxsmall">
                  {iconComponent}
                  <Typography variant="body-regular">{problem}</Typography>
                </Stack>
              )}
              {description && (
                <Typography
                  variant="body-regular"
                  component={() => <div className={locals.description}>{description}</div>}
                >
                  {description}
                </Typography>
              )}
            </Stack>
            <Stack gap="xxsmall">
              <Typography variant="body-small">
                {t('in-events:closeIssueDialog.comments')}
                <span className={locals.red}>*</span>
              </Typography>

              <FormTextArea
                className={locals.commentsTextArea}
                placeholder={t('in-events:closeIssueDialog.reason')}
                onChange={e => {
                  if (e.target) {
                    const target = e.target as HTMLTextAreaElement;
                    setValue(form, ['reasonForClosing'], target.value);
                  }
                }}
              />
            </Stack>

            <Message type="warning" className={locals.warningBox}>
              {t('in-events:closeIssueDialog.warning')}
            </Message>
          </Stack>
        </div>
      </DialogWithSlideInView>
    </form>
  );
}

function createForm(): MapForm<ManualCloseInfoForm> {
  return createMapForm<ManualCloseInfoForm>({
    items: {
      reasonForClosing: createField({ value: '', validator: notBlankValidator })
    }
  });
}

function save(
  form: MapForm<ManualCloseInfoForm>,
  eventId: string,
  onSaveSuccess: () => void,
  onError: (data: any) => void
) {
  const closeTimestamp = Date.now();
  const reasonForClosing = form.get('reasonForClosing').value;
  //@ts-expect-error
  const username = user?.email || user?.fullName || user?.id;

  const config = {
    closeTimestamp,
    reasonForClosing,
    username
  };
  const result$ = manuallyCloseIssue(eventId, config);

  result$.once(() => {
    onSaveSuccess();
    close();
  });

  result$.errors().once(onError);
}
