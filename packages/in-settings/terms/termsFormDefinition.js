/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import { isDeprecatedUserDefinedRole } from 'in-settings/terms/userSelfDefinedRole';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

export default function termsFormDefinition(userSettings) {
  let form = createMapForm()
    .put(
      'role',
      createField({
        value: userSettings && !isDeprecatedUserDefinedRole(userSettings.role) ? userSettings.role : '',
        validator: roleValidator
      })
    )
    .put(
      'productTips',
      createField({
        value: userSettings ? userSettings.productTips : ''
      })
    )
    .put(
      'marketingMessages',
      createField({
        value: userSettings ? userSettings.marketingMessages : ''
      })
    )
    .put(
      'allAnalyticsServices',
      createField({
        value: userSettings ? userSettings.allAnalyticsServices : ''
      })
    )
    .put(
      'walkmeAnalyticsServices',
      createField({
        value: userSettings ? userSettings.walkmeAnalyticsServices : ''
      })
    )
    .put(
      'assistmeGuidanceServices',
      createField({
        value: userSettings ? userSettings.assistmeGuidanceServices : ''
      })
    )
    .put(
      'allSupportAndResearchServices',
      createField({
        value: userSettings ? userSettings.allSupportAndResearchServices : ''
      })
    )
    .put(
      'testingGroup',
      createField({
        value: userSettings ? userSettings.testingGroup : ''
      })
    )
    .put(
      'showUserGoalSelection',
      createField({
        value: false
      })
    );

  form = addDynamicRoleField(form, userSettings);
  return form;
}

function roleValidator(value) {
  // yes, also empty string
  if (!value) {
    return [{ severity: 'error', message: t('in-settings:terms.roleMissing') }];
  }

  return null;
}

export function addDynamicRoleField(form, userSettings) {
  if (form.get('role').value === 'other' && !form.get('dynamicRole')) {
    return form.put(
      'dynamicRole',
      createField({
        value: userSettings?.dynamicRole ?? '',
        validator: notBlankValidator
      })
    );
  }
  return form.remove('dynamicRole');
}
