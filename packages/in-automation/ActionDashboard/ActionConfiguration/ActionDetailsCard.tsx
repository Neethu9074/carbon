/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonButton,
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonIconButton,
  CarbonRow,
  CarbonStack,
  CarbonTag,
  CarbonTile,
  SvgIcon,
  Typography
} from '@instana/components';
import { Action } from '@instana/types';

import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionConfigurationProps {
  data: Action | Nullish | ActionFormEntity;
}

export default function ActionDetailsCard({ data }: ActionConfigurationProps) {
  if (!data) return null;
  const { name, description = '-', tags } = data;

  const renderTags = tags?.length
    ? tags.map(tag => (
        <CarbonTag key={tag} type="gray" size="md">
          {tag}
        </CarbonTag>
      ))
    : '-';

  return (
    <CarbonTile className={local.borderBottom}>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">{t('in-automation:actionDashboard.ActionDetails')}</Typography>
        <ActionConfigurationActions />
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={local.noHorizontalPaddings}>
          <CarbonColumn sm={4}>
            <CarbonFormGroup legendText={t('in-automation:name')}>{name}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn sm={4}>
            <CarbonFormGroup legendText={t('in-automation:description')}>{description}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="50%">
            <CarbonFormGroup legendText={t('in-automation:tagsLabel')}>{renderTags}</CarbonFormGroup>
          </CarbonColumn>
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}

function ActionConfigurationActions() {
  return (
    <CarbonStack orientation="horizontal">
      <CarbonIconButton label={t('in-automation:copy')} kind="ghost" size="sm">
        <SvgIcon type="lib_actions_copy" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton label={t('in-automation:edit')} kind="ghost" size="sm">
        <SvgIcon type="lib_actions_edit" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton label={t('in-automation:delete')} kind="ghost" size="sm">
        <SvgIcon type="lib_actions_delete" size="xs" />
      </CarbonIconButton>
      <CarbonButton
        className={local.testActionButton}
        kind="ghost"
        size="sm"
        renderIcon={() => <SvgIcon type="lib_actions_play" size="xs" color="#fff" />}
      >
        {t('in-automation:testAction')}
      </CarbonButton>
    </CarbonStack>
  );
}
