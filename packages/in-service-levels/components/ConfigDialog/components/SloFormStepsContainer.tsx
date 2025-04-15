/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import SloNameAndTagsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloNameAndTagsSection/SloNameAndTagsSection';
import SloBlueprintsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloBlueprintsSection';
import SloObjectiveSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/SloObjectiveSection';
import SloEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntitySection';
import SloScopeSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeSection';
import SloFormPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloFormPreview';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { NavItem } from 'in-components/SideNav/SideNav';
import { t } from 'in-i18n';

export default function SloFormStepsContainer() {
  const { form } = useContext(SloFormContext);
  const navItems = getSloFormNavItems(form);

  return <StepsContainer navItems={navItems} noDivider noHeader />;
}

function getApplicationAndWebsiteNavItems(form: SloForm): NavItem[] {
  const entityIdField = form.getIn(['entity', 'entityIds']);
  const tagFilterField = form.getIn(['scope', 'tagFilterExpression']);
  const nameField = form.getIn(['nameTags', 'name']);
  const targetField = form.getIn(['objective', 'target']);
  const indicatorForm = form.get('indicator');
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const dateField = form.getIn(['objective', 'startTimestamp', 'date']);
  const timeField = form.getIn(['objective', 'startTimestamp', 'time']);

  const isEntityIdFieldValid = isFieldValid(entityIdField);
  const isNameValid = isFieldValid(nameField);
  const isTargetFieldValid = isFieldValid(targetField);
  const isThresholdValid = isFieldValid(thresholdField);
  const isIndicatorValid = isFieldValid(indicatorForm);
  const isDateFieldValid = isFieldValid(dateField);
  const isTimeFieldValid = isFieldValid(timeField);
  const tagFilterFieldValid = isFieldValid(tagFilterField);

  return [
    {
      content: <SloEntitySection />,
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      scrollId: '1-select-entity',
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: isEntityIdFieldValid
    },
    {
      content: <SloScopeSection />,
      label: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      scrollId: '2-select-scope',
      title: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      valid: tagFilterFieldValid
    },
    {
      content: <SloBlueprintsSection />,
      label: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      scrollId: '3-select-indicator',
      title: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      valid: isIndicatorValid && isThresholdValid
    },
    {
      content: <SloObjectiveSection />,
      label: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      scrollId: '3-select-objective',
      title: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      valid: isTargetFieldValid && isDateFieldValid && isTimeFieldValid
    },
    {
      content: <SloNameAndTagsSection />,
      label: t('in-service-levels:createSloDialog.nameAndTagsTitle'),
      scrollId: '4-name-and-tags',
      title: t('in-service-levels:createSloDialog.nameAndTagsTitle'),
      valid: isNameValid
    },
    {
      content: <SloFormPreview />,
      label: t('in-service-levels:createSloDialog.previewSection.title'),
      scrollId: '6-preview',
      title: t('in-service-levels:createSloDialog.previewSection.title'),
      valid: true
    }
  ];
}

function getSyntheticTestNavItems(form: SloForm): NavItem[] {
  const entityIdField = form.getIn(['entity', 'entityIds']);
  const nameField = form.getIn(['nameTags', 'name']);
  const targetField = form.getIn(['objective', 'target']);
  const indicatorForm = form.get('indicator');
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const dateField = form.getIn(['objective', 'startTimestamp', 'date']);
  const timeField = form.getIn(['objective', 'startTimestamp', 'time']);

  const isEntityIdFieldValid = isFieldValid(entityIdField);
  const isNameValid = isFieldValid(nameField);
  const isTargetFieldValid = isFieldValid(targetField);
  const isThresholdValid = isFieldValid(thresholdField);
  const isIndicatorValid = isFieldValid(indicatorForm);
  const isDateFieldValid = isFieldValid(dateField);
  const isTimeFieldValid = isFieldValid(timeField);

  return [
    {
      content: <SloEntitySection />,
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      scrollId: '1-select-entity',
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: isEntityIdFieldValid
    },
    {
      content: <SloBlueprintsSection />,
      label: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      scrollId: '2-select-indicator',
      title: t('in-service-levels:createSloDialog.selectIndicatorNavItem'),
      valid: isIndicatorValid && isThresholdValid
    },
    {
      content: <SloObjectiveSection />,
      label: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      scrollId: '3-select-objective',
      title: t('in-service-levels:createSloDialog.selectObjectiveTitle'),
      valid: isTargetFieldValid && isDateFieldValid && isTimeFieldValid
    },
    {
      content: <SloNameAndTagsSection />,
      label: t('in-service-levels:createSloDialog.nameAndTagsTitle'),
      scrollId: '4-name-and-tags',
      title: t('in-service-levels:createSloDialog.nameAndTagsTitle'),
      valid: isNameValid
    },
    {
      content: <SloFormPreview />,
      label: t('in-service-levels:createSloDialog.previewSection.title', { context: 'synthetic' }),
      scrollId: '5-sample',
      title: t('in-service-levels:createSloDialog.previewSection.title', { context: 'synthetic' }),
      valid: true
    }
  ];
}

function getSloFormNavItems(form: SloForm): NavItem[] {
  const entityType = form.getIn(['entity', 'type']).value;

  return {
    application: getApplicationAndWebsiteNavItems,
    website: getApplicationAndWebsiteNavItems,
    synthetic: getSyntheticTestNavItems
  }[entityType](form);
}
