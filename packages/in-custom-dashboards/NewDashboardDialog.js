/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React, { useState } from 'react';

import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { CUSTOM_DASHBOARD_CREATE } from 'in-services/tracking/tracking';
import PromptPresenter from 'in-components/Dialog/PromptPresenter';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { notBlankValidator } from 'in-services/validators/string';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { close } from 'in-components/DialogPresenter/store';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

export default function NewDashboardDialog() {
  const [state, setState] = useState({
    field: createField({
      value: '',
      validator: notBlankValidator
    }),
    isSaving: false,
    errors: null
  });
  const { location, navigate } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const presenterProps = {
    header: t('in-custom-dashboards:newDashboardDialog.createNewDashboard'),
    headerIcon: 'lib_views_grid',
    inputLabel: t('in-custom-dashboards:newDashboardDialog.dashboardName'),
    additionalFields: <p>{t('in-custom-dashboards:newDashboardDialog.additionalFields')}</p>,
    confirmButtonLabel: t('in-custom-dashboards:newDashboardDialog.create'),
    ...state,
    onChange: newValue =>
      setState({
        ...state,
        errors: null,
        field: state.field.setValue(newValue).setTouched(true)
      }),
    onSubmit() {
      if (!state.field.valid) {
        setState({
          ...state,
          errors: null,
          field: state.field.setTouched(true)
        });
        return;
      }

      setState({
        ...state,
        isSaving: true,
        errors: null
      });

      addCustomDashboard({
        title: state.field.value,
        accessRules: [
          {
            accessType: 'READ_WRITE',
            relationType: 'USER',
            relatedId: user.id
          }
        ],
        widgets: []
      })
        .filter(response => response.data || response.errors.length > 0)
        .once(
          response => {
            if (response.data) {
              const customDashboardId = response.data.id;
              trackCta(CUSTOM_DASHBOARD_CREATE, { title: state.field.value });
              const targetLocation = { ...location, pathname: viewPathFullyQualified };
              setOrDeleteMatrixKey(
                targetLocation,
                dashboardIdUrlParameter.path,
                dashboardIdUrlParameter.name,
                customDashboardId
              );
              navigate(targetLocation);
              close();
              return;
            }

            setState({
              ...state,
              isSaving: false,
              errors: response.errors
            });
          },
          () => {
            setState({
              ...state,
              isSaving: false,
              errors: [
                {
                  code: 'SERVER',
                  message: t('in-custom-dashboards:newDashboardDialog.failedToCreateDashboard')
                }
              ]
            });
          }
        );
    }
  };

  return <PromptPresenter {...presenterProps} />;
}
