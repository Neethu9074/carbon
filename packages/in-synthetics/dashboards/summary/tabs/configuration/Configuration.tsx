/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, LoadingSkeleton, Stack, SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import CustomProperties from 'in-synthetics/dashboards/summary/tabs/configuration/sections/CustomProperties';
import ConfigSection from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Configuration';
import Locations from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Locations';
import TestType from 'in-synthetics/dashboards/summary/tabs/configuration/sections/TestType';
import Schedule from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Schedule';
import Identify from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Identify';
import { TestResponse } from 'in-synthetics/utils/constants';
import Header from 'in-components/workspace/Header/Header';

interface Props {
  test: TestResponse;
}

const ActionButtons = () => {
  return (
    <Stack gap="normal" direction="horizontal">
      <SvgIcon type={'lib_actions_edit'} />
      {/* <SvgIcon type={'lib_actions_copy'} /> */}
      <SvgIcon type={'lib_actions_delete'} />
    </Stack>
  );
};

const Configuration = ({ test }: Props) => {
  if (test.progress.loading) {
    return <LoadingSkeleton />;
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
      rightHeaderContent={<ActionButtons />}
    >
      <TestType test={test.data} />
      <ConfigSection test={test.data} />
      <Locations />
      <Schedule />
      <Identify />
      <CustomProperties />
    </Card>
  );
};

export default Configuration;
