/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import SimpleOrScriptOption from 'in-synthetics/createTests/advanced/SimpleOrScriptOption';
import { AdvancedBluePrint } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { Code, ConfigItem, TestTypeSelected } from 'in-synthetics/utils/constants';
import { syntheticBrowserScriptEnabled } from 'in-services/featureFlags';
import { Col, Row } from 'in-components/layout/Grid';
import { isBlank } from 'in-services/util/string';

import locals from 'in-synthetics/createTests/advanced/SelectedTestType.mless';

interface SelectedTestTypeProps {
  selectedBlueprint: AdvancedBluePrint;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  setHeaders: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
}

const pingAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.apiSimple.whenToUse.line1')}</p>
  </>
);

const scriptAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.apiScript.whenToUse.line1')}</p>
  </>
);

const simpleBrowserDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.browserSimple.whenToUse.line1')}</p>
  </>
);

const scriptBrowserDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.browserScript.whenToUse.line1')}</p>
  </>
);

const SelectedTestType = ({
  selectedBlueprint,
  form,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails,
  setHeaders
}: SelectedTestTypeProps) => {
  const populateCommonAttributes = (form: MapForm<any>) => {
    commonAttributes['url'] = '';
    commonAttributes['testFrequency'] = form.get('testFrequency').value;
    commonAttributes['locations'] = form.get('locations').value;
    commonAttributes['label'] = form.get('label').value;
    commonAttributes['description'] = form.get('description').value;
    commonAttributes['applicationId'] = form.get('applicationId').value;
    commonAttributes['script'] = '';
    commonAttributes['customProperties'] = form.get('customProperties').value;
    setCommonAttributes(commonAttributes);
    updateForm(createForm(false, selectedBlueprint, commonAttributes));
  };

  return (
    <div className={locals.container}>
      <div>
        {
          //Default component is RenderHttpTests
          selectedBlueprint.type === 'Browser' ? (
            <RenderBrowser
              selectedBlueprint={selectedBlueprint}
              testTypeSelected={testTypeSelected}
              setTestTypeSelected={setTestTypeSelected}
              commonAttributes={commonAttributes}
              setCommonAttributes={setCommonAttributes}
              isUpdateConfig={isUpdateConfig}
              setScriptDetails={setScriptDetails}
            />
          ) : selectedBlueprint.type === 'Internet Services' ? (
            <RenderInternetServices selectedBlueprint={selectedBlueprint} />
          ) : (
            <RenderHttpTests
              selectedBlueprint={selectedBlueprint}
              testTypeSelected={testTypeSelected}
              setTestTypeSelected={setTestTypeSelected}
              commonAttributes={commonAttributes}
              setCommonAttributes={setCommonAttributes}
              isUpdateConfig={isUpdateConfig}
              setScriptDetails={setScriptDetails}
            />
          )
        }
      </div>
      {!isUpdateConfig && (
        <Button
          kind="primary"
          className={locals.button}
          onClick={() => {
            if (testTypeSelected?.api.simple) selectedBlueprint.testType = 'HTTPAction';
            if (testTypeSelected?.api.script) selectedBlueprint.testType = 'HTTPScript';
            if (testTypeSelected?.browser.simple) selectedBlueprint.testType = 'WebpageAction';
            if (testTypeSelected?.browser.script) selectedBlueprint.testType = 'BrowserScript';
            populateCommonAttributes(form);
            setRenderSectionsCounter(v => v + 1);
            setHeaders([
              {
                id: generateUniqueShortId(),
                key: '',
                value: '',
                error: {
                  name: { invalid: false, message: '' },
                  value: { invalid: false, message: '' }
                }
              }
            ]);
          }}
          disabled={isBlank(commonAttributes.syntheticType)}
        >
          {t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeButton')}
        </Button>
      )}
    </div>
  );
};

interface RenderHttpTestsProps {
  selectedBlueprint: AdvancedBluePrint;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

const RenderHttpTests = ({
  selectedBlueprint,
  testTypeSelected,
  setTestTypeSelected,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails
}: RenderHttpTestsProps) => {
  const simple: boolean = commonAttributes.syntheticType === 'HTTPAction' ? true : false;
  const script: boolean = commonAttributes.syntheticType === 'HTTPScript' ? true : false;
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
      <Row>
        <Col lg={6} className={locals.column}>
          <SimpleOrScriptOption
            //The default behavior is that both testTypeSelected.simple and
            //testTypeSelected.script are false, i.e, neither Simple Test nor Script Test is selected.
            checked={
              !testTypeSelected?.api.simple && !testTypeSelected?.api.script ? simple : testTypeSelected?.api.simple
            }
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpActionTitle')}
            description={pingAPIDescription}
            onChange={() => {
              //@ts-expect-error
              setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
                return { ...prevState, api: { simple: true, script: false } };
              });
              setCommonAttributes({ ...commonAttributes, url: '', syntheticType: 'HTTPAction' });
              setScriptDetails({ modified: false, name: '' });
            }}
            disabled={isUpdateConfig}
            asRadioButton
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <SimpleOrScriptOption
            //The default behavior is that both testTypeSelected.simple and
            //testTypeSelected.script are false, i.e, neither Simple Test nor Script Test is selected.
            checked={
              !testTypeSelected?.api.simple && !testTypeSelected?.api.script ? script : testTypeSelected?.api.script
            }
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpScriptTitle')}
            description={scriptAPIDescription}
            onChange={() => {
              //@ts-expect-error
              setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
                return { ...prevState, api: { simple: false, script: true } };
              });
              setCommonAttributes({ ...commonAttributes, script: '', syntheticType: 'HTTPScript' });
              setScriptDetails({ modified: false, name: '' });
            }}
            disabled={isUpdateConfig}
            asRadioButton
          />
        </Col>
      </Row>
    </>
  );
};

