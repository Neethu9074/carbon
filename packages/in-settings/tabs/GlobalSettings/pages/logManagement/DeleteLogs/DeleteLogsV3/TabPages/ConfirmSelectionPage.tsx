/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonTextInput, Card, Typography } from '@instana/components';

import { ConfirmSelectionPageProps } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/modalTypes';
// eslint-disable-next-line no-restricted-imports
import { deleteLogsLocalisationStrings } from '../../localisationStrings';

import locals from './ConfirmSelectionPage.mless';
import {
  ModalNotification
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/ModalNotification';

export const ConfirmSelectionPage = ({
  inputValues,
  setInputValues,
  validationMessages,
  isDeleting,
  notification
}: ConfirmSelectionPageProps) => {
  return (
    <section className={locals.confirmSelectionContainer}>
      <h1 className={locals.confirmSelectionTitle}>{deleteLogsLocalisationStrings.confirmSelectionPageTitle}</h1>
      <h2 className={locals.confirmSelectionDescription}>
        {deleteLogsLocalisationStrings.confirmSelectionPageDescription}
      </h2>
      <Card className={locals.confirmSelectionDetails} title={deleteLogsLocalisationStrings.deletionDetails}>
        <section className={locals.confirmSelectionDatesContainer}>
            <div>
              <span>{deleteLogsLocalisationStrings.deletionFromDate}</span>
              <strong data-testid="fromDateValue">{inputValues.startDate.toLocaleDateString()}</strong>
              <span>{deleteLogsLocalisationStrings.deletionUntilDate}</span>
              <strong data-testid="untilTimeValue">{inputValues.endDate.toLocaleDateString()}</strong>
            </div>
            <div>
              <span>{deleteLogsLocalisationStrings.deletionFromTime}</span>
              <strong data-testid="fromTimeValue">{inputValues.startTime}</strong>
              <span>{deleteLogsLocalisationStrings.deletionUntilTime}</span>
              <strong data-testid="untilTimeValue">{inputValues.endTime}</strong>
            </div>
        </section>
      </Card>
      {/* Reason Input */}
      <CarbonTextInput
        className={locals.confirmSelectionReasonInput}
        id={deleteLogsLocalisationStrings.deletionReason}
        invalid={!!validationMessages.reason}
        invalidText={validationMessages.reason}
        value={inputValues.reason}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValues.reason(e.target.value)}
        name="reason"
        labelText={deleteLogsLocalisationStrings.deletionReason}
      />

      {/* Validation Input */}
      <CarbonTextInput
        className={locals.confirmSelectionValidationInput}
        id={deleteLogsLocalisationStrings.typeValidation}
        autoComplete="off"
        invalid={!!validationMessages.validation}
        invalidText={validationMessages.validation}
        value={inputValues.validation}
        onChange={(e: any) => setInputValues.validation(e.target.value)}
        placeholder={deleteLogsLocalisationStrings.typePlaceholder}
        name="typingValidation"
        labelText={deleteLogsLocalisationStrings.typeValidation}
      />

      {isDeleting && <Typography variant={'body-small'}>{deleteLogsLocalisationStrings.deletionInfo}</Typography>}
      {notification.show && <ModalNotification variant={notification.variant} />}
    </section>
  );
};
