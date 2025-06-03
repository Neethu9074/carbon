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

import {
  Code,
  ConfigItem,
  SSLCertificateTest,
  TestTypeSelected,
  AssertionTargetFilter
} from 'in-synthetics/utils/constants';
import { getDefaultTargetFilters } from 'in-synthetics/createTests/utils/getDefaultTargetFilters';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import SimpleOrScriptOption from 'in-synthetics/createTests/advanced/SimpleOrScriptOption';
import { AdvancedBluePrint } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
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
  setTargetFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
  setValidationFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
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

const certificateCheckDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.certificateCheck.whenToUse.line1')}</p>
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
  setHeaders,
  setTargetFilters,
  setValidationFilters
}: SelectedTestTypeProps) => {
  const populateCommonAttributes = () => {
    commonAttributes['url'] = '';
    commonAttributes['testFrequency'] = selectedBlueprint.type === SSLCertificateTest ? 1440 : 15;
    commonAttributes['locations'] = form.get('locations').value;
    commonAttributes['label'] = form.get('label').value;
    commonAttributes['description'] = form.get('description').value;
    commonAttributes['applicationId'] = form.get('applicationId')?.value;
    commonAttributes['script'] = '';
    commonAttributes['customProperties'] = form.get('customProperties').value;
    commonAttributes['applications'] = form.get('applications')?.value ?? [];
    commonAttributes['websites'] = form.get('websites')?.value ?? [];
    commonAttributes['mobileApps'] = form.get('mobileApps')?.value ?? [];
    setCommonAttributes(commonAttributes);
    updateForm(createForm(false, selectedBlueprint, commonAttributes));
  };

  const renderSubCategories = () => {
    switch (selectedBlueprint.type) {
      case 'Browser':
        return (
          <RenderBrowser
            selectedBlueprint={selectedBlueprint}
            testTypeSelected={testTypeSelected}
            setTestTypeSelected={setTestTypeSelected}
            commonAttributes={commonAttributes}
            setCommonAttributes={setCommonAttributes}
            isUpdateConfig={isUpdateConfig}
            setScriptDetails={setScriptDetails}
          />
        );
      case 'Internet Services':
        return <RenderInternetServices selectedBlueprint={selectedBlueprint} />;
      case 'Certificate Check':
        return (
          <RenderCertificateCheck
            selectedBlueprint={selectedBlueprint}
            setTestTypeSelected={setTestTypeSelected}
            testTypeSelected={testTypeSelected}
            commonAttributes={commonAttributes}
            setCommonAttributes={setCommonAttributes}
            isUpdateConfig={isUpdateConfig}
            setScriptDetails={setScriptDetails}
          />
        );
      case 'DNS':
        return <RenderDNSTest selectedBlueprint={selectedBlueprint} />;
      default:
        return (
          <RenderHttpTests
            selectedBlueprint={selectedBlueprint}
            testTypeSelected={testTypeSelected}
            setTestTypeSelected={setTestTypeSelected}
            commonAttributes={commonAttributes}
            setCommonAttributes={setCommonAttributes}
            isUpdateConfig={isUpdateConfig}
            setScriptDetails={setScriptDetails}
          />
        );
    }
  };

  return (
    <div className={locals.container}>
      <div>{renderSubCategories()}</div>
      {!isUpdateConfig && (
        <Button
          kind="primary"
          className={locals.button}
          onClick={() => {
            if (testTypeSelected?.api.simple) selectedBlueprint.testType = 'HTTPAction';
            if (testTypeSelected?.api.script) selectedBlueprint.testType = 'HTTPScript';
            if (testTypeSelected?.browser.simple) selectedBlueprint.testType = 'WebpageAction';
            if (testTypeSelected?.browser.script) selectedBlueprint.testType = 'BrowserScript';
            if (testTypeSelected?.ssl.simple) selectedBlueprint.testType = 'SSLCertificate';
            if (testTypeSelected?.dns.simple) selectedBlueprint.testType = 'DNS';
            populateCommonAttributes();
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
            if (testTypeSelected?.ssl.simple) {
              setValidationFilters(getDefaultTargetFilters());
            } else if (testTypeSelected?.dns.simple) {
              setTargetFilters(getDefaultTargetFilters());
            }
          }}
          disabled={isBlank(commonAttributes.syntheticType)}
        >
          {t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeButton')}
        </Button>
      )}
    </div>
  );
};

// Certificate Check
interface RenderCertificateCheckProps {
  selectedBlueprint: AdvancedBluePrint;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  testTypeSelected: TestTypeSelected;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

const RenderCertificateCheck = ({
  selectedBlueprint,
  setTestTypeSelected,
  testTypeSelected,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig,
  setScriptDetails
}: RenderCertificateCheckProps) => {
  const simple: boolean = commonAttributes.syntheticType === 'SSLCertificate' ? true : false;
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
      <Row>
        <Col lg={8} className={locals.column}>
          <SimpleOrScriptOption
            checked={!testTypeSelected?.ssl.simple ? simple : testTypeSelected?.ssl.simple}
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.certificateCheckTitle')}
            description={certificateCheckDescription}
            onChange={() => {
              //@ts-expect-error
              setTestTypeSelected((prevState: SetStateAction<TestTypeSelected>) => {
                return { ...prevState, ssl: { simple: true } };
              });
              setCommonAttributes({ ...commonAttributes, script: '', syntheticType: commonAttributes.syntheticType });
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

const RenderDNSTest = ({ selectedBlueprint }: { selectedBlueprint: AdvancedBluePrint }) => {
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
    </>
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
  const simple: boolean = commonAttributes.syntheticType === 'WebpageAction';
  const script: boolean = !!(
    commonAttributes.syntheticType === 'BrowserScript' || commonAttributes.syntheticType === 'WebpageScript'
  );
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
