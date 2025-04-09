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
  CarbonTile,
  SvgIcon,
  Typography
} from '@instana/components';

import GenerateAIScriptActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import CreateNewActionTearsheet from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import { showConfirmationDialog } from 'in-automation/ActionCatalog/ActionCatalog';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { getDocLinkFromFields } from 'in-automation/utils/actionField';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { ACTION_TYPE, NO_FIELD_VALUE } from 'in-automation/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { actionAiGenerationEnabled } from 'in-services/featureFlags';
import { isNotEditable } from 'in-automation/utils/action';
import { useSegmentTracker } from 'in-automation/tracker';
import { Action, Nullish } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsProps {
  data: Action | Nullish;
  isAIGeneratedAction: boolean;
}

export default function ActionDetailsCard({ data, isAIGeneratedAction }: ActionDetailsProps) {
  if (!data) return null;
  const { name, description, tags } = data;
  const renderTags = tags?.length ? <DynamicTagList tags={tags} /> : NO_FIELD_VALUE;
  return (
    <CarbonTile className={local.borderBottom}>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">{t('in-automation:actionDashboard.ActionDetails')}</Typography>
        <ActionConfigurationActions data={data} isAIGeneratedAction={isAIGeneratedAction} />
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={classNames(local.noHorizontalPaddings, local.customMarginY)}>
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

interface ActionConfigurationActionsProps {
  data: Nullish | Action;
  isAIGeneratedAction: boolean;
}

function ActionConfigurationActions({ data, isAIGeneratedAction }: Readonly<ActionConfigurationActionsProps>) {
  const { form } = useActionFormContext();
  const navigateToActionCatalog = useNavigateToActionCatalog();
  const { generateAIButtonClickTrackerSegment } = useSegmentTracker();

  const hasPermisson = role?.canConfigureAutomationActions || role?.canRunAutomationActions;

  const manualContent = form.get('manualContent').value;
  const type = form.get('type').value;
  if (!data || (!hasPermisson && type !== ACTION_TYPE.MANUAL)) return null;
  const actionId = data.id;
  const actionName = form.get('name').value;
  const isUserActions = !isAIGeneratedAction;

  const testClickHandler = () => {
    if (type === ACTION_TYPE.DOC_LINK) {
      window.open(getDocLinkFromFields(data.fields).value, '_blank')?.focus();
    } else {
      addActiveDialog(<RunActionDialog test action={data as Action} volatileId={{}} />);
    }
  };

  return (
    <CarbonStack orientation="horizontal">
      {type === ACTION_TYPE.MANUAL && actionAiGenerationEnabled && (
        <CarbonButton
          className={classNames(local.ghostBtn, local.watsonxBtn)}
          kind="ghost"
          size="sm"
          onClick={() => {
            generateAIButtonClickTrackerSegment({
              type: 'script',
              location: 'action dashboard',
              actionName,
              actionId
            });
            addActiveDialog(<GenerateAIScriptActionDialog manualContent={manualContent} actionName={actionName} />);
          }}
          renderIcon={() => <SvgIcon type="lib_launch_ai" size="xs" />}
        >
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.generateScriptButton')}
        </CarbonButton>
      )}
      {role?.canConfigureAutomationActions && (
        <>
          {type !== ACTION_TYPE.ANSIBLE && (
            <CarbonIconButton
              label={t('in-automation:copy')}
              kind="ghost"
              size="sm"
              onClick={() => handleButtonClick({ actionId, copy: true })}
            >
              <SvgIcon type="lib_actions_copy" size="xs" />
            </CarbonIconButton>
          )}
          {isUserActions && (
            <>
              <CarbonIconButton
                label={t('in-automation:edit')}
                kind="ghost"
                size="sm"
                disabled={data?.metadata?.builtIn}
                onClick={() => handleButtonClick({ actionId })}
              >
                <SvgIcon type="lib_actions_edit" size="xs" />
              </CarbonIconButton>
              <CarbonIconButton
                label={t('in-automation:delete')}
                kind="ghost"
                disabled={isNotEditable(data, false) && data.type !== ACTION_TYPE.ANSIBLE}
                size="sm"
                onClick={() =>
                  showConfirmationDialog(data as Action, { callback: navigateToActionCatalog, disableRefresh: true })
                }
              >
                <SvgIcon type="lib_actions_delete" size="xs" />
              </CarbonIconButton>
            </>
          )}
        </>
      )}
      {role?.canRunAutomationActions && type !== ACTION_TYPE.MANUAL && (
        <CarbonButton
          className={classNames(local.ghostBtn, local.testActionButton)}
          kind="ghost"
          size="sm"
          renderIcon={() => <SvgIcon type="lib_actions_play" size="xs" color="var(--ids-color-option-white)" />}
          onClick={testClickHandler}
        >
          {t('in-automation:testAction')}
        </CarbonButton>
      )}
    </CarbonStack>
  );
}

const handleButtonClick = ({ actionId, copy }: { actionId?: string; copy?: boolean }) => {
  addActiveDialog(<CreateNewActionTearsheet actionId={actionId} copy={copy} isFromDashboard />);
};
