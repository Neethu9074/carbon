/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { applicationCreationSelectedBlueprint } from 'in-applications/creation/tracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Menu from 'in-alerting/components/Menu';
import { t } from 'in-i18n';

import locals from './SimpleCreateStep1.mless';

export default function SimpleCreateStep1({ selectedBlueprint, setSelectedBlueprint }) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step1.headline')}>
      <Menu
        items={blueprintConfig}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={item => {
          setSelectedBlueprint(item);
          applicationCreationSelectedBlueprint({ item });
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
