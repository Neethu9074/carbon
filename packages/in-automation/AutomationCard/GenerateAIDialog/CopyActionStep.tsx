/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field as FormField } from 'formalistic';
import React from 'react';

import { Typography, Spacer } from '@instana/components';

import { AIActionForm } from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { isScript, isManual, getType } from 'in-automation/ActionCatalog/shared';
import SectionHeading from 'in-settings/components/SectionHeading';
import useActionTags from 'in-automation/hooks/useActionTags';
import TextArea from 'in-components/form/TextArea/TextArea';
import HelpText from 'in-components/form/HelpText/HelpText';
import Notification from 'in-components/form/Notification';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import Section from 'in-settings/components/Section';
import { isLoading } from 'in-services/util/result';
import { ScoredAction } from 'in-automation/api';
import Code from 'in-components/form/Code/Code';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './SelectAIActionsDialogPresenter.mless';

export function CopyActionStep({
  form,
  updateForm,
  actionError,
  selectedAIAction
}: {
  form: AIActionForm;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
  selectedAIAction: ScoredAction | null;
  actionError?: string;
}) {
  const name = form.get('name');
  const description = form.get('description');
  const type = form.get('type');
  const tags = form.get('tags');
  const availableTags = useActionTags();

  return (
    <div>
      <div className={locals.actionModalPadding}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:simpleAIDialog.Step2Headline')}</Typography>
        <Spacer vertical="normal" />
        {/*  Add error handling when action creation fails */}
        {actionError && actionError !== '' && (
          <>
            <Section>
              <Notification failure>{actionError}</Notification>
            </Section>
          </>
        )}
        <fieldset>
          <Row>
            <Col lg={11}>
              <SectionHeading>{t('in-automation:ActionCatalog.1ActionDetails')}</SectionHeading>
              <div className={locals.formElements}>
                <div>
                  {name.map(field => (
                    <FormGroup>
                      <Label htmlFor="action-name" hasError={!field.valid && field.touched}>
                        {t('in-automation:name')}
                      </Label>
                      <Input
                        id="action-name"
                        type="text"
                        value={field.value}
                        onChange={e =>
                          updateForm(form =>
                            form!.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true))
                          )
                        }
                        hasError={!field.valid && field.touched}
                        maxLength={256}
                        autoFocus
                      />
                      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                      <HelpText className={locals.subTextFormField}>
                        {t('in-automation:ActionCatalog.showsUpInTheListOfActions')}
                      </HelpText>
                    </FormGroup>
                  ))}
                  {description.map(field => (
                    <FormGroup>
                      <Label htmlFor="action-description" hasError={!field.valid && field.touched}>
                        {t('in-automation:description')}
                      </Label>
                      <TextArea
                        id="action-description"
                        value={field.value}
                        onChange={e =>
                          updateForm(form =>
                            form!.updateIn(['description'], item =>
                              item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                            )
                          )
                        }
                        hasError={!field.valid && field.touched}
                      />
                      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                      <HelpText className={locals.subTextFormField}>
                        {t('in-automation:ActionCatalog.showsUpInTheActionDescription')}
                      </HelpText>
                    </FormGroup>
                  ))}
                  {tags.map(field => (
                    <FormGroup>
                      <Label htmlFor="action-tags" hasError={!field.valid && field.touched}>
                        {t('in-automation:tagsLabel')}
                      </Label>
                      <CreatableTagSelect
                        id="action-tags"
                        isLoading={isLoading(availableTags)}
                        tags={availableTags.data}
                        value={field.value}
                        onChange={newTags =>
                          updateForm(form => form.updateIn(['tags'], item => item.setValue(newTags).setTouched(true)))
                        }
                      />
                    </FormGroup>
                  ))}
                </div>
              </div>
              <SectionHeading>{t('in-automation:ActionCatalog.2ActionConfiguration')}</SectionHeading>
              {type.map(field => (
                <FormGroup>
                  <Label htmlFor="action-type">{t('in-automation:type')}</Label>
                  <Typography variant="body-regular">{getType(field.value)}</Typography>
                </FormGroup>
              ))}
              {isScript(selectedAIAction?.type) && <ScriptSection form={form} updateForm={updateForm} />}
              {isManual(selectedAIAction?.type) && <ManualSection form={form} updateForm={updateForm} />}
            </Col>
          </Row>
        </fieldset>
      </div>
    </div>
  );
}

const ScriptSection = ({
  form,
  updateForm
}: {
  form: AIActionForm;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
}) => {
  const script = form.get('script');

  return (
    <>
      {script?.map(field => (
        <FormGroup>
          <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.script')}
          </Label>
          <Code
            lineNumbers
            mode={'shell'}
            value={field.value}
            onChange={value =>
              updateForm(
                form =>
                  form.updateIn(['script'], item =>
                    (item as FormField<string>).setValue(value).setTouched(true)
                  ) as AIActionForm
              )
            }
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
        </FormGroup>
      ))}
    </>
  );
};

const ManualSection = ({
  form,
  updateForm
}: {
  form: AIActionForm;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
}) => {
  const content = form.get('manualContent');
  return (
    <>
      {content?.map(field => (
        <FormGroup>
          <Label htmlFor="action-content" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.content')}
          </Label>
          <Code
            lineNumbers={false}
            mode={'markdown'}
            value={field.value}
            onChange={value =>
              updateForm(
                form =>
                  form.updateIn(['manualContent'], item =>
                    (item as FormField<string>).setValue(value).setTouched(true)
                  ) as AIActionForm
              )
            }
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:ActionCatalog.manualContentDescription')}
          </HelpText>
        </FormGroup>
      ))}
    </>
  );
};
