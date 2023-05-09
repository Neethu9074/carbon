/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';
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

const Configuration = ({ test }: Props) => {
  return (
    <Card>
      <Header>{t('in-synthetics:dashboard.configuration.configurationTitle')}</Header>
      <TestType test={test} />
      <ConfigSection />
      <Locations />
      <Schedule />
      <Identify />
      <CustomProperties />
    </Card>
  );
};

export default Configuration;
