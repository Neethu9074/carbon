/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext, useState } from 'react';

import { Stack, Typography } from '@instana/components';

import SloScopeServiceEndpointPanel from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloScopeServiceEndpointPanel';
import ApplicationTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function ScopeSelection() {
  const { form, mode, onChange, setForm } = useContext(SloFormContext);

  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const tagFilterExpression = tagFilterExpressionField.value ?? [];
  const isCustomTag = tagFilterExpression.length > 0;
  const scopeSelection = isCustomTag ? 'custom' : 'serviceEndpoint';
  const [scope, setScope] = useState(scopeSelection);
  const isFormInEditMode = mode === 'EDIT';

  return (
    <TabSelect
      onChange={scope => {
        setScope(scope);
        if (scope !== 'custom' && isCustomTag) {
          onChange(['scope', 'tagFilterExpression'], () => tagFilterExpressionField.setValue([]).setTouched(true));
        } else if (scope === 'custom') {
          const newForm = form
            .updateIn(['scope', 'serviceId'], item => item.setValue('').setTouched(true))
            .updateIn(['scope', 'endpointId'], item => item.setValue('').setTouched(true));
          setForm(newForm);
        }
      }}
      activePanelId={scope === 'custom' ? 'custom' : 'serviceEndpoint'}
    >
      <TabSelectHeader>
        <Typography variant="heading-200" noWrap noMargin>
          {t('in-service-levels:createSloDialog.SelectServiceandEndpoint')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem forId="serviceEndpoint" withRadioButton disabled={isFormInEditMode}>
          <span>{t('in-service-levels:createSloDialog.serviceAndEndpoint')}</span>
        </TabSelectItem>
        <TabSelectItem forId="custom" withRadioButton disabled={isFormInEditMode}>
          <span>{t('in-service-levels:general.custom')}</span>
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel id="serviceEndpoint">
          <SloScopeServiceEndpointPanel />
        </TabSelectPanel>
        <TabSelectPanel id="custom">
          <Stack gap="small">
            <Typography variant="heading-200">{t('in-service-levels:createSloDialog.custom')}</Typography>
            <Typography variant="body-regular">{t('in-service-levels:createSloDialog.customDescription')}</Typography>
            <ApplicationTagFilterBuilder />
          </Stack>
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
