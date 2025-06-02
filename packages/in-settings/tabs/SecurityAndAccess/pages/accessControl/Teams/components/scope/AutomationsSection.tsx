/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { FilterableMultiSelect, Stack } from '@instana/carbon';
import { AccessRestriction } from '@instana/types';
import { Typography } from '@instana/components';

import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import {
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { getInitialScopeType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection';
import { defaultFilterItems } from 'in-settings/components/FilterableMultiSelect/FilterableMultiSelect.utils';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { ACTION_TRANSLATIONS, ACTION_TYPES } from 'in-automation/constants';
import useActionTags from 'in-automation/hooks/useActionTags';
import { t } from 'in-i18n';

import locals from './AutomationsSection.mless';

interface AutomationsSectionProps {
  limitedAccessSwitchLabel: string;
  limitedAccessScopes: AccessRestriction[];
}

export const ACTION_TYPE_OPTIONS = ACTION_TYPES.map(type => ({
  id: type,
  text: ACTION_TRANSLATIONS[type]
}));

const createMultiSelectItemsTags = (tags: Array<string>) => {
  return tags.map(tag => {
    return { id: tag, text: tag ?? '' };
  });
};

const createMultiSelectItemsTypes = (types: Array<string>) => {
  return types.map(actionType => {
    return { id: actionType, text: ACTION_TYPE_OPTIONS.find(opt => opt.id === actionType)?.text ?? actionType };
  });
};

const AutomationsSection = ({ limitedAccessSwitchLabel, limitedAccessScopes }: AutomationsSectionProps) => {
  const { form, updateIn } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const actionTagsField = form.getIn(['actionTags']);
  const actionTypesField = form.getIn(['actionTypes']);
  const actionTags = useActionTags();
  const permissionsField = form.getIn(['accessPermissions']);
  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));
  const formErrors = form.messages;
  const actionTagsError = formErrors.filter(message => message.path === 'actionTags')?.[0]?.message;
  const actionTypesError = formErrors.filter(message => message.path === 'actionTypes')?.[0]?.message;

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => setScopeType(newScopeType)}
        onEntireUnitSelected={() =>
          // Reset action filter
          form
            .updateIn(['actionTypes'], f => f.setValue(undefined).setTouched(true))
            .updateIn(['actionTags'], f => f.setValue(undefined).setTouched(true))
        }
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <div className={locals.actionFilterSection}>
          <Stack gap={6}>
            <Typography variant="body-01">{t('in-settings:dialogs.scope.automationFilterDescription')}</Typography>

            <Stack gap={4}>
              <FilterableMultiSelect
                className={locals.actionFilterMultiSelect}
                titleText={t('in-settings:dialogs.scope.automationActionTypes')}
                filterItems={defaultFilterItems}
                id={`rbac-team-scope-automations-action-types`}
                initialSelectedItems={createMultiSelectItemsTypes(actionTypesField?.value ?? [])}
                invalid={actionTypesField.touched && actionTypesError !== undefined}
                invalidText={actionTypesError}
                items={ACTION_TYPE_OPTIONS}
                itemToString={item => item?.text ?? ''}
                onChange={selected =>
                  updateIn(
                    ['actionTypes'],
                    actionTagsField.setValue(selected.selectedItems.map(item => item.id)).setTouched(true)
                  )
                }
                selectionFeedback="top-after-reopen"
                size="md"
                type="default"
              />
              <FilterableMultiSelect
                className={locals.actionFilterMultiSelect}
                titleText={t('in-settings:dialogs.scope.automationActionTags')}
                filterItems={defaultFilterItems}
                id={`rbac-team-scope-automations-action-tags`}
                initialSelectedItems={createMultiSelectItemsTags(actionTagsField?.value ?? [])}
                invalid={actionTagsField.touched && actionTagsError !== undefined}
                invalidText={actionTagsError}
                items={createMultiSelectItemsTags(actionTags?.data ?? [])}
                itemToString={item => item?.text ?? ''}
                onChange={selected =>
                  updateIn(
                    ['actionTags'],
                    actionTagsField.setValue(selected.selectedItems.map(item => item.id)).setTouched(true)
                  )
                }
                selectionFeedback="top-after-reopen"
                size="md"
                type="default"
              />
            </Stack>
          </Stack>
        </div>
      )}
    </>
  );
};

export default AutomationsSection;
