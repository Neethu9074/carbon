/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

//import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-components/layout/Grid';
import PingOrScriptOption from 'in-synthetics/components/advanced/PingOrScriptOption';

import locals from './SelectedTestType.mless';

interface SelectedTestTypeProps {
  form: MapForm;
  updateForm: (form: MapForm) => void;
  typeSelected: { ping: boolean; script: boolean };
  setTypeSelected: (type: { ping: boolean; script: boolean }) => void;
}

const SelectedTestType = ({ form, updateForm, typeSelected, setTypeSelected }: SelectedTestTypeProps) => {
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
  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>
          <span>{t('in-synthetics:dialog.createTest.advancedMode.selectedTestTypeTitle')}</span>
        </h3>
        <p className={locals.text}>
          {t('in-synthetics:dialog.createTest.advancedMode.selectedTestTypeTitleDescription')}
        </p>
        <Row>
          <Col lg={6} className={locals.column}>
            <PingOrScriptOption
              checked={typeSelected.ping}
              title={t('in-synthetics:dialog.createTest.advancedMode.httpActionTitle')}
              description={pingAPIDescription}
              onChange={() => {
                setTypeSelected({ ping: true, script: false });
                updateForm(
                  form.updateIn(['configuration', 'syntheticType'], (field: Item) =>
                    (field as Field<string>).setValue('HTTPAction').setTouched(true)
                  )
                );
              }}
              asRadioButton
            />
          </Col>
          <Col lg={6} className={locals.column}>
            <PingOrScriptOption
              checked={typeSelected.script}
              title={t('in-synthetics:dialog.createTest.advancedMode.httpScriptTitle')}
              description={scriptAPIDescription}
              disabled
              onChange={() => {
                setTypeSelected({ ping: false, script: true });
                updateForm(
                  form.updateIn(['configuration', 'syntheticType'], (field: Item) =>
                    (field as Field<string>).setValue('HTTPScript').setTouched(true)
                  )
                );
              }}
              asRadioButton
            />
          </Col>
        </Row>
      </div>
      <Button kind="primary" className={locals.button}>
        {t('in-synthetics:dialog.createTest.advancedMode.selectedTestTypeButton')}
      </Button>
    </div>
  );
};

export default SelectedTestType;
