/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { CarbonModal, CarbonTextArea, CarbonTextInput, CarbonForm } from '@instana/components';

import locals from './ShareSummary.mless';

// import { convertSummaryToString  } from './utils';

// import { Trans, t } from 'in-i18n';

export function ShareSummary({ summary, open, setShareOpen, setNeedOverlay }) {
  const [textSummary, setTextSummary] = useState(summary);
  const [manualInput, setManualInput] = useState(false);
  const [subject, setSubject] = useState('');
  const [summaryTextFocused, setSummaryTextFocused] = useState('');

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
        }}
        modalHeading={'Share summary'}
        primaryButtonText={'Add'}
        secondaryButtonText={'Cancel'}
      >
        {'Take some time to review and potentially modify the summary before sharing with others.'}
        <CarbonForm className={locals.formWrapper}>
          <div className={locals.summarySubHeader}>{'Summary Email'}</div>
          <CarbonTextInput
            labelText="Recipients"
            type="text"
            className={classNames({
              [locals.labelInField]: true,
              [locals.separator]: true
            })}
          />
          <CarbonTextInput
            labelText="Subject"
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
            labelText="Body"
            value={(!manualInput && summary) || textSummary}
            rows={7}
            onFocus={() => {
              setSummaryTextFocused(true);
            }}
            onBlur={() => {
              setSummaryTextFocused(false);
            }}
            onChange={e => {
              if (!manualInput) {
                setManualInput(true);
                setTextSummary(e.target.value + ` (with manual edits)`);
              } else {
                setTextSummary(e.target.value);
              }
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
