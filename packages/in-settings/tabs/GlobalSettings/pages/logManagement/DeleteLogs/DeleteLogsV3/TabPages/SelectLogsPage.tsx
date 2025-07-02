/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DateInput as CarbonDateInput, Label, Typography, ValidationBlock } from '@instana/components';

import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { SelectLogsPageProps } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/modalTypes';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import { activeLocale } from 'in-i18n';

import locals from './SelectLogsPage.mless';

export const SelectLogsPage = ({ validationMessages, setInputValues, inputValues }: SelectLogsPageProps) => {
  return (
    <section className={locals.selectLogsContainer}>
      <Typography variant="heading-02" component="h1">
        {deleteLogsLocalisationStrings.selectLogsPageTitle}
      </Typography>
      <h2 className={locals.selectLogsDescription}>{deleteLogsLocalisationStrings.selectLogsPageDescription}</h2>
      <section className={locals.selectLogsTimeSection}>
        {/* Start Date */}
        <Label htmlFor="deletionStartDate">
          <span>{deleteLogsLocalisationStrings.deletionFromDate}</span>
          <section style={{ marginTop: '0.5rem' }}>
            <CarbonDateInput
              value={new Date(inputValues.startDate)}
              onChange={e => setInputValues.startDate((e as Date[])[0])}
              locale={activeLocale}
            />
          </section>
          {validationMessages.timeRange && <ValidationBlock>{validationMessages.timeRange}</ValidationBlock>}
        </Label>

        {/* Start Time */}
        <TimePicker
          className={locals.selectLogsTimePicker}
          id="deletionStartTime"
          labelText={deleteLogsLocalisationStrings.deletionFromTime}
          size="sm"
          value={inputValues.startTime as string}
          onChange={e => setInputValues.startTime(e)}
        />
        {/* End Date */}
        <Label htmlFor="deletionEndDate">
          <span>{deleteLogsLocalisationStrings.deletionUntilDate}</span>
          <section style={{ marginTop: '0.5rem' }}>
            <CarbonDateInput
              locale={activeLocale}
              value={new Date(inputValues.endDate)}
              onChange={e => setInputValues.endDate((e as Date[])[0])}
            />
          </section>
        </Label>
        {/* End Time */}
        <TimePicker
          className={locals.selectLogsTimePicker}
          id="deletionEndTime"
          labelText={deleteLogsLocalisationStrings.deletionUntilTime}
          size="sm"
          value={inputValues.endTime as string}
          onChange={e => setInputValues.endTime(e)}
        />
      </section>
      <div className={locals.loggingInteraction}>
        <section>
          <QueryBuilderSection
            value={inputValues.tagFilterExpression}
            onChange={val => setInputValues.tagFilterExpression(val)}
            QueryBuilder={LogsQueryBuilder}
            hasError={false}
            useLastValidStateWhenErroneous
            getSuggestionLabel={({ item }) => item}
          />
        </section>
        {validationMessages.tagFilterExpression && (
          <ValidationBlock>{validationMessages.tagFilterExpression}</ValidationBlock>
        )}
      </div>
    </section>
  );
};
