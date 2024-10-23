/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { CarbonModal, CarbonTextArea, CarbonTextInput, CarbonForm } from '@instana/components';

import { shareEventSummary } from 'in-stores/events';
import { validRecipients } from './utils';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ShareSummary.mless';

export function ShareSummary({ summary, open, setShareOpen, setNeedOverlay }) {
  const [textSummary, setTextSummary] = useState(summary);
  const [manualInput, setManualInput] = useState(false);
  const [subject, setSubject] = useState(t('in-events:notes.shareIncidentSummarySubject'));
  const [recipients, setRecipients] = useState('');
  const [summaryTextFocused, setSummaryTextFocused] = useState('');
  const [validForm, setValidForm] = useState(true);

  return (
    <>
      <CarbonModal
        open={open}
        onRequestClose={() => {
          setTimeout(() => {
            setNeedOverlay(false);
          }, 500);
          setTextSummary(summary);
          setShareOpen(false);
          setManualInput(false);
          setValidForm(true);
        }}
        onRequestSubmit={() => {
          setValidForm(validRecipients(recipients));
          if (validForm) {
            // If there is manual modifications to the summary we need to specify that in the body
            const summary = manualInput && `${textSummary}\n\n${t('in-events:notes.withManualEdits')}`;
            handleShareSummary(recipients, summary, subject);
          }
        }}
        modalHeading={t('in-events:notes.shareSummary')}
        primaryButtonText={t('in-events:notes.share')}
        secondaryButtonText={t('in-events:notes.cancel')}
      >
        {t('in-events:notes.takeSomeTimeReview')}
        <CarbonForm className={locals.formWrapper}>
          <div className={locals.summarySubHeader}>{t('in-events:notes.summaryEmail')}</div>
          <CarbonTextInput
            labelText={t('in-events:notes.recipients')}
            type="text"
            invalidText={t('in-events:notes.invalidEmail')}
            invalid={!validForm}
            onChange={e => {
              setRecipients(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true
            })}
          />
          <CarbonTextInput
            labelText={t('in-events:notes.subject')}
            type="text"
            value={subject}
            onChange={e => {
              setSubject(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true
            })}
          />
          <CarbonTextArea
            labelText={t('in-events:notes.body')}
            helperText={manualInput && t('in-events:notes.withManualEdits')}
            value={(!manualInput && summary) || textSummary}
            rows={7}
            onFocus={() => {
              setSummaryTextFocused(true);
            }}
            onBlur={() => {
              setSummaryTextFocused(false);
            }}
            onChange={e => {
              setManualInput(true);
              setTextSummary(e.target.value);
            }}
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true,
              [locals.noDefaultBorder]: true,
              [locals.focusBorder]: summaryTextFocused
            })}
          />
        </CarbonForm>
      </CarbonModal>
    </>
  );
}

// Construct the share object needed to send to the backend
export function handleShareSummary(recipients, body, subject) {
  const userName = user.preferredName;
  const milliseconds = Date.now();
  const incidentLink = window.location.href;
  const shareData = {
    recipients: recipients,
    timestamp: milliseconds,
    sender: userName,
    subject: subject,
    content: body,
    link: incidentLink
  };
  shareEventSummary(shareData);
}
