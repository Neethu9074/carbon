/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import {
  DateInput as CarbonDateInput,
  Card,
  HorizontalIndicator,
  Label,
  LoadingSkeleton,
  Typography,
  ValidationBlock
} from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { LoggingAnalyzeContextWrapper } from 'in-logging/analyze/AnalyzeView/LoggingAnalyzeContext';
import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/Charts/LogsDistributionChartSection';
// eslint-disable-next-line no-restricted-imports
import { SelectLogsPageProps } from '../modalTypes';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
// eslint-disable-next-line no-restricted-imports
import { useMock } from '../../DeleteLogs';
import { dataSourceConfigurations } from 'in-logging/analyze/AnalyzeView/utils/constants';
import StateManagement from 'in-components/AnalyzeView/StateManagement';
import { logIdMatrixParameter } from 'in-logging/navigation/matrix';
import { getMetricTemplates } from 'in-logging/api/metricTemplates';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import { dashboardDeletePath } from 'in-logging/navigation/paths';
import { getTagCatalog } from 'in-logging/api/catalog';
import { Progress } from 'in-types';

import locals from './SelectLogsPage.mless';

export const SelectLogsPage = ({
  numberLogsValue,
  validationMessages,
  setInputValues,
  inputValues,
  canGoNextStep
}: SelectLogsPageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(useMock ? true : false);

  useEffect(() => {
    setIsLoading(true);
    if (useMock) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [inputValues]);

  const progress: Progress = {
    loading: isLoading
  };
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
              hasError={!!validationMessages.startDate}
              value={new Date(inputValues.startDate as string)}
              onChange={e => setInputValues.startDate(e as string[])}
            />
          </section>
          {validationMessages.startDate && <ValidationBlock>{validationMessages.startDate}</ValidationBlock>}
        </Label>

        {/* Start Time */}
        <TimePicker
          className={locals.selectLogsTimePicker}
          id="deletionStartTime"
          labelText={deleteLogsLocalisationStrings.deletionFromTime}
          size="sm"
          value={inputValues.startTime as string}
          invalid={!!validationMessages.startTime}
          invalidText={validationMessages.startTime}
          onChange={e => setInputValues.startTime(e)}
        />

        {/* End Date */}
        <Label htmlFor="deletionEndDate">
          <span>{deleteLogsLocalisationStrings.deletionUntilDate}</span>
          <section style={{ marginTop: '0.5rem' }}>
            <CarbonDateInput
              hasError={!!validationMessages.endDate}
              value={new Date(inputValues.endDate as string)}
              onChange={e => setInputValues.endDate(e as string[])}
            />
          </section>
          {validationMessages.endDate && (
            <ValidationBlock className={locals.validationMessage}>{validationMessages.endDate}</ValidationBlock>
          )}
        </Label>

        {/* End Time */}
        <TimePicker
          className={locals.selectLogsTimePicker}
          id="deletionEndTime"
          labelText={deleteLogsLocalisationStrings.deletionUntilTime}
          size="sm"
          value={inputValues.endTime as string}
          invalid={!!validationMessages.endTime}
          invalidText={validationMessages.endTime}
          onChange={e => setInputValues.endTime(e)}
        />
      </section>

      <StateManagement
        path={dashboardDeletePath}
        defaultDataSource="logs"
        dataSourceParameter={logIdMatrixParameter}
        getTagCatalog={getTagCatalog}
        getMetricTemplates={getMetricTemplates}
        dataSourceConfigurations={dataSourceConfigurations}
      >
        {(opts: any) => {
          return (
            <LoggingAnalyzeContextWrapper>
              <div className={locals.loggingInteraction}>
                <section>
                  <QueryBuilderWorkspace {...opts} disableHeader />
                </section>
                <section>
                  {!isLoading ? (
                    <Card className={locals.logsToDeleteCard} title={deleteLogsLocalisationStrings.logsToDelete}>
                      <span data-testid="retentionValue">{numberLogsValue}</span>
                    </Card>
                  ) : (
                    <>
                      <HorizontalIndicator className={locals.loadingIndicatior} progress={progress} />
                      <LoadingSkeleton className={locals.skeleton} />
                    </>
                  )}
                </section>
                <section>
                  <LogsDistributionChartSection
                    {...opts}
                    disableClose={false}
                    hideRenderer
                    deleteLogsFormValues={inputValues}
                    canGoNextStep={canGoNextStep}
                    showHeader
                    isDashboard
                    isModalGraph
                  />
                </section>
              </div>
            </LoggingAnalyzeContextWrapper>
          );
        }}
      </StateManagement>
    </section>
  );
};
