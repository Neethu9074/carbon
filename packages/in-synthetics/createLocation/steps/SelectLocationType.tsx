/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Link, LoadingSkeleton, Message } from '@instana/components';
import { Trans, t } from '@instana/i18n-react';
import { Result } from '@instana/types';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { LocationsBluePrint, getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import createNewLocationForm from 'in-synthetics/createLocation/createNewLocationForm';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import SideRadioMenu from 'in-components/SideRadioMenu';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface Props {
  selectedBlueprint: LocationsBluePrint;
  setSelectedBlueprint: (item: LocationsBluePrint) => void;
  updateForm: (form: MapForm<any>) => void;
  checkLicense: Result<string>;
}
interface Description {
  headline: string;
  htmlContent: string;
}

const SelectLocationType = ({ selectedBlueprint, setSelectedBlueprint, updateForm, checkLicense }: Props) => {
  const managedPopDocsUrl = 'https://ibm.biz/Instana-hosted_PoP';
  const getWarningMessage = () => {
    if (!checkLicense.progress.loading) {
      if (checkLicense.errors.length !== 0) {
        return (
          <Message
            type="warning"
            withIcon
            bold
            className={locals.warningMessage}
            title={t('in-synthetics:dialog.createLocation.licenseCheck.title')}
            description={
              <Trans
                i18nKey="in-synthetics:dialog.createLocation.licenseCheck.description"
                components={{
                  // @ts-expect-error property children missing
                  linkLicenses: <Link className={locals.link} href={managedPopDocsUrl} external />
                }}
              />
            }
          />
        );
      } else {
        return null;
      }
    }
    return <LoadingSkeleton />;
  };
  const locationTypes = getLocationsBluePrintConfig();
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-synthetics:dialog.createLocation.selectLocationType.contentWrapperHeadline')}
    >
      <SideRadioMenu
        items={locationTypes.map(x => ({ id: x.type, name: x.name }))}
        valueSelected={selectedBlueprint.type}
        onChange={type => {
          const item = locationTypes.find(x => type === x.type);
          if (!item) return;
          setSelectedBlueprint(item);
          updateForm(createNewLocationForm(item.type));
        }}
      />
      <div className={locals.presenterWrapper}>
        {selectedBlueprint.type === 'managed' && getWarningMessage()}
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
