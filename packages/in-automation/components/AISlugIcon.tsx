/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// import React from 'react';

// import { Tooltip as CarbonTooltip } from '@instana/components';

// import { t } from 'in-i18n';

// export default function AISlugIcon() {
//   return (
//     <CarbonTooltip content={t('in-automation:AISlugContent')}>
//       <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <g id="AI slug">
//           <rect x="0.5" y="0.5" width="31" height="31" fill="white" fillOpacity="0.01" />
//           <rect x="0.5" y="0.5" width="31" height="31" stroke="#161616" />
//           <path
//             id="AI"
//             d="M17.6582 21H15.4662L14.5702 18.152H10.6022L9.72219 21H7.57819L11.3222 9.832H13.9462L17.6582 21ZM14.0582 16.344L12.6182 11.752H12.5382L11.1142 16.344H14.0582ZM23.9122 21H18.8402V19.304H20.3122V11.528H18.8402V9.832H23.9122V11.528H22.4242V19.304H23.9122V21Z"
//             fill="#161616"
//           />
//         </g>
//       </svg>
//     </CarbonTooltip>
//   );
// }

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
export default function AISlugIcon({ actionType }: { actionType: 'manual' | 'script' }) {
  const [showPop, setShowPop] = useState(false);
  return (
    <CarbonPopover open={showPop} align={'right-start'} className={locals.blueArrow} caret>
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
        {actionType === 'manual' ? <AIExplainedContentManualAction /> : <AIExplainedContentScriptAction />}
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
        <Link
          linkIconType={'lib_views_external_link'}
          href="https://www.ibm.com/docs/en/watsonx/w-and-w/2.0.x?topic=models-granite-13b-chat-v2-model-card"
          external
        >
          ibm/granite-3-8b-instruct
        </Link>
      </div>
    </div>
  );
}

function AIExplainedContentScriptAction() {
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
        <Link
          linkIconType={'lib_views_external_link'}
          href="https://www.ibm.com/docs/en/watsonx/w-and-w/2.0.x?topic=models-granite-34b-code-instruct-model-card"
          external
        >
          ibm/granite-34b-code-instruct
        </Link>
      </div>
    </div>
  );
}
