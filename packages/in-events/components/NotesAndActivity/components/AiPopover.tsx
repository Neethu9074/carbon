/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { FC, useState } from 'react';

import { SvgIcon, CarbonPopover, CarbonPopoverContent, IconButton, Link } from '@instana/components';
import { UnorderedList, ListItem } from '@instana/carbon';

import { t } from 'in-i18n';

import locals from './AiPopover.mless';

interface AIPopoverProps {
  featureName: string;
  featureDescription: string;
  dataUsed: [React.ReactElement];
  modelTitle: string;
  modelLink: string;
}

// Basic function for the rendering of the AI Popover and its inner contents
// Each AI Popover holds his own open state so they are independent of each other
export const AIPopover: FC<AIPopoverProps> = ({
  featureName,
  featureDescription,
  dataUsed, // [Translation Text Key, Translation Text Key]
  modelTitle,
  modelLink
}) => {
  const [showPop, setShowPop] = useState(false);
  return (
    <CarbonPopover open={showPop} align={'left-start'} className={locals.blueArrow} caret>
      <SvgIcon
        type={'lib_ai_slug'}
        size="xs"
        viewBox={'4 4 24 24'}
        // @ts-expect-error TODO: figure out what to do to have ids
        id="ai_slug_icon"
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
            id="ai_popover_close"
            onClick={() => {
              setShowPop(!showPop);
            }}
          />
        </div>
        <AIExplainedContent
          featureName={featureName}
          featureDescription={featureDescription}
          dataUsed={dataUsed}
          modelTitle={modelTitle}
          modelLink={modelLink}
        />
      </CarbonPopoverContent>
    </CarbonPopover>
  );
};

interface AIExplainedContentProps extends AIPopoverProps {
  // placeholder for when you want to add aditional props just for ai popover.
}

// Static Function that renders the text content within the popover
// that is explaining the AI being used
export const AIExplainedContent: FC<AIExplainedContentProps> = ({
  featureName,
  featureDescription,
  dataUsed,
  modelTitle,
  modelLink
}) => {
  return (
    <div className={locals.popOverWrapper}>
      <div className={locals.popupDescription}>
        {t('in-events:notes.aiExplained')}
        <div className={locals.popSumTitle}>{featureName}</div>
        <div>{featureDescription}</div>
      </div>
      <div>
        <div className={locals.dataTypesHeader}>{t('in-events:notes.dataTypes')}</div>
        {dataUsed &&
          dataUsed.map(item => {
            return (
              <UnorderedList>
                <ListItem>{item}</ListItem>
              </UnorderedList>
            );
          })}
      </div>
      <div className={locals.aimodellink}>
        <div>{t('in-events:notes.aiModel')}</div>
        <Link linkIconType={'lib_views_external_link'} href={modelLink} external>
          {modelTitle}
        </Link>
      </div>
    </div>
  );
};
