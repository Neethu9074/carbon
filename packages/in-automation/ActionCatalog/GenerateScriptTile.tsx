/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { CodeSyntax } from '@carbon/pictograms-react';
import React from 'react';

import { PreviewPill, IconButton, Typography, Spacer, CarbonTile } from '@instana/components';

import GenerateAIScriptActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

import locals from 'in-automation/ActionCatalog/Action.mless';

export default function GenerateScriptTile({
  manualContent,
  actionName,
  actionId
}: {
  manualContent: string;
  actionName: string;
  actionId: string | null;
}) {
  const { generateAIButtonClickTrackerSegment } = useSegmentTracker();

  return (
    <CarbonTile className={locals.scriptGenerationTile}>
      <HorizontalFlexWrapper className={locals.spaceBetweenSvgs}>
        <CodeSyntax aria-label="Code syntax svg" />
        <PreviewPill />
      </HorizontalFlexWrapper>
      <Spacer vertical="small" />
      <Typography variant="heading-300">
        {t('in-automation:GenerateAIActionDialog.generateScriptDialog.generateScriptTileHeader')}
      </Typography>
      <Spacer vertical="small" />
      <Typography variant="body-regular">
        {t('in-automation:GenerateAIActionDialog.generateScriptDialog.generateScriptTileDescription')}
      </Typography>
      <Spacer vertical="medium" />
      <IconButton
        color="var(--cds-link-primary)"
        id="generate_script"
        className={locals.generateScriptArrow}
        onClick={() => {
          generateAIButtonClickTrackerSegment({
            type: 'script',
            location: 'action details',
            actionName: actionName,
            actionId: actionId
          });
          addActiveDialog(<GenerateAIScriptActionDialog manualContent={manualContent} actionName={actionName} />);
        }}
        buttonType="button"
        kind="primaryv2"
        type="lib_arrow_right"
      />
    </CarbonTile>
  );
}
