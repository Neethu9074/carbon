/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment, SetStateAction } from 'react';
import { Field, MapForm } from 'formalistic';

import {
  putDocLinkFields,
  putScriptField
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import TagsWrapper from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsWrapper';
// @ts-expect-error
import Code from 'in-components/form/Code/Code';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { ImmutableNewAction } from 'in-api/automation';
import TextArea from 'in-components/form/TextArea';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

interface ActionFormProps {
  form: MapForm;
  onChange: Function;
  entity: ImmutableNewAction;
  setForm: (form: MapForm) => SetStateAction<MapForm>;
}

export default function ActionForm({ form, setForm, onChange, entity: action }: ActionFormProps) {
  const name = form.get('name') as Field<string>;
  const description = form.get('description') as Field<string>;
  const type = form.get('type') as Field<string>;
  const docLinkValue = form.get('docLinkValue') as Field<string>;
  const script = form.get('script') as Field<string>;

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
                  {t('in-settings:tabs.showsUpInTheListOfActions')}
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
                  {t('in-settings:tabs.showsUpInTheActionDescription')}
                </HelpText>
              </FormGroup>
            ))}
            {type.map(field => (
              <FormGroup>
                <Label htmlFor="action-type" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.type')}
                </Label>
                <Select
                  id="action-type"
                  value={field.value}
                  onChange={e =>
                    onChange('type', e.target.value, (updatedForm: MapForm) => {
                      // WILL NEED TO UPDATE THIS FOR NEW TYPES
                      const updatedType = updatedForm?.get('type')?.toJS();
                      if (updatedType === 'doc_link') {
                        updatedForm = updatedForm.remove('script');
                        updatedForm = putDocLinkFields(updatedForm, action);
                      } else if (updatedType === 'SCRIPT') {
                        updatedForm = updatedForm.remove('docLinkValue');
                        updatedForm = putScriptField(updatedForm, action);
                      }
                      return updatedForm;
                    })
                  }
                  hasError={!field.valid && field.touched}
                >
                  <option value={'doc_link'}>{t('in-settings:tabs.docLink')}</option>
                  <option value={'SCRIPT'}>{t('in-settings:tabs.script')}</option>
                  <option value={'HTTP'}>{t('in-settings:tabs.http')}</option>
                </Select>
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.actionTypeHelper')}</HelpText>
              </FormGroup>
            ))}
            <FormGroup>
              <TagsWrapper form={form} setForm={setForm} onChange={onChange} />
            </FormGroup>
            {isDocLink(form) && (
              <Fragment>
                {docLinkValue.map(field => (
                  <FormGroup>
                    <Label htmlFor="action-docLinkValue" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.docLinkValue')}
                    </Label>
                    <Input
                      id="action-docLinkValue"
                      type="text"
                      value={field.value}
                      onChange={e => onChange('docLinkValue', e.target.value)}
                      hasError={!field.valid && field.touched}
                      maxLength={256}
                    />
                    <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                    <HelpText className={locals.subTextFormField}>
                      {(action.get('fields') as any).get(0).get('description')}
                    </HelpText>
                  </FormGroup>
                ))}
              </Fragment>
            )}
            {isScript(form) && (
              <Fragment>
                {script.map(field => (
                  <FormGroup>
                    <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.script')}
                    </Label>
                    <Code
                      lineNumbers
                      mode={'shell'}
                      value={field.value}
                      onChange={(value: string) => onChange('script', value)}
                    />
                    <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                    <HelpText className={locals.subTextFormField}>
                      {(action.get('fields') as any)?.get(1)?.get('description')}
                    </HelpText>
                  </FormGroup>
                ))}
              </Fragment>
            )}
          </Fragment>
        </Col>
      </Row>
    </fieldset>
  );
}

const isDocLink = (form: MapForm) => form.get('type')?.toJS() === 'doc_link';
const isScript = (form: MapForm) => form.get('type')?.toJS() === 'SCRIPT';
