/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { LocationsBluePrint, getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import createNewLocationForm from 'in-synthetics/createLocation/createLocationForm';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Menu from 'in-components/Menu';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface Props {
  selectedBlueprint: LocationsBluePrint;
  setSelectedBlueprint: (item: LocationsBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  setSelectedDatacenter: React.Dispatch<React.SetStateAction<string>>;
}
interface Description {
  headline: string;
  htmlContent: string;
}

const SelectLocationType = ({ selectedBlueprint, setSelectedBlueprint, updateForm, setSelectedDatacenter }: Props) => {
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-synthetics:dialog.createLocation.selectLocationType.contentWrapperHeadline')}
    >
      <Menu
        items={getLocationsBluePrintConfig()}
        addRightSeparator
        initialItemSelected={selectedBlueprint}
        onItemClick={item => {
          setSelectedBlueprint(item);
          setSelectedDatacenter('');
          updateForm(createNewLocationForm());
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
};

export default SelectLocationType;
