/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

// @ts-expect-error module needs to be translated to TS
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
// @ts-expect-error module needs to be translated to TS
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
// @ts-expect-error module needs to be translated to TS
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
// @ts-expect-error module needs to be translated to TS
import Menu from 'in-alerting/components/Menu';
import { blueprintConfig, BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import { t } from 'in-i18n';

import locals from './SelectTestStep.mless';

export interface Props {
  selectedBlueprint: BluePrint;
  onSelectBluePrint: (item: BluePrint) => void;
}

interface Description {
  headline: string;
  htmlContent: string;
}

export default function SelectTestStep({ selectedBlueprint, onSelectBluePrint }: Props) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-synthetics:dialog.createTest.selectTest.title')}>
      <Menu
        items={blueprintConfig}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={(item: BluePrint) => {
          onSelectBluePrint(item);
        }}
      />
      <div className={locals.presenterWrapper}>
        <SelectedBlueprintPresenter title={selectedBlueprint.headline}>
          {selectedBlueprint.description?.map((paragraph: Description) => {
            return (
              <div key={paragraph.headline}>
                <div className={locals.descriptionHeadline}>{paragraph.headline}</div>
                <DangerousHtmlPresenter className={locals.htmlText} html={paragraph.htmlContent} />
              </div>
            );
          })}
        </SelectedBlueprintPresenter>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