interface BaseRenderProps {
  selectedBlueprint: AdvancedBluePrint;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

const RenderBrowser = ({
  selectedBlueprint,
  testTypeSelected,
  setTestTypeSelected,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails
}: BaseRenderProps) => {
  const simple: boolean = commonAttributes.syntheticType === 'WebpageAction' ? true : false;
  const script: boolean =
    commonAttributes.syntheticType === 'BrowserScript' || commonAttributes.syntheticType === 'WebpageScript'
      ? true
      : false;
  const isBrowserTest: boolean = selectedBlueprint.type === 'Browser' && syntheticBrowserScriptEnabled;
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
      <Row>
        <Col lg={6} className={locals.column}>
          <SimpleOrScriptOption
            checked={
              !testTypeSelected?.browser.simple && !testTypeSelected?.browser.script
                ? simple
                : testTypeSelected?.browser.simple
            }
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.browserSimpleTitle')}
            description={simpleBrowserDescription}
            onChange={() => {
              //@ts-expect-error
              setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
                return { ...prevState, browser: { simple: true, script: false } };
              });
              setCommonAttributes({ ...commonAttributes, url: '', syntheticType: 'WebpageAction' });
              setScriptDetails({ modified: false, name: '' });
            }}
            disabled={isUpdateConfig}
            asRadioButton
            isBrowserTest={isBrowserTest}
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <SimpleOrScriptOption
            checked={
              !testTypeSelected?.browser.simple && !testTypeSelected?.browser.script
                ? script
                : testTypeSelected?.browser.script
            }
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.browserScriptTitle')}
            description={scriptBrowserDescription}
            onChange={() => {
              //@ts-expect-error
              setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
                return { ...prevState, browser: { simple: false, script: true } };
              });
              setCommonAttributes({ ...commonAttributes, script: '', syntheticType: 'BrowserScript' });
              setScriptDetails({ modified: false, name: '' });
            }}
            disabled={isUpdateConfig}
            asRadioButton
            isBrowserTest={isBrowserTest}
          />
        </Col>
      </Row>
    </>
  );
};

interface RenderInternetServicesProps {
  selectedBlueprint: AdvancedBluePrint;
}

const RenderInternetServices = ({ selectedBlueprint }: RenderInternetServicesProps) => {
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
    </>
  );
};

export default SelectedTestType;
