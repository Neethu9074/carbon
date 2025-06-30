/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Dropdown, Form, InlineLoading, Stack, TextInput } from '@instana/carbon';
import { TearsheetNarrow } from '@instana/ibm-products';
import { Typography } from '@instana/components';

import { createMappingRuleForm } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/mappingRuleForm';
import { useRolesSelectOptions } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useRolesSelectOptions';
import { useTeamsSelectOptions } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useTeamsSelectOptions';
import { IdpGroupMapping, refresh, saveMapping } from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ENTERPRISE_IDP_MAPPING_SUBMIT } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { close } from 'in-components/DialogPresenter/store';
import useFormSubmission from 'in-hooks/useFormSubmission';
import useDerivedState from 'in-hooks/useDerivedState';
import { seconds } from 'in-services/time/time';
import { t, Trans } from 'in-i18n';

import locals from './RoleMappingTearsheet.mless';

interface RoleMappingTearsheetProps {
  roleMapping?: IdpGroupMapping;
  setMessage: React.Dispatch<React.SetStateAction<Notification | undefined>>;
}

const RoleMappingTearsheet = (props: RoleMappingTearsheetProps) => {
  const { roleMapping, setMessage } = props;
  const { unstable_trackEvent } = useSegmentTracking();

  const [form, setForm] = useDerivedState(createMappingRuleForm(roleMapping));
  const mappingKeyField = form.get('key');
  const mappingValueField = form.get('value');
  const teamIdField = form.get('teamId');
  const roleIdField = form.get('groupId');

  const { roleOptions, selectedRole, rolesLoading, rolesError } = useRolesSelectOptions(roleIdField.value);
  const { teamOptions, selectedTeam, teamsLoading, teamsError } = useTeamsSelectOptions(teamIdField?.value);

  const [mappingRuleStatus, submitMappingForm] = useFormSubmission<IdpGroupMapping, IdpGroupMapping>(mappingConfig =>
    saveMapping(mappingConfig).map(result => {
      // Send refrehs signal to groupmapping in order to refresh role mapping list
      if (!result.progress.loading && !result.errors.length) {
        refresh();
      }
      return result;
    })
  );

  const onCreateMappingRule = () => {
    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }
    const mappingConfig = form.toJS();
    submitMappingForm({
      payload: mappingConfig,
      onSuccess: () => {
        setMessage({
          kind: 'success',
          title: t('in-settings:components.successTitle'),
          subtitle: t('in-settings:tabs.roleMapping.mappingRuleMessage', {
            context: roleMapping ? 'updated' : ''
          }),
          timeout: seconds.toMillis(3)
        });
        const trackEventPayload = {
          teamSelected: mappingConfig.teamId ? true : false
        };
        unstable_trackEvent(
          roleMapping ? UPDATED_OBJECT : CREATED_OBJECT,
          { objectType: ENTERPRISE_IDP_MAPPING_SUBMIT },
          trackEventPayload
        );
        close();
      },
      onError: error => {
        setMessage({
          kind: 'error',
          title: t('in-settings:tabs.roleMapping.failedToSaveMapping'),
          subtitle: error?.errors[0]?.message,
          timeout: seconds.toMillis(6)
        });
        close();
      }
    });
  };
  return (
    //@ts-expect-error: Suppressing this error as the `children` prop is unsupported in the type definitions.
    <TearsheetNarrow
      open
      actions={[
        {
          key: 1,
          kind: 'primary',
          label: roleMapping ? t('forms.actions.save') : t('forms.actions.create'),
          onClick: onCreateMappingRule,
          loading: mappingRuleStatus
        },
        {
          key: 2,
          kind: 'secondary',
          label: t('forms.actions.cancel'),
          onClick: close
        }
      ]}
      description={
        <Typography variant="body-01" component="div">
          <span className={locals.roleMapping_description}>
            <Trans i18nKey="in-settings:tabs.roleMapping.mappingRuleDescription" />
          </span>
        </Typography>
      }
      hasCloseIcon
      onClose={close}
      title={t('in-settings:tabs.roleMapping.mappingRuleTitle', {
        context: roleMapping ? 'edit' : ''
      })}
      selectorPrimaryFocus="#mappingKey"
    >
      <Form aria-label="role-mapping-form" className={locals.roleMapping_form}>
        <Stack gap={6}>
          <TextInput
            id="mappingKey"
            labelText={t('in-settings:tabs.roleMapping.keyColumn')}
            size="md"
            invalid={!mappingKeyField.valid && mappingKeyField.touched}
            invalidText={mappingKeyField.messages[0]?.message}
            onChange={e => setForm(form.updateIn(['key'], f => f.setValue(e.target.value).setTouched(true)))}
            value={mappingKeyField.value}
          />
          <TextInput
            id="value"
            labelText={t('in-settings:tabs.roleMapping.valueColumn')}
            size="md"
            invalid={!mappingValueField.valid && mappingValueField.touched}
            invalidText={mappingValueField.messages[0]?.message}
            onChange={e => setForm(form.updateIn(['value'], f => f.setValue(e.target.value).setTouched(true)))}
            value={mappingValueField.value}
          />
          {rolesLoading ? (
            <InlineLoading description={t('in-settings:tabs.roleMapping.loadingRoles')} />
          ) : (
            <Dropdown
              items={rolesError ? [] : roleOptions}
              size="md"
              titleText={t('in-settings:tabs.roleMapping.roleColumn')}
              label={t('in-settings:components.select')}
              invalid={!roleIdField.valid && roleIdField.touched}
              invalidText={roleIdField.messages[0]?.message}
              id="role"
              selectedItem={selectedRole}
              itemToString={item => (item ? item.name : '')}
              onChange={({ selectedItem }) => {
                setForm(form.updateIn(['groupId'], f => f.setValue(selectedItem?.id).setTouched(true)));
              }}
            />
          )}
          {teamsLoading ? (
            <InlineLoading description={t('in-settings:tabs.roleMapping.loadingTeams')} />
          ) : (
            <Dropdown
              items={teamsError ? [] : teamOptions}
              size="md"
              titleText={t('in-settings:tabs.roleMapping.teamOptional')}
              label={t('in-settings:components.select')}
              id="team"
              selectedItem={selectedTeam}
              itemToString={item => (item ? item.displayName : '')}
              helperText={
                <>
                  <Typography variant="helper-text-01" component="p">
                    {t('in-settings:tabs.roleMapping.teamDescription')}
                  </Typography>
                  <Typography variant="helper-text-01" component="p">
                    {t('in-settings:tabs.roleMapping.teamNote')}
                  </Typography>
                </>
              }
              onChange={({ selectedItem }) => {
                setForm(form.updateIn(['teamId'], f => f.setValue(selectedItem?.id).setTouched(true)));
              }}
            />
          )}
        </Stack>
      </Form>
    </TearsheetNarrow>
  );
};

export default RoleMappingTearsheet;
