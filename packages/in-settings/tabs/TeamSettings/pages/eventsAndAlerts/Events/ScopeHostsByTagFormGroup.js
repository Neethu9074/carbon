/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import HostScopeDefinitionSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector';
import { infraTagTreeNode } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { onChangeApplyOn } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { scopeEverything } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function ScopeHostsByTagFormGroup({ form, onChange }) {
  const tagValue = form.get('tagValue');

  return (
    <FormGroup>
      <Label hasError={!tagValue.valid && tagValue.touched}>{t('in-settings:tabs.scopeHostsByTag')}</Label>
      <HostScopeDefinitionSelector
        tagTreeNode={infraTagTreeNode}
        getSuggestions={() =>
          just({
            data: {
              suggestions: []
            }
          })
        }
        tagValue={tagValue?.value ?? ''}
        setTagValue={updatedTagValue => onChange('tagValue', updatedTagValue)}
        operator={form.get('tagOperator')?.value ?? EQUALS}
        setOperator={updatedOperator => onChange('tagOperator', updatedOperator)}
        handleCancel={() => onChangeApplyOn(scopeEverything, onChange)}
      />
      <TouchedMessages field={tagValue} />
    </FormGroup>
  );
}
