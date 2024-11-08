/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack } from '@instana/components';

import BoundaryScopeConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/BoundaryScopeConfigurator';
import HiddenCallsConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/HiddenCallsConfigurator';
import ScopeSelection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/ScopeSelection';
import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { defaultBoundaryScope, titleWidth } from 'in-service-levels/constants';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export default function SloScopeApplicationSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const boundaryField = form.getIn(['scope', 'boundaryScope']);
  const includeInternalField = form.getIn(['scope', 'includeInternal']);
  const includeSyntheticField = form.getIn(['scope', 'includeSynthetic']);

  const boundaryScope = boundaryField.value ?? defaultBoundaryScope;
  const isFormInEditMode = mode === 'EDIT';

  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.selectScopeNavItem')}>
      <Stack gap="small">
        <Sections>
          <Section title={t('in-service-levels:general.boundary')} titleWidth={titleWidth}>
            <BoundaryScopeConfigurator
              disabled={isFormInEditMode}
              onChange={scope =>
                onChange(['scope', 'boundaryScope'], () => boundaryField.setValue(scope).setTouched(true))
              }
              value={boundaryScope}
            />
          </Section>
          <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')} titleWidth={titleWidth}>
            <HiddenCallsConfigurator
              disabled={isFormInEditMode}
              includeInternal={includeInternalField.value}
              includeSynthetic={includeSyntheticField.value}
              onChangeInternal={() =>
                onChange(['scope', 'includeInternal'], () => includeInternalField.setValue(!includeInternalField.value))
              }
              onChangeSynthetic={() =>
                onChange(['scope', 'includeSynthetic'], () =>
                  includeSyntheticField.setValue(!includeSyntheticField.value)
                )
              }
            />
          </Section>
        </Sections>
        <ScopeSelection />
      </Stack>
    </SloDialogSection>
  );
}
