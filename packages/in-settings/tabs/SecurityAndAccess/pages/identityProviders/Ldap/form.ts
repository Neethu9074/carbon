/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, notBlankValidator, ValidationResult } from 'formalistic';

import { LdapConfig } from '@instana/types';

import {
  LDAP_MODE,
  LdapFormMode,
  LdapMapForm,
  ReadOnlyAuthFormItems
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap.types';
import { deleteConfigEnableValidator } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

function checkNonAnonymousROUserHasCredentials({
  emptyPass,
  roUser,
  roPassword
}: ReadOnlyAuthFormItems): ValidationResult {
  if (!emptyPass.value) {
    if (isBlank(roUser.value)) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.theValueMustNotBeBlank'),
          path: 'roUser'
        }
      ];
    }
    if (isBlank(roPassword.value)) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.theValueMustNotBeBlank'),
          path: 'roPassword'
        }
      ];
    }
  }
  return undefined;
}

export function createForm(apiResult?: LdapConfig, isActive?: boolean): LdapMapForm {
  if (isActive) {
    return createReadOnlyForm(apiResult);
  } else {
    return createEditForm(apiResult);
  }
}

export function createEditForm(apiResult?: LdapConfig): LdapMapForm {
  const isReadOnlyUserPasswordCheck = apiResult?.emptyPass;
  return createMapForm({
    items: {
      url: createField({
        value: apiResult?.url ?? '',
        validator: notBlankValidator
      }),
      acceptAnyCA: createField({
        value: !!apiResult?.acceptAnyCA
      }),
      roForm: createMapForm<ReadOnlyAuthFormItems>({
        validator: checkNonAnonymousROUserHasCredentials,
        items: {
          emptyPass: createField({
            value: !!isReadOnlyUserPasswordCheck
          }),
          roUser: createField({
            value: apiResult?.roUser ?? ''
          }),
          roPassword: createField({
            value: apiResult?.roPassword ?? ''
          })
        }
      }),
      base: createField({
        value: apiResult?.base ?? '',
        validator: notBlankValidator
      }),
      groupQuery: createField({
        value: apiResult?.groupQuery ?? '',
        validator: notBlankValidator
      }),
      groupMemberField: createField({
        value: apiResult?.groupMemberField ?? '',
        validator: notBlankValidator
      }),
      userQueryTemplate: createField({
        value: apiResult?.userQueryTemplate ?? '',
        validator: notBlankValidator
      }),
      emailField: createField({
        value: apiResult?.emailField ?? '',
        validator: notBlankValidator
      }),
      userDnMapping: createField({
        value: apiResult?.userDnMapping ?? ''
      }),
      userField: createField({
        value: apiResult?.userField ?? ''
      }),
      groupMemberFieldConfigured: createField({
        value: !!apiResult?.groupMemberFieldConfigured
      }),
      testUser: createField({
        value: apiResult?.testUser ?? '',
        validator: notBlankValidator
      }),
      testPassword: createField({
        value: apiResult?.testPassword ?? '',
        validator: notBlankValidator
      }),
      isDeleteEnabled: createField({
        value: false
      }),
      mode: createField<LdapFormMode>({
        value: LDAP_MODE.EDIT
      })
    }
  });
}

export function createReadOnlyForm(apiResult?: LdapConfig): LdapMapForm {
  const isReadOnlyUserPasswordCheck = apiResult?.emptyPass;
  return createMapForm({
    items: {
      url: createField({
        value: apiResult?.url ?? ''
      }),
      acceptAnyCA: createField({
        value: !!apiResult?.acceptAnyCA
      }),
      roForm: createMapForm<ReadOnlyAuthFormItems>({
        items: {
          emptyPass: createField({
            value: !!isReadOnlyUserPasswordCheck
          }),
          roUser: createField({
            value: apiResult?.roUser ?? ''
          }),
          roPassword: createField({
            value: apiResult?.roPassword ?? ''
          })
        }
      }),
      base: createField({
        value: apiResult?.base ?? ''
      }),
      groupQuery: createField({
        value: apiResult?.groupQuery ?? ''
      }),
      groupMemberField: createField({
        value: apiResult?.groupMemberField ?? ''
      }),
      userQueryTemplate: createField({
        value: apiResult?.userQueryTemplate ?? ''
      }),
      emailField: createField({
        value: apiResult?.emailField ?? ''
      }),
      userDnMapping: createField({
        value: apiResult?.userDnMapping ?? ''
      }),
      userField: createField({
        value: apiResult?.userField ?? ''
      }),
      groupMemberFieldConfigured: createField({
        value: !!apiResult?.groupMemberFieldConfigured
      }),
      testUser: createField({
        value: apiResult?.testUser ?? ''
      }),
      testPassword: createField({
        value: apiResult?.testPassword ?? ''
      }),
      isDeleteEnabled: createField({
        value: false,
        validator: deleteConfigEnableValidator
      }),
      mode: createField<LdapFormMode>({
        value: LDAP_MODE.DELETE
      })
    }
  });
}
