/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';

import { isDeprecatedUserDefinedRole } from 'in-settings/terms/userSelfDefinedRole';
import { t } from 'in-i18n';

export default function termsFormDefinition(userSettings, withAcceptanceFields = true) {
  let form = createMapForm()
    .put(
      'role',
      createField({
        value: userSettings && !isDeprecatedUserDefinedRole(userSettings.role) ? userSettings.role : '',
        validator: withAcceptanceFields && roleValidator
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
    );

  form = addDynamicRoleField(form, userSettings);

  if (withAcceptanceFields) {
    form = form
      .put(
        'tosAccepted',
        createField({
          value: false,
          validator: checkboxCheckedValidator
        })
      )
      .put(
        'privacyAgreementAccepted',
        createField({
          value: false,
          validator: checkboxCheckedValidator
        })
      );
  }

  return form;
}

function checkboxCheckedValidator(value) {
  if (value) {
    return null;
  }
  return [{ severity: 'error', message: t('in-settings:terms.termsAgreementMissing') }];
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
