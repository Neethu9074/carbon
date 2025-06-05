/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { RadioTile, Stack, TextInput, Checkbox, Grid, Column, Row } from '@instana/carbon';
import { Typography } from '@instana/components';

import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { isControlledEnvEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from 'in-plg/components/NoviceToPro/RoleSelector/StepOne.mless';

interface TileComponentProps {
  value: string;
  label: string;
  id: string;
  selectedRole: string | null;
  setSelectedRole: (role: string) => void;
}

interface StepOneProps {
  selectedRole: string | null;
  setSelectedRole: (role: string) => void;
  customRole: string;
  setCustomRole: (role: string) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

const roles = Object.freeze([
  {
    id: 'frontendDeveloper',
    value: 'frontendDeveloper',
    label: t('in-plg:trialNoviceToProDialog.roles.frontendDeveloper')
  },
  {
    id: 'backendDeveloper',
    value: 'backendDeveloper',
    label: t('in-plg:trialNoviceToProDialog.roles.backendDeveloper')
  },
  {
    id: 'businessManager',
    value: 'businessManager',
    label: t('in-plg:trialNoviceToProDialog.roles.businessManager')
  },
  {
    id: 'devOps',
    value: 'devOps',
    label: t('in-plg:trialNoviceToProDialog.roles.devOpsEngineer')
  },
  {
    id: 'siteReliability',
    value: 'siteReliability',
    label: t('in-plg:trialNoviceToProDialog.roles.siteReliabilityEngineer')
  },
  {
    id: 'itOperations',
    value: 'itOperations',
    label: t('in-plg:trialNoviceToProDialog.roles.itOperations')
  },
  {
    id: 'itDecisionMaker',
    value: 'itDecisionMaker',
    label: t('in-plg:trialNoviceToProDialog.roles.itDecisionMaker')
  },
  { id: 'support', value: 'support', label: t('in-plg:trialNoviceToProDialog.roles.support') },
  {
    id: 'productManager',
    value: 'productManager',
    label: t('in-plg:trialNoviceToProDialog.roles.productManager')
  },
  { id: 'preferNotToSay', value: 'preferNotToSay', label: t('in-plg:trialNoviceToProDialog.roles.preferNotToSay') },
  { id: 'other', value: 'other', label: t('in-plg:trialNoviceToProDialog.roles.other') }
]);

const TileComponent = ({ value, label, id, selectedRole, setSelectedRole }: TileComponentProps) => {
  const isSelected = selectedRole === value;
  return (
    <RadioTile
      id={id}
      className={locals.card}
      value={value}
      checked={isSelected}
      onChange={() => setSelectedRole(value)}
    >
      <div className={locals.cardWrapper}>
        <Stack orientation="horizontal">
          <Stack orientation="vertical" gap="xxsmall">
            <Typography variant="body-compact-01">{label}</Typography>
          </Stack>
        </Stack>
      </div>
    </RadioTile>
  );
};

export function StepOne({
  selectedRole,
  setSelectedRole,
  customRole,
  setCustomRole,
  checked,
  setChecked
}: StepOneProps) {
  return (
    <LeftRightPadding>
      <Stack className={locals.spacing} gap={8} orientation="vertical">
        <Stack gap={8} orientation="vertical" />
        <Typography variant="heading-03">{t('in-plg:trialNoviceToProDialog.description')}</Typography>
        <Row>
          <Grid fullWidth condensed className={locals.grid}>
            {roles.map(role => (
              <Column key={role.id} lg={5} md={4}>
                <TileComponent
                  value={role.value}
                  id={role.id}
                  label={role.label}
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                />
              </Column>
            ))}
          </Grid>
          <Grid fullWidth condensed className={locals.grid}>
            <Column lg={15} md={8}>
              {selectedRole === 'other' && (
                <TextInput
                  id="otherRoleInput"
                  labelText={t('in-plg:trialNoviceToProDialog.yourRole')}
                  placeholder={t('in-plg:trialNoviceToProDialog.roleName')}
                  helperText={t('in-plg:trialNoviceToProDialog.specifyRole')}
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                />
              )}
            </Column>
          </Grid>
          {!isControlledEnvEnabled && (
            <Grid fullWidth condensed className={locals.grid}>
              <Column lg={15} md={8}>
                <Checkbox
                  id="userTestingGroup"
                  labelText={t('in-plg:trialNoviceToProDialog.checkboxText')}
                  checked={checked}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked)}
                />
              </Column>
            </Grid>
          )}
        </Row>
      </Stack>
    </LeftRightPadding>
  );
}
