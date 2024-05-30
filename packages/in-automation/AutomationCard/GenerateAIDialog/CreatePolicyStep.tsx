/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer, Stack } from '@instana/components';

import { AIActionForm } from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SectionHeading from 'in-settings/components/SectionHeading';
import TagsTable from 'in-automation/ActionCatalog/TagsTable';
import TextArea from 'in-components/form/TextArea/TextArea';
import HelpText from 'in-components/form/HelpText/HelpText';
import Notification from 'in-components/form/Notification';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import Section from 'in-settings/components/Section';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { Event } from 'in-types';
import { t } from 'in-i18n';

import locals from './SelectAIActionsDialogPresenter.mless';

export function CreatePolicyStep({
  form,
  updateForm,
  actionError,
  event
}: {
  form: AIActionForm;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
  actionError?: string;
  event: Event;
}) {
  const name = form.get('policyName');
  const description = form.get('policyDescription');
  const actionName = form.get('name').value;
  const eventTriggerName = event.problem?.problemText;

  return (
    <div>
      <div className={locals.actionModalPadding}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:simpleAIDialog.Step3Headline')}</Typography>
        <Spacer vertical="normal" />
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
              <SectionHeading>{t('in-automation:simpleAIDialog.policyDetails')}</SectionHeading>
              <div className={locals.formElements}>
                <div>
                  {name.map(field => (
                    <FormGroup>
                      <Label htmlFor="policy-name" hasError={!field.valid && field.touched}>
                        {t('in-automation:name')}
                      </Label>
                      <Input
                        id="policy-name"
                        type="text"
                        value={field.value}
                        onChange={e =>
                          updateForm(form =>
                            form!.updateIn(['policyName'], item => item.setValue(e.target.value).setTouched(true))
                          )
                        }
                        hasError={!field.valid && field.touched}
                        maxLength={256}
                        autoFocus
                      />
                      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                      <HelpText className={locals.subTextFormField}>
                        {t('in-automation:policies.showsUpInTheListOfPolicies')}
                      </HelpText>
                    </FormGroup>
                  ))}
                  {description.map(field => (
                    <FormGroup>
                      <Label htmlFor="policy-description" hasError={!field.valid && field.touched}>
                        {t('in-automation:description')}
                      </Label>
                      <TextArea
                        id="policy-description"
                        value={field.value}
                        onChange={e =>
                          updateForm(form =>
                            form!.updateIn(['policyDescription'], item =>
                              item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                            )
                          )
                        }
                        hasError={!field.valid && field.touched}
                      />
                      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
                      <HelpText className={locals.subTextFormField}>
                        {t('in-automation:policies.showsUpInThePolicyDescription')}
                      </HelpText>
                    </FormGroup>
                  ))}
                  <FormGroup>
                    <TagsTable
                      form={form}
                      setForm={updateForm}
                      tagsFieldName="policyTags"
                      onChange={(fieldName, value) =>
                        //@ts-expect-error
                        updateForm(form => form!.updateIn([fieldName], item => item.setValue(value).setTouched(true)))
                      }
                    />
                  </FormGroup>
                </div>
              </div>
            </Col>
          </Row>
        </fieldset>
        <Spacer vertical="normal" />
        <Typography variant="body-large">{t('in-automation:simpleAIDialog.policyText')}</Typography>
        <Spacer vertical="normal" />
        <Stack direction="horizontal" gap="large">
          <Stack direction="vertical" gap="xxsmall">
            <Label htmlFor="action-name">{t('in-automation:policies.actionName')}</Label>
            <Typography variant="body-regular">{actionName}</Typography>
          </Stack>
          <Stack direction="vertical" gap="xxsmall">
            <Label htmlFor="action-name">{t('in-automation:policies.eventTrigger')}</Label>
            <Typography variant="body-regular">{eventTriggerName}</Typography>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}
