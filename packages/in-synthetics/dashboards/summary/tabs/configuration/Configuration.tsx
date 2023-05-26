/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, LoadingSkeleton, Stack, SvgIcon } from '@instana/components';
import { SyntheticTest } from '@instana/types';
import { t } from '@instana/i18n-react';

import EditConfigurationDialogPresenter from 'in-synthetics/dashboards/summary/tabs/configuration/actions/EditConfigurationDialogPresenter';
import CustomProperties from 'in-synthetics/dashboards/summary/tabs/configuration/sections/CustomProperties';
import ConfigSection from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Configuration';
import Locations from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Locations';
import TestType from 'in-synthetics/dashboards/summary/tabs/configuration/sections/TestType';
import Schedule from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Schedule';
import Identify from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Identify';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { syntheticBrowserScriptEnabled } from 'in-services/featureFlags';
import { TestResponse } from 'in-synthetics/utils/constants';
import Header from 'in-components/workspace/Header/Header';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface ConfigurationProps {
  test: TestResponse;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

interface ActionButtonProps {
  test: SyntheticTest;
}

const Configuration = ({ test, setReloadCount }: ConfigurationProps) => {
  const isBrowserScriptTest: boolean =
    (test.data.configuration.syntheticType === 'BrowserScript' ||
      test.data.configuration.syntheticType === 'WebpageScript') &&
    syntheticBrowserScriptEnabled;

  function openEditConfigDialog(test: SyntheticTest) {
    addActiveDialog(
      <EditConfigurationDialogPresenter
        test={test}
        onClose={() => {
          close();
        }}
        setReloadCount={setReloadCount}
      />
    );
  }

  const ActionButtons = ({ test }: ActionButtonProps) => {
    return (
      <Stack gap="normal" direction="horizontal">
        <SvgIcon color={'#00B3B3'} type={'lib_actions_edit'} onClick={() => openEditConfigDialog(test)} />
        {/* <SvgIcon type={'lib_actions_copy'} /> */}
        {/* <SvgIcon type={'lib_actions_delete'} /> */}
      </Stack>
    );
  };

  const renderActionButton = (isBrowserEnabled: boolean) => {
    if (isBrowserEnabled) {
      return undefined;
    }
    return <ActionButtons test={test.data} />;
  };

  if (test.progress.loading) {
    return <LoadingSkeleton className={locals.skeleton} />;
  }
  const testType: string = test.data.configuration.syntheticType === 'HTTPAction' ? 'Simple' : 'Script';
  return (
    <Card
      leftHeaderContent={
        <Header>
          {t('in-synthetics:dashboard.configuration.configurationTitle', {
            testType: testType
          })}
        </Header>
      }
      rightHeaderContent={renderActionButton(isBrowserScriptTest)}
    >
      <TestType test={test.data} />
      <ConfigSection test={test.data} />
      <Locations test={test.data} />
      <Schedule test={test.data} />
      <Identify test={test.data} />
      <CustomProperties test={test.data} />
    </Card>
  );
};

export default Configuration;
