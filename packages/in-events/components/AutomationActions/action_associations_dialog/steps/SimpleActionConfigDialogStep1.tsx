/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { BluePrint } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Menu from 'in-components/Menu';
import { t } from 'in-i18n';

import locals from './SelectTestStep.mless';

interface ConfigProps {
  blueprintConfig: readonly BluePrint[];
}

export default function SimpleActionConfigDialogStep1(props: ConfigProps) {
  const blueprintConfig: readonly BluePrint[] = props.blueprintConfig;
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);
  return (
    <SimpleModeStepContentWrapper headline={t('in-events:actionSelectionStep1Headline')}>
      <Menu
        items={blueprintConfig}
        onItemClick={item => {
          setSelectedBlueprint(item);
        }}
        initialItemSelected={selectedBlueprint}
        addRightSeparator
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
          <div className={locals.note}>{t('in-events:actionsAssociationsNote')}</div>
        </SelectedBlueprintPresenter>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
