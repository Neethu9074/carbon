import { createField, createMapForm } from 'formalistic';

export default function termsFormDefinition(userSettings, withAcceptanceFields = true) {
  let form = createMapForm()
    .put(
      'role',
      createField({
        value: userSettings ? userSettings.role : ''
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

  return [{ severity: 'error', message: 'Terms agreement missing' }];
}
