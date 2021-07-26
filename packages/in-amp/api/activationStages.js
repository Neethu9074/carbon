/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { t } from 'in-i18n';

/**
 * The activation stages of a tenant unit.
 * Each stage represents a certain threshold that is passed by utilizing the environment.
 */
const ACTIVATION_STAGES = [
  { key: 'c', label: t('in-amp:components.activationAdoption.activationStages.createDate') },
  { key: 'fs', label: t('in-amp:components.activationAdoption.activationStages.firstSignIn') },
  { key: 'fa', label: t('in-amp:components.activationAdoption.activationStages.firstAgentInstalled') },
  { key: 'au', label: t('in-amp:components.activationAdoption.activationStages.additionalUserInvited') },
  { key: 'ai', label: t('in-amp:components.activationAdoption.activationStages.threeAgentsInstalled') },
  { key: 'ap', label: t('in-amp:components.activationAdoption.activationStages.twoApplicationPerspectivesCreated') },
  { key: 'as', label: t('in-amp:components.activationAdoption.activationStages.oneAlertSetUpAndActivated') },
  { key: 'w', label: t('in-amp:components.activationAdoption.activationStages.oneWebsiteMonitored') },
  { key: 'u', label: t('in-amp:components.activationAdoption.activationStages.fiveUsers') }
];

export default ACTIVATION_STAGES;
