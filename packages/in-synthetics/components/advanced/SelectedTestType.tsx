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
}

const pingAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.pingApi.whenToUse.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.pingApi.whenToUse.line1')}</p>
  </>
);

const scriptAPIDescription = (
  <>
    <b>{t('in-synthetics:dialog.createTest.bluePrint.pingApi.whenToUse.title')}</b>
    <p>{t('in-synthetics:dialog.createTest.bluePrint.scriptApi.whenToUse.line1')}</p>
  </>
);

const SelectedTestType = ({
  selectedBlueprint,
  updateForm,
  testTypeSelected,
  setTestTypeSelected
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
            />
          )
        }
      </div>
      <Button
        kind="primary"
        className={locals.button}
        onClick={() => {
          if (testTypeSelected.simple) selectedBlueprint.testType = 'HTTPAction';
          if (testTypeSelected.script) selectedBlueprint.testType = 'HTTPScript';
          updateForm(createForm(false, selectedBlueprint));
        }}
      >
        {t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.selectedTestTypeButton')}
      </Button>
    </div>
  );
};

interface RenderHttpTestsProps {
  selectedBlueprint: AdvancedBluePrint;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
}

const RenderHttpTests = ({ selectedBlueprint, testTypeSelected, setTestTypeSelected }: RenderHttpTestsProps) => {
  return (
    <>
      <h3 className={locals.headline}>
        <span>{selectedBlueprint.description.headline}</span>
      </h3>
      <DangerousHtmlPresenter className={locals.text} html={selectedBlueprint.description.text} />
      <Row>
        <Col lg={6} className={locals.column}>
          <PingOrScriptOption
            checked={testTypeSelected.simple}
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpActionTitle')}
            description={pingAPIDescription}
            onChange={() => {
              setTestTypeSelected({ simple: true, script: false });
            }}
            asRadioButton
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <PingOrScriptOption
            checked={testTypeSelected.script}
            title={t('in-synthetics:dialog.createTest.advancedMode.testTypeSection.httpScriptTitle')}
            description={scriptAPIDescription}
            onChange={() => {
              setTestTypeSelected({ simple: false, script: true });
            }}
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
