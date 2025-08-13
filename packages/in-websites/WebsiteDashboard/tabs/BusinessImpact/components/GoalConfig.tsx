/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Card, Checkbox, Spacer, Typography } from '@instana/components';
import { Button, Select, TextArea, TextInput } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';

import local from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/GoalConfig.mless';

interface BeaconType {
  value: string;
  text: string;
}

export default function GoalConfig() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const beacons: BeaconType[] = [
    {
      value: 'pageLoads',
      text: t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconLoads')
    },
    {
      value: 'pageTransitions',
      text: t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconTransitions')
    },
    {
      value: 'httpRequest',
      text: t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconHttp')
    },
    {
      value: 'customEvents',
      text: t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconCustom')
    }
  ];

  return (
    <div className={local.flexDiv}>
      <div className={local.cardDiv}>
        <Card useMaxAvailableHeight={false}>
          <div className={local.cardContents}>
            <Typography variant="heading-03">
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.header')}
            </Typography>
            <Typography variant="heading-compact-02">
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalDetailsSection')}
            </Typography>
            <div className={local.stepDescription}>
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalDetailsDescription')}
            </div>

            <TextInput
              id="goalNameInput"
              labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.nameInput')}
              className={local.textInput}
            />
            <TextArea
              labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.descriptionArea')}
              enableCounter
              maxCount={200}
            />

            <Typography variant="heading-02">
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalBuildSection')}
            </Typography>
            <div className={local.stepDescription}>
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.goalBuildDescription')}
            </div>

            <Select
              id="beaconTypeSelect"
              labelText={t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconSelect')}
              className={local.select}
            >
              {beacons.map(beacon => (
                <option value={beacon.value} key={beacon.value}>
                  {beacon.text}
                </option>
              ))}
            </Select>

            <Card useMaxAvailableHeight={false}>
              <div className={local.filterContents}>
                <Typography variant={'heading-02'}>
                  {t('in-websites:websiteDashboard.tabs.businessImpact.tearsheet.beaconFilter')}
                </Typography>
                {/* TODO: placeholder for wireframes */}
                <BusinessProcessQueryBuilder value={[]} onChange={() => {}} />
              </div>
            </Card>
          </div>
        </Card>

        <Spacer vertical="large" />

        <Card useMaxAvailableHeight={false}>
          <div className={local.cardContents}>
            <Typography variant="heading-03">
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.removeGoalHeader')}
            </Typography>

            <div className={local.removeText}>
              <Typography variant="body-regular">
                {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.removeGoalText')}
                <strong>{t('in-websites:websiteDashboard.tabs.businessImpact.configuration.removeGoalWarning')}</strong>
              </Typography>
            </div>

            <Checkbox
              label={t('in-websites:websiteDashboard.tabs.businessImpact.configuration.removeGoalConfirm')}
              onChange={e => {
                setCheckboxChecked(e.target.checked);
              }}
            />

            <Button kind="danger" className={local.removeButton} disabled={!checkboxChecked}>
              {t('in-websites:websiteDashboard.tabs.businessImpact.configuration.removeGoalButton')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
