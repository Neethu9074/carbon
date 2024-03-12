/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

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
import { defaultScope } from 'in-service-levels/constants';
import { titleWidth } from 'in-service-levels/constants';

export default function SloRefactorScopeSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const scopeSelect = form.getIn(['scope', 'scopeSelection']);

  const isFormInEditMode = mode === 'EDIT';
  return (
    <TabSelect
      onChange={scope => {
        onChange(['scope', 'scopeSelection'], () => scopeSelect.setValue(scope));
      }}
      activePanelId={scopeSelect.value ?? defaultScope}
    >
      <TabSelectHeader>
        <Typography variant="heading-200" noWrap noMargin>
          {t('in-service-levels:createSloDialog.SelectServiceandEndpoint')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem forId="serviceEndpoint" withRadioButton>
          <span>{t('in-service-levels:createSloDialog.serviceAndEndpoint')}</span>
        </TabSelectItem>
        <TabSelectItem forId="custom" withRadioButton>
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
