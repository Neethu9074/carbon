/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Stack } from '@instana/components';
import { Checkbox } from '@instana/carbon';

import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section/Section';
import { titleWidth } from 'in-service-levels/constants';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function SloScopeSyntheticSection() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const includeUnscheduledTestResultsField = form.getIn(['scope', 'includeUnscheduledTestResults']);

  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.selectScopeNavItem')}>
      <Stack gap="small">
        <Sections>
          <Section
            title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.syntheticTestResultsTitle')}
            titleWidth={titleWidth}
          >
            <Row>
              <Col md={6} xs={6}>
                <Checkbox
                  id="slo-unscheduled-test-results-checkbox"
                  disabled={mode === 'EDIT'}
                  checked={includeUnscheduledTestResultsField.value}
                  labelText={t('in-custom-dashboards:widgets.slo.sliFormPresenter.includeUnscheduledTestResults')}
                  onChange={() =>
                    onChange(['scope', 'includeUnscheduledTestResults'], () =>
                      includeUnscheduledTestResultsField.setValue(!includeUnscheduledTestResultsField.value)
                    )
                  }
                />
              </Col>
            </Row>
          </Section>
        </Sections>
      </Stack>
    </SloDialogSection>
  );
}
