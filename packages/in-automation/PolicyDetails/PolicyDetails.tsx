/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Column, Grid, Row, Stack } from '@instana/carbon';
import { Link, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Policy } from '@instana/types';

import CreatePolicyTearsheet, {
  CreatePolicyTearsheetProps
} from 'in-automation/Policies/CreatePolicyTearsheet/CreatePolicyTearsheet';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard/DefaultLoadingDashboard';
import PolicyTriggerConfigurationCard from 'in-automation/PolicyDetails/PolicyTriggerConfigurationCard';
import usePolicyForm from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/usePolicyForm';
import PolicyFormContext from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import ActionConfigurationCard from 'in-automation/PolicyDetails/ActionConfigurationCard';
import useActionForm from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import PolicyDetailsdHeader from 'in-automation/PolicyDetails/PolicyDetailsHeader';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import ActionFormContext from 'in-automation/ActionCatalog/ActionFormContext';
import PolicyDetailsCard from 'in-automation/PolicyDetails/PolicyDetailsCard';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { policiesFullyQualified } from 'in-automation/navigation/paths';
import PolicyControls from 'in-automation/PolicyDetails/PolicyControls';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import usePolicy from 'in-automation/PolicyDetails/usePolicy';
import { hasError, isLoading } from 'in-services/util/result';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import useTriggers from 'in-automation/Policies/useTriggers';
import SectionLine from 'in-settings/components/SectionLine';
import { pendingResult } from 'in-services/fixedObjects';
import { eventsPath } from 'in-events/navigation/paths';
import { ACTION_TYPE } from 'in-automation/constants';
import { Triggers } from 'in-automation/types';
import useUrlState from 'in-hooks/useUrlState';
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
        <DefaultLoadingDashboard />
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
  const [role] = useCurrentUserRole();
  const { location, navigate } = useNavigation();
  const [{ id }] = useUrlState<{ id: string }>({
    bind: [policyDetailsUrlParameters.id]
  });
  const { form } = usePolicyForm('EDIT', policy, [], triggers);
  const {
    action,
    agentId,
    inputParameterValues = []
  } = policy?.typeConfigurations[0]?.runnable.runConfiguration.actions[0] ?? {};
  const [actionForm] = useActionForm({ action, actionFilter: 'all' });
  const formValue = useMemo(
    () => ({
      form: actionForm,
      rootPath: [],
      setForm: () => {}
    }),
    [actionForm]
  );
  const [tearsheetProps, setTearsheetProps] = useState<CreatePolicyTearsheetProps>({ open: false });
  const tearsheetToggleHandler = ({ policyId, copy }: { policyId?: string; copy?: boolean }) => {
    setTearsheetProps({ policyId, copy, open: true });
  };

  const from = location.query.from;
  let backLable = from === eventsPath ? t('in-automation:backToEvent') : t('in-automation:backToPolicies');

  const handleBack = () => {
    delete location.query.from;
    if (from === eventsPath) {
      location.pathname = eventsPath;
      const eventObj = JSON.parse(location.query.eventState as string);
      delete location.query.eventState;
      for (const key in eventObj) {
        setOrDeleteMatrixKey(location, eventsPath, key, eventObj[key]);
      }
    } else {
      location.pathname = policiesFullyQualified;
      const idParameter = policyDetailsUrlParameters.id;
      setOrDeleteMatrixKey(location, idParameter.path ?? '', idParameter.name, null);
    }
    navigate(location);
  };

  return (
    <ActionFormContext.Provider value={formValue}>
      <PolicyFormContext.Provider
        value={{
          form,
          mode: 'EDIT',
          setForm: () => {},
          updateForm: () => {},
          onChange: () => {}
        }}
      >
        <section className={local.content}>
          <Stack gap={5} orientation="vertical">
            <div
              className={classNames({
                [local.controlsWrapper]: true,
                [local.flexSpaceBetween]: from,
                [local.flexEnd]: !from
              })}
            >
              {from && (
                <Link className={local.link} onClick={handleBack}>
                  <SvgIcon type="lib_arrow_expand_left" className={local.icon} />
                  {backLable}
                </Link>
              )}
              {role?.canConfigureAutomationPolicies && (
                <PolicyControls data={policy} tearsheetToggleHandler={tearsheetToggleHandler} />
              )}
            </div>

            <Row>
              <Grid fullWidth condensed className={classNames(local.customMarginY, local.gridGap)}>
                <Column lg={8} md={4} className={classNames(local.bgWhite)}>
                  <PolicyDetailsCard data={policy} />
                </Column>
                <Column lg={8} md={4} className={classNames(local.bgWhite)}>
                  <PolicyTriggerConfigurationCard data={policy?.trigger} triggers={triggers} />
                </Column>
                {action && (
                  <Column lg={16} md={8}>
                    <ActionConfigurationCard
                      data={action}
                      agentId={agentId}
                      inputParameterValues={inputParameterValues}
                    />
                  </Column>
                )}
                {![ACTION_TYPE.MANUAL, ACTION_TYPE.DOC_LINK].includes(action.type) && (
                  <Column lg={16} md={8}>
                    <ActionHistoryTable policyId={id} />
                  </Column>
                )}
              </Grid>
            </Row>
          </Stack>
        </section>
        <CreatePolicyTearsheet
          {...tearsheetProps}
          isFromDashboard
          closeHandler={() => {
            setTearsheetProps({ open: false });
          }}
        />
      </PolicyFormContext.Provider>
    </ActionFormContext.Provider>
  );
}
