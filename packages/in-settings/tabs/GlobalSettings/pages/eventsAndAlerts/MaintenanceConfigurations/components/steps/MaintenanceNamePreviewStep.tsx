/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';
import { Field, MapForm } from 'formalistic';
import { RRule } from 'rrule';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { Duration, MaintenanceConfigV2 } from '@instana/types';
import { formatDate, formatTime } from '@instana/format-date';

import {
  getEndAndTimeDurationOfWindow,
  setUTCPartsToDate
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import { StartObject } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import { parseDateTime } from 'in-services/formatters/date';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

export interface MaintenanceNamePreivewProps {
  form: MapForm<any>;
  onChange: OnEntityChange<MaintenanceConfigV2>;
}

export default function MaintenanceNamePreviewStep(props: MaintenanceNamePreivewProps) {
  const { form, onChange } = props;
  const [previewArrayOfDates, setPreviewArrayOfDates] = useState<StartObject[]>([]);
  //@ts-expect-error-next-line
  const rrule = (form.getIn(['window', 'recurrence', 'rrule']) as Field<RRule>).value;
  /* This useEffect generates the preview window. The reason this needs to be a useEffect is if the user uses the advanced mode and has all the steps viewable at once */
  useEffect(() => {
    let previewDatesStr = [];
    const duration = (form.getIn(['window', 'duration']) as Field<Duration>).value;

    if (rrule) {
      const rruleDates = rrule.all((_, i) => i < 5);
      if (Array.isArray(rruleDates) && rruleDates.length > 0) {
        rruleDates.forEach(date => {
          date = setUTCPartsToDate(date);
          const windowEnd = getEndAndTimeDurationOfWindow(duration.amount, duration.unit, date);
          if (isNaN(windowEnd.getTime())) return;

          const previewObj = {
            dates: `${formatDate(date)} to ${formatDate(windowEnd)}`,
            times: `${formatTime(date)} to ${formatTime(windowEnd)}`
          };
          previewDatesStr.push(previewObj);
        });
      }
    } else {
      const startObject = form.getIn(['window', 'start']) as MapForm<any>;
      const parsedStart = parseDateTime(
        `${(startObject.get('date') as Field<string>).value} ${(startObject.get('time') as Field<string>).value}`
      );
      if (isNaN(parsedStart.getTime())) return;
      const windowEnd = getEndAndTimeDurationOfWindow(duration.amount, duration.unit, parsedStart);

      const previewObj = {
        dates: `${formatDate(parsedStart)} to ${formatDate(windowEnd)}`,
        times: `${formatTime(parsedStart)} to ${formatTime(windowEnd)}`
      };
      previewDatesStr.push(previewObj);
    }
    setPreviewArrayOfDates(previewDatesStr);
  }, [rrule, form]);
  return (
    <div className={locals.mwWrapper}>
      {(form.get('name') as Field<string>).map(field => (
        <FormGroup style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
          <Label htmlFor="maintenance-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="maintenance-name"
            className={locals.input}
            type="text"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            placeholder={t('in-settings:api.newMaintenanceWindowDefaultName')}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
          <DescriptionText>{t('in-settings:tabs.maintenanceWindowNamesShouldBeUniqueAndMeaningful')}</DescriptionText>
        </FormGroup>
      ))}
      <HorizontalFlexWrapper className={locals.labelWithTooltip} style={{ marginLeft: '0.5rem' }}>
        <Label htmlFor={locals.previewContainer}>{t('in-settings:tabs.preview')}</Label>
        <Tooltip content={t('in-settings:maintenanceWindow.previewTooltipText')} align="rightTop">
          <SvgIcon type="lib_help_error_info_outline" color="#2D4048" />
        </Tooltip>
      </HorizontalFlexWrapper>
      {previewArrayOfDates?.length > 0 && (
        <div className={locals.previewContainer}>
          {previewArrayOfDates.map((val, i) => {
            if (i >= 4) return;
            return (
              <Stack key={`${i}-date-stack`} direction="horizontal" gap="small">
                <div key={`${i}-date`}>
                  <Typography key={`${i}-date-str`} variant="body-regular">
                    {val.dates}
                  </Typography>
                </div>
                <div key={`${i}-time`}>
                  <Typography key={`${i}-time-str`} variant="body-regular">
                    {val.times}
                  </Typography>
                </div>
              </Stack>
            );
          })}
          {previewArrayOfDates.length > 4 && <Typography variant="body-regular">{'...'}</Typography>}
        </div>
      )}
    </div>
  );
}
