/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import {
  putDocLinkFields,
  putScriptField
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import { DOC_LINK_TYPE, isDocLink, isScript, SCRIPT_TYPE } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import TagsWrapper from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsWrapper';
import RunAction from 'in-events/components/AutomationActions/RunAction';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Code from 'in-components/form/Code/Code';
import Select from 'in-components/form/Select';
import { NewAction } from 'in-api/automation';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

interface ActionFormProps {
  form: MapForm;
  onChange: Function;
  entity: NewAction | Action;
  setForm: (form: MapForm) => void;
}

export default function ActionForm({ form, setForm, onChange, entity: action }: ActionFormProps) {
  const name = form.get('name') as Field<string>;
  const description = form.get('description') as Field<string>;
  const type = form.get('type') as Field<string>;
  const docLink = form.get('docLink') as Field<string>;
  const script = form.get('script') as Field<string>;

  return (
    <fieldset>
      <SectionHeading>{t('in-settings:tabs.1ActionDetails')}</SectionHeading>
      <Row>
        <Col lg={8}>
          <>
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
                      const updatedType = (updatedForm.get('type') as Field<string>).value;
                      if (isDocLink(updatedType)) {
                        updatedForm = updatedForm.remove('script');
                        updatedForm = putDocLinkFields(updatedForm, action);
                      } else if (isScript(updatedType)) {
                        updatedForm = updatedForm.remove('docLink');
                        updatedForm = putScriptField(updatedForm, action);
                      }
                      return updatedForm;
                    })
                  }
                  hasError={!field.valid && field.touched}
                >
                  <option value={DOC_LINK_TYPE}>{t('in-settings:tabs.docLink')}</option>
                  <option value={SCRIPT_TYPE}>{t('in-settings:tabs.script')}</option>
                </Select>
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.actionTypeHelper')}</HelpText>
              </FormGroup>
            ))}
            <FormGroup>
              <TagsWrapper form={form} setForm={setForm} onChange={onChange} />
            </FormGroup>
            {isDocLink(type.value) && (
              <>
                {docLink.map(field => (
                  <FormGroup>
                    <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.docLink')}
                    </Label>
                    <Input
                      id="action-docLink"
                      type="text"
                      value={field.value}
                      onChange={e => onChange('docLink', e.target.value)}
                      hasError={!field.valid && field.touched}
                      maxLength={256}
                    />
                    <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                    <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.docLinkDescription')}</HelpText>
                  </FormGroup>
                ))}
              </>
            )}
            {isScript(type.value) && (
              <>
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
                    <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.scriptDescription')}</HelpText>
                  </FormGroup>
                ))}
                <Button
                  onClick={() =>
                    addActiveDialog(
                      <RunAction
                        action={{ name: name.value, description: description.value } as Action}
                        script={btoa(script.value)}
                        volatileId={{}}
                        test
                      />
                    )
                  }
                >
                  {t('in-settings:tabs.test')}
                </Button>
              </>
            )}
          </>
        </Col>
      </Row>
    </fieldset>
  );
}
