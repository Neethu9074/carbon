/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Typography } from '@instana/components';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import IconButton from 'in-components/IconButton/IconButton';
import Menu from 'in-components/Menu';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep1.mless';

export default function AlertConfigTearSheetStep1({ form, updateForm }) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, isBeta, text, type } = blueprintConfig;

  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || type === 'logs'
      ? simpleModeBlueprintConfigs
      : simpleModeBlueprintConfigs.filter(config => config.type !== 'logs');

  const [slideInConfig, setSlideInConfig] = useState(null);
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);

  const setSliderState = ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  return (
    <TearSheetStepContentWrapper headline={t('in-alerting:smartAlerts.applications.simple.simpleAlertStep1Headline')}>
      <div className={locals.container}>
        <Menu
          items={blueprintConfigList}
          onItemClick={item => {
            updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, true));
          }}
          initialItemSelected={blueprintConfig}
          addRightSeparator
        />

        <AlertTypeSwitch
          alertType={alertType}
          renderLogs={() => (
            <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta}>
              {!slideInViewVisible ? (
                <ProvideLogMessage
                  form={form}
                  updateForm={updateForm}
                  onSelectLogMessage={setSliderState}
                  mode="Simple"
                  timeConfig={{
                    windowSize: alertingDialogItemPickerTimeframe
                  }}
                />
              ) : (
                <>
                  <div
                    className={classNames({
                      [locals.header]: true
                    })}
                  >
                    <span className={locals.titleContainer}>
                      <IconButton
                        iconSize="regular"
                        type="lib_arrow_left"
                        onClick={() => setSlideInViewVisible(false)}
                        alignment="left"
                      />
                      <Typography variant="heading-200">
                        {t('in-alerting:smartAlerts.applications.logMessages.selectLogMessageTitle')}
                      </Typography>
                    </span>
                  </div>
                  <div className={locals.slideIn}>{slideInConfig?.component}</div>
                </>
              )}
            </SelectedBlueprintPresenter>
          )}
          renderSlowness={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
          renderErrorRate={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
          renderStatusCode={() => (
            <SelectedBlueprintPresenter title={headline} description={text}>
              <ProvideStatusCode form={form} updateForm={updateForm} />
            </SelectedBlueprintPresenter>
          )}
          renderThroughput={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
        />
      </div>
    </TearSheetStepContentWrapper>
  );
}
