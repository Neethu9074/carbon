/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { MapForm, createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { FormEvent, useState } from 'react';

import { Message, Stack, TextArea, Typography } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { ManualCloseInfoForm, manuallyCloseIssue } from 'in-events/api';
import { Error, ErrorCode, ManualCloseInfo } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { toHtml } from 'in-services/formatters/markdown';
import { EventOrMap } from 'in-events/types';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './MultiCloseIssueConfigForm.mless';

interface ManualCloseIssueConfigFormProps {
  onSaveSuccess: () => void;
  onClose?: () => void;
  event: EventOrMap;
  problem: string;
  description?: string;
  iconComponent?: React.ReactNode;
  eventType?: string;
}

export default function ManualCloseIssueConfigForm({
  onSaveSuccess,
  problem,
  onClose = close,
  event,
  description,
  iconComponent,
  eventType
}: ManualCloseIssueConfigFormProps) {
  const [form, setForm] = useState<MapForm<ManualCloseInfoForm>>(createForm());
  const [error, setError] = useState<Error[]>([]);

  const eventId = event.get('id') as string;

  if (!form) return <LoadingIndicator size="regular" />;

  const buttonText =
    eventType === 'incident' ? t('in-events:closeEventDialog.closeIncident') : t('in-events:closeIssue');

  const footer = (
    <DialogFooter
      form={form}
      primaryActionText={buttonText}
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

  const dialogTitle =
    eventType === 'incident' ? t('in-events:titleManualCloseIncident') : t('in-events:titleManualCloseIssue');

  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView title={dialogTitle} footer={footer} onClose={onClose}>
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
              <DangerousHtmlPresenter html={toHtml(description)} />
            </Stack>
            <Stack gap="xxsmall">
              <Typography variant="body-small">
                {t('in-events:closeEventDialog.comments')}
                <span className={locals.red}>*</span>
              </Typography>

              <TextArea
                className={locals.commentsTextArea}
                placeholder={t('in-events:closeEventDialog.reason')}
                onChange={e => {
                  if (e.target) {
                    const target = e.target as HTMLTextAreaElement;
                    setValue(form, ['reasonForClosing'], target.value);
                  }
                }}
                rows={8}
              />
            </Stack>

            <Message type="warning" className={locals.warningBox} withIcon>
              {eventType === 'incident'
                ? t('in-events:closeEventDialog.warningIncident')
                : t('in-events:closeEventDialog.warningIssue')}
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

  const config: ManualCloseInfo = {
    closeTimestamp,
    muteAlerts: false,
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
