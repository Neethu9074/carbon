/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import PingOrScriptOption from 'in-synthetics/components/advanced/PingOrScriptOption';
import { AdvancedBluePrint } from 'in-synthetics/data/advancedModeBluePrints';
import { createForm } from 'in-synthetics/form/createSyntheticTestForm';
import { Col, Row } from 'in-components/layout/Grid';

import locals from './SelectedTestType.mless';

interface SelectedTestTypeProps {
  selectedBlueprint: AdvancedBluePrint;
  updateForm: (form: MapForm<any>) => void;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
}

const pingAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.apiSimple.whenToUse.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.apiSimple.whenToUse.line1')}</p>
  </>
);

const scriptAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.apiSimple.whenToUse.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.apiScript.whenToUse.line1')}</p>
  </>
);

const SelectedTestType = ({
  selectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected,
  setRenderSectionsCounter,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig
}: SelectedTestTypeProps) => {
  return (
    <div className={locals.container}>
      <div>
        {
          //Default component is RenderHttpTests
          selectedBlueprint.type === 'Browser' ? (
            <RenderBrowser selectedBlueprint={selectedBlueprint} />
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
            />
          )
        }
      </div>
      {!isUpdateConfig && (
        <Button
          kind="primary"
          className={locals.button}
          onClick={() => {
            if (testTypeSelected.simple) selectedBlueprint.testType = 'HTTPAction';
            if (testTypeSelected.script) selectedBlueprint.testType = 'HTTPScript';
            updateForm(createForm(false, selectedBlueprint, commonAttributes));
            setRenderSectionsCounter(v => v + 1);
          }}
        >
          {t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeButton')}
        </Button>
      )}
    </div>
  );
};

interface RenderHttpTestsProps {
  selectedBlueprint: AdvancedBluePrint;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isUpdateConfig: boolean;
}

const RenderHttpTests = ({
  selectedBlueprint,
  testTypeSelected,
  setTestTypeSelected,
  commonAttributes,
  setCommonAttributes,
  isUpdateConfig
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
          <PingOrScriptOption
            //The default behavior is that both testTypeSelected.simple and
            //testTypeSelected.script are false, i.e, neither Simple Test nor Script Test is selected.
            checked={!testTypeSelected.simple && !testTypeSelected.script ? simple : testTypeSelected.simple}
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpActionTitle')}
            description={pingAPIDescription}
            onChange={() => {
              setTestTypeSelected({ simple: true, script: false });
              setCommonAttributes({ ...commonAttributes, url: '', syntheticType: 'HTTPAction' });
            }}
            disabled={isUpdateConfig}
            asRadioButton
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <PingOrScriptOption
            //The default behavior is that both testTypeSelected.simple and
            //testTypeSelected.script are false, i.e, neither Simple Test nor Script Test is selected.
            checked={!testTypeSelected.simple && !testTypeSelected.script ? script : testTypeSelected.script}
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpScriptTitle')}
            description={scriptAPIDescription}
            onChange={() => {
              setTestTypeSelected({ simple: false, script: true });
              setCommonAttributes({ ...commonAttributes, script: '', syntheticType: 'HTTPScript' });
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
}

const RenderBrowser = ({ selectedBlueprint }: BaseRenderProps) => {
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
    </>
  );
};

const RenderInternetServices = ({ selectedBlueprint }: BaseRenderProps) => {
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
