/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { blueprintConfig, BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { createForm } from 'in-synthetics/form/createSyntheticTestForm';
import Menu from 'in-components/Menu';
import { t } from 'in-i18n';

import locals from './SelectTestStep.mless';

export interface Props {
  selectedBlueprint: BluePrint;
  onSelectBluePrint: (item: BluePrint) => void;
  updateForm: (form: MapForm) => void;
}

interface Description {
  headline: string;
  htmlContent: string;
}

export default function SelectTestStep({ selectedBlueprint, onSelectBluePrint, updateForm }: Props) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-synthetics:dialog.createTest.selectTest.title')}>
      <Menu
        items={blueprintConfig}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={item => {
          onSelectBluePrint(item);
          updateForm(createForm(item));
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
