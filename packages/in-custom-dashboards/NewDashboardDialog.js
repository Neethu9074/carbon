/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps, withState } from 'recompose';
import { createField } from 'formalistic';
import React from 'react';

import { goToCustomDashboard } from 'in-custom-dashboards/navigation/url';
import PromptPresenter from 'in-components/Dialog/PromptPresenter';
import { notBlankValidator } from 'in-services/validators/string';
import { createDashboard } from 'in-custom-dashboards/tracker';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { close } from 'in-components/DialogPresenter/store';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

export default compose(
  withState('state', 'setState', {
    field: createField({
      value: '',
      validator: notBlankValidator
    }),
    isSaving: false,
    errors: null
  }),
  withProps(({ state, setState }) => ({
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
              createDashboard(state.field.value);
              goToCustomDashboard(customDashboardId);
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
  }))
)(PromptPresenter);
