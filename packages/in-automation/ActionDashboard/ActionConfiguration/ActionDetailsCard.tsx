/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
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

import GenerateAIScriptActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { ACTION_TYPE, NO_FIELD_VALUE } from 'in-automation/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionConfigurationProps {
  data: Action | Nullish | ActionFormEntity;
}

export default function ActionDetailsCard({ data }: ActionConfigurationProps) {
  if (!data) return null;
  const { name, description, tags } = data;
  const renderTags = tags?.length
    ? tags.map(tag => (
        <CarbonTag key={tag} type="gray" size="md">
          {tag}
        </CarbonTag>
      ))
    : NO_FIELD_VALUE;

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
  const { form } = useActionFormContext();
  const manualContent = form.get('manualContent').value;
  const type = form.get('type').value;
  const actionName = form.get('name').value;
  return (
    <CarbonStack orientation="horizontal">
      {type === ACTION_TYPE.MANUAL && (
        <CarbonButton
          className={classNames(local.ghostBtn, local.watsonxBtn)}
          kind="ghost"
          size="sm"
          onClick={() => {
            addActiveDialog(<GenerateAIScriptActionDialog manualContent={manualContent} actionName={actionName} />);
          }}
          renderIcon={() => <SvgIcon type="lib_launch_ai" size="xs" />}
        >
          {t('in-automation:generateWithWatsonx')}
        </CarbonButton>
      )}
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
        className={classNames(local.ghostBtn, local.testActionButton)}
        kind="ghost"
        size="sm"
        renderIcon={() => <SvgIcon type="lib_actions_play" size="xs" color="#fff" />}
      >
        {t('in-automation:testAction')}
      </CarbonButton>
    </CarbonStack>
  );
}
