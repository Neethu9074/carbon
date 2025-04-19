/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { MapForm, createMapForm, createField, notBlankValidator, Field } from 'formalistic';
import React, { FormEvent, useState } from 'react';

import { Message, Stack, Typography, Toggle, Tooltip, SvgIcon, CarbonTextInput } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import { MANUAL_CLOSE_SUBMIT, MANUAL_CLOSE_CANCEL } from 'in-services/tracking/eventNames';
import { manualCloseIncidentPath, manualCloseIssuePath } from 'in-events/navigation/paths';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { ManualCloseInfoForm, manuallyCloseIssue } from 'in-events/api';
import { disableEventConfigEnabled } from 'in-services/featureFlags';
import { Error, ErrorCode, ManualCloseInfo } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { manualCloseCTATracker } from 'in-events/tracker';
import { toHtml } from 'in-services/formatters/markdown';
import { EventOrMap } from 'in-events/types';
import { config } from 'in-services/config';
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
  eventType?: string;
}

//@ts-expect-error
const username = user?.email || user?.fullName || user?.id;
const getManualClosePath = (eventType: string | undefined) =>
  eventType === 'incident' ? manualCloseIncidentPath : manualCloseIssuePath;

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
  const manualClosePath = getManualClosePath(eventType);

  const canSuppressAlertAndDisableEvent = disableEventConfigEnabled && user?.role?.canConfigureEventsAndAlerts;

  if (!form) return <LoadingIndicator size="regular" />;

  const buttonText =
    eventType === 'incident' ? t('in-events:closeEventDialog.closeIncident') : t('in-events:closeIssue');

  const footer = (
    <DialogFooter
      form={form}
      primaryActionText={buttonText}
      primaryActionDisabled={!form.hierarchyValid}
      secondaryActionText={t('in-components:blueprintFormMultistep.buttonCancel')}
      onSecondaryActionClick={() => {
        manualCloseCTATracker(MANUAL_CLOSE_CANCEL, manualClosePath, `tenant=${config.tenant}`);
        onClose();
      }}
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
    save(form, eventId, manualClosePath, onSaveSuccess, onError);
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
            <CarbonTextInput
              id="comments"
              labelText={t('in-events:closeEventDialog.comments')}
              className={locals.commentsTextArea}
              placeholder={
                eventType === 'incident'
                  ? t('in-events:closeEventDialog.reasonIncident')
                  : t('in-events:closeEventDialog.reasonIssue')
              }
              onChange={e => {
                if (e.target) {
                  const target = e.target;
                  setValue(form, ['reasonForClosing'], target.value);
                }
              }}
            />

            <Message type="warning" className={locals.warningBox} withIcon>
              {t('in-events:closeEventDialog.warning')}
            </Message>

            {canSuppressAlertAndDisableEvent && (
              <Stack gap="xxsmall">
                <Stack direction="horizontal" gap="xxsmall" align="center">
                  <Typography variant="body-small">{t('in-events:closeEventDialog.suppressAlerts')}</Typography>
                  <Tooltip
                    content={
                      eventType === 'incident'
                        ? t('in-events:closeEventDialog.suppressAlertsIncidentTooltip')
                        : t('in-events:closeEventDialog.suppressAlertsIssueTooltip')
                    }
                  >
                    <SvgIcon type="lib_help_error_info_outline" size="xs" />
                  </Tooltip>
                </Stack>

                <Toggle
                  id="mute-alerts"
                  name="mute-alerts"
                  checked={form.get('muteAlerts').value}
                  onToggle={checked => setValue(form, ['muteAlerts'], checked)}
                  labelA={t('in-events:closeEventDialog.labelOff')}
                  labelB={t('in-events:closeEventDialog.labelOn')}
                />

                <Stack direction="horizontal" gap="xxsmall" align="center">
                  <Typography variant="body-small">
                    {eventType === 'incident'
                      ? t('in-events:closeEventDialog.disableIncident')
                      : t('in-events:closeEventDialog.disableIssue')}
                  </Typography>
                  <Tooltip content={t('in-events:closeEventDialog.disableEventsTooltip')}>
                    <SvgIcon type="lib_help_error_info_outline" size="xs" />
                  </Tooltip>
                </Stack>

                <Toggle
                  id="disable-event-config"
                  name="disable-event-config"
                  checked={form.get('disableEvent').value}
                  onToggle={checked => setValue(form, ['disableEvent'], checked)}
                  labelA={t('in-events:closeEventDialog.labelOff')}
                  labelB={t('in-events:closeEventDialog.labelOn')}
                />
              </Stack>
            )}
          </Stack>
        </div>
      </DialogWithSlideInView>
    </form>
  );
}

function createForm(): MapForm<ManualCloseInfoForm> {
  return createMapForm<ManualCloseInfoForm>({
    items: {
      reasonForClosing: createField({ value: '', validator: notBlankValidator }),
      muteAlerts: createField({ value: false }),
      disableEvent: createField({ value: false })
    }
  });
}

function save(
  form: MapForm<ManualCloseInfoForm>,
  eventId: string,
  manualClosePath: string,
  onSaveSuccess: () => void,
  onError: (data: any) => void
) {
  const closeTimestamp = Date.now();
  const reasonForClosing = form.get('reasonForClosing').value;
  const muteAlerts = form.get('muteAlerts').value;
  const disableEvent = form.get('disableEvent').value;

  const manualCloseConfig: ManualCloseInfo = {
    closeTimestamp,
    muteAlerts,
    disableEvent,
    reasonForClosing,
    username
  };
  manualCloseCTATracker(
    MANUAL_CLOSE_SUBMIT,
    manualClosePath,
    `tenant=${config.tenant}`,
    JSON.stringify(manualCloseConfig)
  );

  const result$ = manuallyCloseIssue(eventId, manualCloseConfig);

  result$.once(() => {
    onSaveSuccess();
    close();
  });

  result$.errors().once(onError);
}
