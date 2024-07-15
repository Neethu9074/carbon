/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Toggle } from '@instana/components';

import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import HorizontalFormGroup from 'in-components/form/HorizontalFormGroup';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import PromptPresenter from 'in-components/Dialog/PromptPresenter';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { notBlankValidator } from 'in-services/validators/string';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { close } from 'in-components/DialogPresenter/store';
import Label from 'in-components/form/Label';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

export default function DuplicateDashboardDialog({ config }) {
  const {location, navigate} = useNavigation();

  const [state, setState] = useState(() => ({
    form: createMapForm()
      .put(
        'title',
        createField({
          value: t('in-custom-dashboards:editor.copyOf', { title: config.title }),
          validator: notBlankValidator
        })
      )
      .put(
        'copySharingConfiguration',
        createField({
          value: false
        })
      ),
    isSaving: false,
    errors: null
  }));

  const presenterProps = {
    header: t('in-custom-dashboards:duplicateDashboardDialog.duplicateDashboard'),
    headerIcon: 'lib_views_grid',
    inputLabel: t('in-custom-dashboards:duplicateDashboardDialog.dashboardName'),
    confirmButtonLabel: t('in-custom-dashboards:duplicateDashboardDialog.duplicate'),
    ...state,
    field: state.form.get('title'),
    onChange: newValue =>
      setState({
        ...state,
        errors: null,
        form: state.form.updateIn(['title'], f => f.setValue(newValue).setTouched(true))
      }),
    onSubmit() {
      if (!state.form.valid) {
        setState({
          ...state,
          errors: null,
          form: state.form.setTouched(true, { recurse: true })
        });
        return;
      }

      setState({
        ...state,
        isSaving: true,
        errors: null
      });

      let accessRules;
      if (state.form.get('copySharingConfiguration').value) {
        // The current user is guaranteed to have write access. If the user
        // wouldn't have write access, then config.accessRules would be an
        // empty array and we would never present the option to duplicate
        // the access rules.
        accessRules = config.accessRules;
      } else {
        accessRules = [
          {
            accessType: 'READ_WRITE',
            relationType: 'USER',
            relatedId: user.id
          }
        ];
      }
      addCustomDashboard({
        title: state.form.get('title').value,
        accessRules,
        widgets: config.widgets
      })
        .filter(response => response.data || response.errors.length > 0)
        .once(
          response => {
            if (response.data) {
              const customDashboardId = response.data.id;
              const targetLocation = {...location, pathname: viewPathFullyQualified}
              setOrDeleteMatrixKey(targetLocation, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, customDashboardId)
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
                  message: t('in-custom-dashboards:duplicateDashboardDialog.failedToCreateDashboard')
                }
              ]
            });
          }
        );
    },
    additionalFields:
      config.accessRules.length > 0 &&
      state.form.get('copySharingConfiguration').map(field => (
        <HorizontalFormGroup
          label={
            <Label htmlFor="duplicate-dashboard-sharing" hasError={!field.valid && field.touched}>
              {t('in-custom-dashboards:duplicateDashboardDialog.copyShareConfig')}
            </Label>
          }
          formElement={
            <Toggle
              id="duplicate-dashboard-sharing"
              checked={field.value}
              onToggle={e =>
                setState({
                  ...state,
                  form: state.form.updateIn(['copySharingConfiguration'], f => f.setValue(e).setTouched(true))
                })
              }
              disabled={state.isSaving}
            />
          }
        />
      ))
  };

  return <PromptPresenter {...presenterProps} />;
}
