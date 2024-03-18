/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext, useState } from 'react';

import { Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloScopeServiceEndpointForm from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloScopeServiceEndpointForm';
import ApplicationTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { titleWidth } from 'in-service-levels/constants';

export default function ScopeSelection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const isCustomTag = tagFilterExpressionField.value.length;

  const scopeSelection = isCustomTag ? 'custom' : 'serviceEndpoint';
  const [scope, setScope] = useState(scopeSelection);
  const isFormInEditMode = mode === 'EDIT';

  return (
    <TabSelect
      onChange={scope => {
        setScope(scope);
        if (scope != 'custom' && isCustomTag) {
          onChange(['scope', 'tagFilterExpression'], () => tagFilterExpressionField.setValue([]).setTouched(true));
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
          <SloScopeServiceEndpointForm />
        </TabSelectPanel>
        <TabSelectPanel id="custom">
          <ApplicationTagFilterBuilder form={form} onChange={onChange} readOnly={isFormInEditMode} width={titleWidth} />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
