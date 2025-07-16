/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SvgIcon, CarbonPopover, CarbonPopoverContent, IconButton, Link } from '@instana/components';

import { Trans, t } from 'in-i18n';

import locals from './AISlugIcon.mless';

// Basic function for the rendering of the AI Popover and its inner contents
// Each AI Popover holds his own open state so they are independent of each other
export default function AISlugIcon({
  actionType,
  align = 'right-start'
}: {
  actionType: 'manual' | 'script' | 'aiGenerated';
  align?: 'right-start' | 'left-start';
}) {
  const [showPop, setShowPop] = useState(false);
  return (
    <CarbonPopover open={showPop} align={align} className={locals.blueArrow} caret>
      <SvgIcon
        type={'lib_ai_slug'}
        size="s"
        viewBox={'4 4 24 24'}
        className={locals.aiIconSlug}
        onClick={() => {
          setShowPop(!showPop);
        }}
      />

      <CarbonPopoverContent className={locals.popoverContent} id="ai_popover_content">
        <div className={locals.popupClose}>
          <IconButton
            type={'lib_openclose_cancel'}
            size="compact"
            onClick={() => {
              setShowPop(!showPop);
            }}
          />
        </div>
        {actionType === 'manual' && <AIExplainedContentManualAction />}
        {actionType === 'script' && <AIExplainedContentScriptAction />}
        {actionType === 'aiGenerated' && <AIExplainedContentPreGeneratedActions />}
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}

// Static Function that renders the text content within the popover
// that is explaining the AI being used
function AIExplainedContentManualAction() {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupDescription}>
        {t('in-automation:AITooltip.aiExplained')}
        <div className={locals.popSumTitle}> {t('in-automation:AITooltip.manualSection.section1.section1Title')}</div>
        <div>{t('in-automation:AITooltip.manualSection.section1.section1Text')}</div>
      </div>
      <div>
        <div className={locals.dataTypesHeader}>
          {t('in-automation:AITooltip.manualSection.section2.section2Title')}
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey="in-automation:AITooltip.manualSection.section2.section2EventName" />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey="in-automation:AITooltip.manualSection.section2.section2Description" />
          </div>
        </div>
        <div className={locals.bullet}>
          {'- '}
          <div>
            <Trans i18nKey="in-automation:AITooltip.manualSection.section2.section2Entitytype" />
          </div>
        </div>
      </div>
      <div className={locals.aimodelLink}>
        <div>{t('in-automation:AITooltip.manualSection.section3.AIModel')}</div>
        <Link
          linkIconType={'lib_views_external_link'}
          href="https://huggingface.co/ibm-granite/granite-3.3-8b-instruct"
          external
        >
          ibm-granite/granite-3.3-8b-instruct
        </Link>
      </div>
      <div className={locals.aimodelLink}>
        <div>{t('in-automation:AITooltip.manualSection.section4.section4Text')}</div>
      </div>
    </div>
  );
}

function AIExplainedContentScriptAction() {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupScriptDescription}>
        {t('in-automation:AITooltip.aiExplained')}
        <div className={locals.popSumTitle}> {t('in-automation:AITooltip.manualSection.section1.section1Title')}</div>
        <div>{t('in-automation:AITooltip.scriptSection.section1.section1Text')}</div>
      </div>
      <div className={locals.aimodelLink}>
        <div>{t('in-automation:AITooltip.manualSection.section3.AIModel')}</div>
        <Link
          linkIconType={'lib_views_external_link'}
          href="https://huggingface.co/ibm-granite/granite-3.3-8b-instruct"
          external
        >
          ibm-granite/granite-3.3-8b-instruct
        </Link>
      </div>
      <div className={locals.aimodelLink}>
        <div>{t('in-automation:AITooltip.scriptSection.section3.section3Text')}</div>
      </div>
    </div>
  );
}

function AIExplainedContentPreGeneratedActions() {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupScriptDescription}>
        {t('in-automation:AITooltip.aiExplained')}
        <div className={locals.popSumTitle}> {t('in-automation:AITooltip.preGenerated.title')}</div>
        <div>{t('in-automation:AITooltip.preGenerated.text')}</div>
      </div>
    </div>
  );
}
