/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import InboundOrAllCallsOption from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import InputInSection from 'in-components/form/Input/InputInSection';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section/Section';
import { boundaryScopes } from 'in-applications/constants';
import Header from 'in-components/workspace/Header/Header';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Form from 'in-components/form/binding/Form';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface CreateApplicationFormProps {
  form: MapForm;
  updateForm: (updatedForm: Item) => void;
  onSubmit: (submittedData: Item) => void;
}

export default function CreateApplicationForm({ form, updateForm, onSubmit }: CreateApplicationFormProps) {
  // TODO: This is currently just a dummy implementation for the CreateApplicationForm
  const boundaryScope = 'ALL';

  return (
    <Form form={form} setForm={updateForm} onSubmit={onSubmit} formId="createApdexForm">
      <Stack gap="large">
        <Stack component="section" gap="normal">
          <Header>{t('in-custom-dashboards:widgets.apdex.createApdexForm.customizationHeader')}</Header>

          <Stack gap="xsmall">
            <Sections>
              <InputInSection
                id="new-apdex-name"
                label={t('in-custom-dashboards:widgets.apdex.createApdexForm.label')}
                onChange={noop}
                value=""
                hasError={false}
                maxLength={256}
              />
            </Sections>
          </Stack>
        </Stack>

        <Stack gap="large">
          <Sections>
            <Section title={t('in-custom-dashboards:widgets.apdex.createApplicationApdexForm.boundary')}>
              <Row>
                <Col md={5} xs={5}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={noop}
                    scope={boundaryScopes.inbound}
                  />
                </Col>
                <Col md={5} xs={5}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={noop}
                    scope={boundaryScopes.all}
                  />
                </Col>
              </Row>
            </Section>
          </Sections>
        </Stack>
      </Stack>
    </Form>
  );
}
