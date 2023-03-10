/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ConfigurationSection from 'in-synthetics/components/advanced/ConfigurationSection';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';

const AdvancedMode = ({ form, updateForm }: AdvancedModeProps) => {
  return (
    <StepsContainer
      navItems={[
        {
          scrollId: '1',
          label: t('in-synthetics:dialog.createTest.advancedMode.configurationLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.configurationTitle'),
          valid: true,
          content: <ConfigurationSection form={form} updateForm={updateForm} />
        },
        {
          scrollId: '2',
          label: t('in-synthetics:dialog.createTest.advancedMode.locationsLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.locationsTitle'),
          valid: true,
          content: <div>Locations section here..</div>
        },
        {
          scrollId: '3',
          label: t('in-synthetics:dialog.createTest.advancedMode.scheduleLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.scheduleTitle'),
          valid: true,
          content: <div>Schedule section here</div>
        },
        {
          scrollId: '4',
          label: t('in-synthetics:dialog.createTest.advancedMode.identifyLabel'),
          title: t('in-synthetics:dialog.createTest.advancedMode.identifyTitle'),
          valid: true,
          content: <div>Identify section here</div>
        }
      ]}
    />
  );
};

export default AdvancedMode;
