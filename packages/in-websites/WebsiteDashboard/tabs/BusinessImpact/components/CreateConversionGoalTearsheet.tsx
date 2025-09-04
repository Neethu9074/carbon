/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CreateTearsheet, CreateTearsheetStep } from '@instana/ibm-products';
import { Card, Spacer, Typography } from '@instana/components';
import { Select, TextArea, TextInput } from '@instana/carbon';

import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import { t } from 'in-i18n';

import local from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/CreateConversionGoalTearsheet.mless';

interface CreateConversionGoalTearsheetProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export default function CreateConversionGoalTearsheet({ open, setOpen }: CreateConversionGoalTearsheetProps) {
  return (
    <CreateTearsheet
      open={open}
      title={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.title')}
      backButtonText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.back')}
      cancelButtonText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.cancel')}
      nextButtonText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.next')}
      submitButtonText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.submit')}
      onRequestSubmit={() => {}}
      onClose={() => setOpen(false)}
    >
      <div className={local.tearsheet}>
        <CreateTearsheetStep
          hasFieldset={false}
          title={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.stepOne')}
        >
          <div className={local.stepDescription}>
            {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalDetailsDescription')}
          </div>

          <TextInput
            className={local.textInput}
            id="goalNameInput"
            labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.nameInput')}
          />
          <TextArea
            className={local.textArea}
            labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.descriptionArea')}
            enableCounter
            maxCount={200}
          />
        </CreateTearsheetStep>
      </div>
      <div className={local.tearsheet}>
        <CreateTearsheetStep
          hasFieldset={false}
          title={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.stepTwo')}
        >
          <div className={local.stepDescription}>
            {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalBuildDescription')}
          </div>

          <Select
            id="beaconTypeSelect"
            labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconSelect')}
          >
            <option value="pageLoads">
              {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconLoads')}
            </option>
            <option value="pageTransitions">
              {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconTransitions')}
            </option>
            <option value="httpRequest">
              {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconHttp')}
            </option>
            <option value="customEvents">
              {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconCustom')}
            </option>
          </Select>
          <Spacer vertical="medium" />
          <Card useMaxAvailableHeight={false}>
            <Typography variant={'heading-03'}>
              {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconFilter')}
            </Typography>
            {/* TODO: placeholder for wireframes */}
            <BusinessProcessQueryBuilder value={[]} onChange={() => {}} />
          </Card>
        </CreateTearsheetStep>
      </div>
    </CreateTearsheet>
  );
}
