/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Menu } from '@instana/components';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { APPLICATION_CREATION_SELECTED_BLUEPRINT } from 'in-services/tracking/eventNames';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { t } from 'in-i18n';

import locals from './SimpleCreateStep1.mless';

export default function SimpleCreateStep1({ selectedBlueprint, setSelectedBlueprint }) {
  const { trackCta } = useSegmentTracking();
  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step1.headline')}>
      <Menu
        items={blueprintConfig}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={item => {
          setSelectedBlueprint(item);
          trackCta(APPLICATION_CREATION_SELECTED_BLUEPRINT, { item });
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
