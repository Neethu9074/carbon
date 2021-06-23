/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import {
  putTagValueField,
  removeTagValueField
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import HostScopeDefinitionSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector';
import { infraTagTreeNode } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { onChangeApplyOn } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { scopeEverything } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { EQUALS, IS_EMPTY, NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function ScopeHostsByTagFormGroup({ form, onChange }) {
  const tagValueField = form.get('tagValue');

  return (
    <FormGroup>
      <Label hasError={hasError()}>{t('in-settings:tabs.scopeHostsByTag')}</Label>
      <HostScopeDefinitionSelector
        tagTreeNode={infraTagTreeNode}
        getSuggestions={() =>
          just({
            data: {
              suggestions: []
            }
          })
        }
        tagValueField={tagValueField}
        setTagValue={updatedTagValue => onChange('tagValue', updatedTagValue)}
        operator={form.get('tagOperator')?.value ?? EQUALS}
        setOperator={handleOperatorChange}
        handleCancel={() => onChangeApplyOn(scopeEverything, onChange)}
      />
      {tagValueField ? <TouchedMessages field={tagValueField} /> : null}
    </FormGroup>
  );

  function handleOperatorChange(updatedOperator) {
    const updateFormDefinition = form => {
      if ([IS_EMPTY, NOT_EMPTY].includes(updatedOperator)) {
        return removeTagValueField(form);
      }

      return putTagValueField(form, form.get('tagValue')?.value);
    };

    onChange('tagOperator', updatedOperator, updateFormDefinition);
  }

  function hasError() {
    if (tagValueField) {
      return !tagValueField.valid && tagValueField.touched;
    }

    return false;
  }
}
