/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm } from 'formalistic';
import React, { useState } from 'react';

import { getInitialFormState as createWidgetForm } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
import EditAsJsonDialogPresenter from 'in-custom-dashboards/CustomDashboard/EditAsJsonDialog/EditAsJsonDialogPresenter';
import { stringValidator, arrayValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { generateUniqueShortId } from '@instana/utils';
import { user, role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function EditAsJsonDialog(props) {
  const [field, setField] = useState(
    createField({
      value: JSON.stringify(props.config, 0, 2),
      validator
    })
  );

  return <EditAsJsonDialogPresenter {...props} field={field} setField={setField} onSubmit={onSubmit} />;

  function onSubmit() {
    if (!field.valid) {
      setField(field.setTouched(true));
      return;
    }

    // Push it back through the form mechanism to set all default values and to
    // remove all non-supported values.
    const changedConfig = createForm(JSON.parse(field.value)).toJS();
    // Ensure that the user doesn't try to circumvent the sharing dialog via
    // edit as JSON. This also ensures that copy/pasted dashboards properly
    // can be stored without user intervention. The following code
    // ensures that at the very least the user has access to his/her own
    // dashboard.
    if (!role.canCreatePublicCustomDashboards) {
      changedConfig.accessRules = [];
    }
    ensureUserDoesNotLoseAccessViaEditAsJson(changedConfig);
    ensureWidgetIdUniqueness(changedConfig);
    props.onSubmit({
      // Retain server-generated flag which indicates write access.
      writable: true,
      // Restore original ID
      id: props.config.id,
      ...changedConfig
    });
    close();
  }
}

function validator(json) {
  let config;
  try {
    config = JSON.parse(json);
  } catch (e) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:customDashboard.editAsJsonDialog.failedToParseInputAsJson')
      }
    ];
  }

  if (!config || typeof config !== 'object') {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:customDashboard.editAsJsonDialog.jsonRootMustBeAnObject')
      }
    ];
  }

  return createForm(config).getAllMessagesInHierarchy();
}

function createForm(config) {
  return createMapForm()
    .put(
      'title',
      createField({
        value: config?.title,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'accessRules',
      createField({
        value: config?.accessRules || [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'widgets',
      createListForm({
        items: (config?.widgets || []).map(createWidgetForm),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    );
}

function ensureUserDoesNotLoseAccessViaEditAsJson(config) {
  const stillHasAccess = config.accessRules.some(
    ({ accessType, relationType, relatedId }) =>
      accessType === 'READ_WRITE' && relationType === 'USER' && relatedId === user.id
  );
  if (!stillHasAccess) {
    config.accessRules.push({
      accessType: 'READ_WRITE',
      relationType: 'USER',
      relatedId: user.id
    });
  }
}

function ensureWidgetIdUniqueness(config) {
  config.widgets.forEach(widget => (widget.id = generateUniqueShortId()));
}
