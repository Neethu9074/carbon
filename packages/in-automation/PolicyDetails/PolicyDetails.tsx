/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import { CarbonColumn, CarbonGrid, CarbonRow, CarbonStack, Link, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import PolicyTriggerConfigurationCard from 'in-automation/PolicyDetails/PolicyTriggerConfigurationCard';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import ActionConfigurationCard from 'in-automation/PolicyDetails/ActionConfigurationCard';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import PolicyDetailsdHeader from 'in-automation/PolicyDetails/PolicyDetailsHeader';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import usePolicyForm from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import PolicyDetailsCard from 'in-automation/PolicyDetails/PolicyDetailsCard';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import PolicyControls from 'in-automation/PolicyDetails/PolicyControls';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import usePolicy from 'in-automation/PolicyDetails/usePolicy';
import { hasError, isLoading } from 'in-services/util/result';
import useTriggers from 'in-automation/Policies/useTriggers';
import SectionLine from 'in-settings/components/SectionLine';
import { pendingResult } from 'in-services/fixedObjects';
import { eventsPath } from 'in-events/navigation/paths';
import { ACTION_TYPE } from 'in-automation/constants';
import Form from 'in-components/form/binding/Form';
import { Triggers } from 'in-automation/types';
import useUrlState from 'in-hooks/useUrlState';
import { Policy } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/PolicyDetails/PolicyDetails.mless';

export default function PolicyDashboard() {
  const [{ id }] = useUrlState<{ id: string }>({
    bind: [policyDetailsUrlParameters.id]
  });
  const triggers = useTriggers();
  const policy = usePolicy(id);
  const result = useObservable(() => policy, [policy]) ?? pendingResult;
  const loading = isLoading(result);
  const errored = hasError(result);

  if (loading) {
    return (
      <>
        <PolicyDetailsdHeader result={result} />
        <LoadingIndicator size={'xl'} />
      </>
    );
  }

  if (errored) {
    const errors = [...result.errors];
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
          {t('in-automation:policies.unknownPolicy')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          <ErroneousResultPresenter errors={errors} />
          <br />
          {t('in-automation:ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  return (
    <>
      <PolicyDetailsdHeader result={result} />
      <PolicyView policy={result.data!} triggers={triggers} />
    </>
  );
}

interface PolicyViewProps {
  policy: Policy;
  triggers: Triggers;
}

function PolicyView({ policy, triggers }: PolicyViewProps) {
  const { location } = useNavigation();
  const [{ id }] = useUrlState<{ id: string }>({
    bind: [policyDetailsUrlParameters.id]
  });
  const [form] = usePolicyForm(policy, [], triggers);
  const { action, agentId, inputParameterValues } =
    policy?.typeConfigurations[0]?.runnable.runConfiguration.actions[0] ?? {};
  const [actionForm] = useActionForm({ action, actionFilter: 'all' });
  const formValue = useMemo(
    () => ({
      form: actionForm,
      rootPath: [],
      setForm: () => {}
    }),
    [actionForm]
  );
  const from = location.query.from;
  let backLable = from === eventsPath ? t('in-automation:backToEvent') : t('in-automation:backToPolicies');

  return (
    <>
      <ActionFormContext.Provider value={formValue}>
        <Form form={form} setForm={() => {}} onSubmit={() => {}}>
          <section className={local.content}>
            <CarbonStack gap={5} orientation="vertical">
              <div
                className={classNames({
                  [local.controlsWrapper]: true,
                  [local.flexSpaceBetween]: from,
                  [local.flexEnd]: !from
                })}
              >
                {from && (
                  <Link
                    className={local.link}
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    <SvgIcon type="lib_arrow_expand_left" className={local.icon} />
                    {backLable}
                  </Link>
                )}
                <PolicyControls data={policy} />
              </div>

              <CarbonRow>
                <CarbonGrid fullWidth condensed className={classNames(local.customMarginY, local.gridGap)}>
                  <CarbonColumn lg={8} md={4} className={classNames(local.bgWhite)}>
                    <PolicyDetailsCard data={policy} />
                  </CarbonColumn>
                  <CarbonColumn lg={8} md={4} className={classNames(local.bgWhite)}>
                    <PolicyTriggerConfigurationCard data={policy?.trigger} triggers={triggers} />
                  </CarbonColumn>
                  {action && (
                    <CarbonColumn lg={16} md={8}>
                      <ActionConfigurationCard
                        data={action}
                        agentId={agentId}
                        inputParameterValues={inputParameterValues}
                      />
                    </CarbonColumn>
                  )}
                  {![ACTION_TYPE.MANUAL, ACTION_TYPE.DOC_LINK].includes(action.type) && (
                    <CarbonColumn lg={16} md={8}>
                      <ActionHistoryTable policyId={id} />
                    </CarbonColumn>
                  )}
                </CarbonGrid>
              </CarbonRow>
            </CarbonStack>
          </section>
        </Form>
      </ActionFormContext.Provider>
    </>
  );
}
