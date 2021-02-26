/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export const roles = Object.freeze([
  { value: 'preferNotToSay', label: t('in-settings:terms.preferNotToSay') },
  { value: 'frontendDeveloper', label: t('in-settings:terms.frontendDeveloper') },
  { value: 'backendDeveloper', label: t('in-settings:terms.backendDeveloper') },
  { value: 'businessManager', label: t('in-settings:terms.businessManager') },
  { value: 'devOps', label: t('in-settings:terms.devOpsEngineer') },
  { value: 'siteReliability', label: t('in-settings:terms.siteReliabilityEngineer') },
  { value: 'productManager', label: t('in-settings:terms.productManager') },
  { value: 'itOperations', label: t('in-settings:terms.itOperations') },
  { value: 'itDecisionMaker', label: t('in-settings:terms.itDecisionMaker') },
  { value: 'support', label: t('in-settings:terms.support') },
  { value: 'other', label: t('in-settings:terms.otherPleaseSpecify') }
]);
