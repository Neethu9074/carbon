/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React, { Fragment } from 'react';

import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './CustomEventForm.mless';

interface ActionFormProps {
  form: MapForm;
  onChange: Function;
}

export default function ActionForm({ form, onChange }: ActionFormProps) {
  const name = form.get('name') as Field<string>;
  const description = form.get('name') as Field<string>;
  return (
    <fieldset>
      <SectionHeading>{t('in-settings:tabs.1ActionDetails')}</SectionHeading>
      <Row>
        <Col lg={8}>
          <Fragment>
            {name.map(field => (
              <FormGroup>
                <Label htmlFor="action-name" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.name')}
                </Label>
                <Input
                  id="action-name"
                  type="text"
                  value={field.value}
                  onChange={e => onChange('name', e.target.value)}
                  hasError={!field.valid && field.touched}
                  maxLength={256}
                  autoFocus
                />
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>
                  {t('in-settings:tabs.showsUpInTheListOfEvents')}
                </HelpText>
              </FormGroup>
            ))}
            {description.map(field => (
              <FormGroup>
                <Label htmlFor="action-description" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.description')}
                </Label>
                <TextArea
                  id="action-description"
                  value={field.value}
                  onChange={e => onChange('description', (e.target as HTMLTextAreaElement).value)}
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>
                  {t('in-settings:tabs.showsUpInTheIssueDescription')}
                </HelpText>
              </FormGroup>
            ))}
          </Fragment>
        </Col>
      </Row>
    </fieldset>
  );
}
