/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonTextInput, Card, Typography } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { deleteLogsLocalisationStrings } from '../../localisationStrings';
// eslint-disable-next-line no-restricted-imports
import { ConfirmSelectionPageProps } from '../modalTypes';
// eslint-disable-next-line no-restricted-imports
import { ModalNotification } from '../ModalNotification';

import locals from './ConfirmSelectionPage.mless';

export const ConfirmSelectionPage = ({
  numberLogsValue,
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
        <section className={locals.confimSelectionDetailsBox}>
          <span>{deleteLogsLocalisationStrings.logsToDelete}</span>
          <span data-testid="numberLogsValue">{numberLogsValue}</span>
        </section>

        <section className={locals.confimSelectionDatesContainer}>
          <div>
            <span>{deleteLogsLocalisationStrings.deletionFromDate}</span>
            <span data-testid="fromDateValue">{inputValues.startDate}</span>
          </div>
          <div>
            <span>{deleteLogsLocalisationStrings.deletionUntilDate}</span>
            <span data-testid="untilTimeValue">{inputValues.endDate}</span>
          </div>
        </section>

        <section className={locals.confimSelectionDatesContainer}>
          <div>
            <span>{deleteLogsLocalisationStrings.deletionFromTime}</span>
            <span data-testid="fromTimeValue">{inputValues.startTime}</span>
          </div>
          <div>
            <span>{deleteLogsLocalisationStrings.deletionUntilTime}</span>
            <span data-testid="untilTimeValue">{inputValues.endTime}</span>
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
