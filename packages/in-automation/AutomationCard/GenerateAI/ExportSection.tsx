/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useEffect } from 'react';
import { fromJS } from 'immutable';

import { Label, Input, Spacer } from '@instana/components';
import { AgentSnapshot, Result } from '@instana/types';
import { create, timeout } from '@instana/observables';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { ActionForm, ExportForm } from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { hasError, isLoading, error } from 'in-services/util/result';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import HelpText from 'in-components/form/HelpText/HelpText';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getSnapshot } from 'in-stores/snapshot';
import { getGitops } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

export default function ExportSection({
  form,
  exportForm,
  setExportForm
}: {
  form: ActionForm;
  exportForm: ExportForm;
  setExportForm: (setValueFunc: (value: ExportForm) => ExportForm) => void;
}) {
  const { GHagentSnapShots, GLagentSnapShots } = useGHGLAgentSnapShots();

  const loading = GHagentSnapShots?.progress.loading || GLagentSnapShots?.progress.loading;

  const GHAgentsOnline = GHagentSnapShots?.data?.online ?? [];
  const GLAgentsOnline = GLagentSnapShots?.data?.online ?? [];
  const exportType = exportForm.get('exportType');

  useEffect(() => {
    if (!loading && exportType.value === '' && (GHAgentsOnline.length > 0 || GLAgentsOnline.length > 0)) {
      if (GHAgentsOnline.length > 0) {
        setExportForm(form => form.updateIn(['exportType'], item => item.setValue('github').setTouched(true)));
      } else {
        setExportForm(form => form.updateIn(['exportType'], item => item.setValue('gitlab').setTouched(true)));
      }
    }
  }, [GHAgentsOnline.length, GLAgentsOnline.length, exportType.value, setExportForm, loading]);

  // **Show loading indicator until both are fully loaded**
  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }

  return (
    <RadioButtons
      exportForm={exportForm}
      setExportForm={setExportForm}
      GHAgentsOnline={GHAgentsOnline}
      GLAgentsOnline={GLAgentsOnline}
      form={form}
    />
  );
}

function useGHGLAgentSnapShots() {
  const timeConfig = useTimeConfig();

  const GHagentSnapShots: OUT | null | undefined = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query: 'entity.agent.capability:action-github-ops' }),
    [timeConfig]
  );

  const GLagentSnapShots: OUT | null | undefined = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query: 'entity.agent.capability:action-gitlab-ops' }),
    [timeConfig]
  );

  return { GHagentSnapShots, GLagentSnapShots };
}

function RadioButtons({
  form,
  exportForm,
  setExportForm,
  GHAgentsOnline,
  GLAgentsOnline
}: {
  exportForm: ExportForm;
  setExportForm: (setValueFunc: (value: ExportForm) => ExportForm) => void;
  form: ActionForm;
  GHAgentsOnline?: AgentSnapshot[];
  GLAgentsOnline?: AgentSnapshot[];
}) {
  const exportType = exportForm.get('exportType');
  const agent = exportForm.get('agent');
  const repo = exportForm.get('repository');

  return (
    <div className={locals.exportSection}>
      <Spacer vertical="small" />
      {exportType.value === 'github' && GHAgentsOnline && (
        <AgentSelection exportForm={exportForm} setExportForm={setExportForm} agentSnapShots={GHAgentsOnline} />
      )}
      {exportType.value === 'gitlab' && GLAgentsOnline && (
        <AgentSelection exportForm={exportForm} setExportForm={setExportForm} agentSnapShots={GLAgentsOnline} />
      )}
      {agent.value !== '' && <RepoSelection exportForm={exportForm} setExportForm={setExportForm} />}
      {repo.value !== '' && <ExportFields exportForm={exportForm} setExportForm={setExportForm} form={form} />}
    </div>
  );
}

