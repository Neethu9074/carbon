/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { idFromBluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import SideRadioMenu from 'in-components/SideRadioMenu';
import { t } from 'in-i18n';

import locals from './SimpleCreateStep1.mless';

export default function SimpleCreateStep1({ selectedBlueprint, setSelectedBlueprint }) {
  const { trackApplicationCreationBlueprintSelected } = useApplicationTracker();
  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step1.headline')}>
      <SideRadioMenu
        items={blueprintConfig.map(x => ({ id: idFromBluePrint(x), name: x.name }))}
        valueSelected={idFromBluePrint(selectedBlueprint)}
        onChange={id => {
          const item = blueprintConfig.find(i => id === idFromBluePrint(i));
          setSelectedBlueprint(item);
          trackApplicationCreationBlueprintSelected({ item });
        }}
      />
      <div className={locals.presenterWrapper}>
        <SelectedBlueprintPresenter title={selectedBlueprint.headline}>
          {selectedBlueprint.description?.map(paragraph => {
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
