/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SvgIcon, CarbonPopover, CarbonPopoverContent, IconButton, Link } from '@instana/components';

import { Trans, t } from 'in-i18n';

import locals from './AiPopover.mless';

// Basic function for the rendering of the AI Popover and its inner contents
// Each AI Popover holds his own open state so they are independent of each other
export function AIPopover() {
  const [showPop, setShowPop] = useState(false);
  return (
    <CarbonPopover open={showPop} align={'left-start'} className={locals.blueArrow} caret>
      <SvgIcon
        type={'lib_ai_slug'}
        size="xs"
        viewBox={'4 4 24 24'}
        className={locals.aiIconSlug}
        onClick={() => {
          setShowPop(!showPop);
        }}
      />

      <CarbonPopoverContent className={locals.popoverContent}>
        <div className={locals.popupClose}>
          <IconButton
            type={'lib_openclose_cancel'}
            size="compact"
            onClick={() => {
              setShowPop(!showPop);
            }}
          />
        </div>
        <AIExplainedContent />
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}

// Static Function that renders the text content within the popover
// that is explaining the AI being used
export function AIExplainedContent() {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupDescription}>
        {t('in-events:notes.aiExplained')}
        <div className={locals.popSumTitle}>{t('in-events:notes.summary')}</div>
        <div>{t('in-events:notes.summaryDescription')}</div>
      </div>
      <div>
        <div className={locals.dataTypesHeader}>{t('in-events:notes.dataTypes')}</div>
        <div className={locals.bullet}>
          {'- '}
          <div style={{ paddingLeft: '.5rem' }}>
            <Trans i18nKey={'in-events:notes.triggeringEvent'} />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div style={{ paddingLeft: '.5rem' }}>
            <Trans i18nKey={'in-events:notes.relatedEvents'} />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div style={{ paddingLeft: '.5rem' }}>
            <Trans i18nKey={'in-events:notes.affectedEntities'} />
          </div>
        </div>
      </div>
      <div className={locals.aimodellink}>
        <div>{t('in-events:notes.aiModel')}</div>
        <Link linkIconType={'lib_views_external_link'} href="https://ibm.biz/granite-instruct-models" external>
          {t('in-events:notes.granite')}
        </Link>
      </div>
    </div>
  );
}