function AgentSelection({
  exportForm,
  setExportForm,
  agentSnapShots
}: {
  exportForm: ExportForm;
  setExportForm: (setValueFunc: (value: ExportForm) => ExportForm) => void;
  agentSnapShots: AgentSnapshot[];
}) {
  const agent = exportForm?.get('agent');
  const exportType = exportForm.get('exportType');
  const hostSnapshots = useObservable(() => {
    const getHostSnapshotIds = agentSnapShots?.map(agent =>
      getHostSnapshotId(fromJS(agent)).map(id => ({ id, agent }))
    );
    return combineLatest(getHostSnapshotIds).flatMap(hostData =>
      combineLatest(
        hostData.map(({ id, agent }) =>
          getSnapshot(id).map(hostSnapshot => ({
            hostSnapshot,
            agent
          }))
        )
      )
    );
  }, [agentSnapShots]);

  const options =
    hostSnapshots
      ?.map(({ hostSnapshot, agent }) => {
        const hostname = hostSnapshot?.get('label');
        return {
          label: hostname,
          value: agent.volatileId?.host_id ?? ''
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

  return (
    <>
      {agent?.map(field => (
        <FormGroup>
          <Label htmlFor="target-agent" hasError={!field.valid && field.touched}>
            {t('in-automation:targetAgent')}
          </Label>
          <ComboBox
            options={options}
            id="target-agent"
            value={field.value}
            isClearable={false}
            onChange={e => {
              if ((e as Option)?.value) {
                setExportForm(form =>
                  form.updateIn(['agent'], item => item.setValue((e as Option)?.value).setTouched(true))
                );
              }
            }}
          />
          {hostSnapshots && options?.length === 0 && (
            <ValidationBlock key={'agent_empty'} className={locals.subErrorTextFormField}>
              {exportType.value === 'github'
                ? t('in-automation:GenerateAIActionDialog.exportToGit.agentEmptyGH')
                : t('in-automation:GenerateAIActionDialog.exportToGit.agentEmptyGL')}
            </ValidationBlock>
          )}
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          {exportType.value === 'github' && (
            <HelpText>{t('in-automation:GenerateAIActionDialog.exportToGit.GHSensorHelptext')}</HelpText>
          )}
          {exportType.value === 'gitlab' && (
            <HelpText>{t('in-automation:GenerateAIActionDialog.exportToGit.GLSensorHelptext')}</HelpText>
          )}
        </FormGroup>
      ))}
    </>
  );
}

function RepoSelection({
  exportForm,
  setExportForm
}: {
  exportForm: ExportForm;
  setExportForm: (setValueFunc: (value: ExportForm) => ExportForm) => void;
}) {
  const exportType = exportForm.get('exportType');
  const agent = exportForm.get('agent');
  const repository = exportForm.get('repository');

  // Ensure the object reference changes only when agent.value changes
  const data = useMemo(() => {
    if (!agent.value) return null;
    return {
      hostId: agent.value,
      type: exportType.value,
      operation: exportType.value === 'github' ? 'get_repositories' : 'get_projects',
      parameters: []
    };
  }, [agent.value, exportType.value]);

  const repositories = useExportData({ data });
  const errored = hasError(repositories);

  return (
    <>
      {isLoading(repositories) && <LoadingIndicator size={'xs'} />}
      {errored && <ErroneousResultPresenter errors={repositories?.errors} />}
      {!isLoading(repositories) &&
        !errored &&
        repository?.map(field => (
          <FormGroup>
            <Label htmlFor="repository" hasError={!field.valid && field.touched}>
              {exportType.value === 'github'
                ? t('in-automation:GenerateAIActionDialog.exportToGit.repository')
                : t('in-automation:GenerateAIActionDialog.exportToGit.project')}
            </Label>
            <ComboBox
              disabled={isLoading(repositories)}
              options={(repositories?.data && Array.isArray(repositories?.data) ? repositories.data : []).map(
                ({ name, id }: { name: string; id: string }) => ({
                  label: name,
                  value: exportType.value === 'github' ? name : id
                })
              )}
              isClearable={false}
              id="repository"
              value={repository.value}
              onChange={e => {
                if ((e as Option)?.value) {
                  setExportForm(form =>
                    form.updateIn(['repository'], item => item.setValue((e as Option).value).setTouched(true))
                  );
                }
              }}
            />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            {repositories?.data?.length === 0 && (
              <ValidationBlock key={'repo_empty'} className={locals.subErrorTextFormField}>
                {exportType.value === 'github'
                  ? t('in-automation:GenerateAIActionDialog.exportToGit.repoEmptyGH')
                  : t('in-automation:GenerateAIActionDialog.exportToGit.repoEmptyGL')}
              </ValidationBlock>
            )}
            {exportType.value === 'github' && (
              <HelpText>{t('in-automation:GenerateAIActionDialog.exportToGit.repositoryHelpText')}</HelpText>
            )}
            {exportType.value === 'gitlab' && (
              <HelpText>{t('in-automation:GenerateAIActionDialog.exportToGit.projectHelpText')}</HelpText>
            )}
          </FormGroup>
        ))}
    </>
  );
}

function ExportFields({
  exportForm,
  setExportForm,
  form
}: {
  exportForm: ExportForm;
  setExportForm: (setValueFunc: (value: ExportForm) => ExportForm) => void;
  form: ActionForm;
}) {
  const exportType = exportForm.get('exportType');
  const agent = exportForm.get('agent');
  const repo = exportForm.get('repository');
  const branch = exportForm.get('branch');
  const message = exportForm.get('message');
  const base = exportForm.get('base');
  const filePath = exportForm.get('file_path');
  const script = form.get('script').value;
  const scriptEncoded = window.btoa(script);
  const data = useMemo(() => {
    if (!agent.value || !repo.value) return null;
    return {
      hostId: agent.value,
      type: exportType.value,
      operation: 'get_branches',
      parameters: [
        {
          name: exportType.value === 'github' ? 'repository' : 'projectId',
          value: repo.value
        }
      ]
    };
  }, [agent.value, exportType.value, repo.value]);

  const branches = useExportData({ data });
  const errored = hasError(branches);
  if (isLoading(branches)) return <LoadingIndicator size={'xs'} />;
  if (errored) return <ErroneousResultPresenter errors={branches?.errors} />;
  return (
    <>
      {branch?.map(field => (
        <FormGroup>
          <Label htmlFor="branch" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.exportToGit.branch')}
          </Label>

          <CreatableComboBox
            id="branch"
            options={(branches?.data && Array.isArray(branches?.data) ? branches.data : [])?.map(
              ({ name }: { name: string }) => ({
                label: name,
                value: name
              })
            )}
            value={field.value}
            onChange={(e: Option) => {
              if (e) {
                setExportForm(form => form.updateIn(['branch'], item => item.setValue(e).setTouched(true)));
              }
              if (e === null) {
                setExportForm(form => form.updateIn(['branch'], item => item.setValue({} as Option).setTouched(true)));
              }

              setExportForm(form => form.updateIn(['content'], item => item.setValue(scriptEncoded).setTouched(true)));
            }}
          />
          <TouchedMessages field={field} />

          <HelpText> {t('in-automation:GenerateAIActionDialog.exportToGit.branchHelpText')}</HelpText>
        </FormGroup>
      ))}

      {message.map(field => (
        <FormGroup>
          <Label htmlFor="message" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.exportToGit.commitMessage')}
          </Label>
          <Input
            id="message"
            type="text"
            value={field.value}
            onChange={e =>
              setExportForm(form => form.updateIn(['message'], item => item.setValue(e.target.value).setTouched(true)))
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {base?.map(field => (
        <FormGroup>
          <Label htmlFor="target_branch" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.exportToGit.targetBranch')}
          </Label>
          <ComboBox
            disabled={isLoading(branches)}
            options={(branches?.data && Array.isArray(branches?.data) ? branches.data : [])?.map(
              ({ name }: { name: string }) => ({
                label: name,
                value: name
              })
            )}
            id="target_branch"
            value={base.value}
            isClearable
            onChange={e => {
              setExportForm(form =>
                form.updateIn(['base'], item => item.setValue((e as Option)?.value ?? null).setTouched(true))
              );
            }}
          />
          <TouchedMessages field={field} />
          <HelpText> {t('in-automation:GenerateAIActionDialog.exportToGit.targetBranchHelpText')}</HelpText>
        </FormGroup>
      ))}

      {filePath.map(field => (
        <FormGroup>
          <Label htmlFor="file_path" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.exportToGit.folderFilePath')}
          </Label>
          <Input
            id="file_path"
            type="text"
            value={field.value}
            onChange={e =>
              setExportForm(form =>
                form.updateIn(['file_path'], item => item.setValue(e.target.value).setTouched(true))
              )
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
          <HelpText> {t('in-automation:GenerateAIActionDialog.exportToGit.folderFilePathHelpText')}</HelpText>
        </FormGroup>
      ))}
    </>
  );
}

interface UseExportParameters {
  data?: any;
}

const refreshSignal = create().emit(true);
export function refresh() {
  timeout(1000).once(() => refreshSignal.emit(true));
}

function useExportData({ data }: UseExportParameters) {
  const result: Result<any> =
    useObservable(() => refreshSignal.flatMap(() => getGitops(data)), [data]) ?? pendingResult;
  if (isLoading(result)) return pendingResult;
  if (hasError(result)) {
    return error(result.errors);
  }

  return result;
}
