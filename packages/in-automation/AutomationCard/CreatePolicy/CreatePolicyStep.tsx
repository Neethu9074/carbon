/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field as FormField } from 'formalistic';
import React from 'react';

import { Typography, Spacer, Stack } from '@instana/components';

import { PolicyForm } from 'in-automation/AutomationCard/CreatePolicy/SimpleCreatePolicyDialog';
import { AIActionForm } from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SectionHeading from 'in-settings/components/SectionHeading';
import usePolicyTags from 'in-automation/hooks/usePolicyTags';
import TextArea from 'in-components/form/TextArea/TextArea';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { isLoading } from 'in-services/util/result';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { Event } from 'in-types';
import { t } from 'in-i18n';

import locals from './CreatePolicyDialogPresenter.mless';

export function CreatePolicyStep({
  form,
  updateForm,
  event
}: {
  form: PolicyForm;
  updateForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  event: Event;
}) {
  const name = form.get('policyName');
  const description = form.get('policyDescription');
  const actionName = form.get('name').value;
  const eventTriggerName = event.problem?.problemText ?? '';
  const policyTags = form.get('policyTags');
  return (
    <div>
      <div className={locals.actionModalPadding}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:SimpleCreatePolicyDialog.Step2Headline')}</Typography>
        <Spacer vertical="normal" />
        <PolicyFormBody
          updateForm={updateForm}
          name={name}
          description={description}
          actionName={actionName}
          eventTriggerName={eventTriggerName}
          policyTags={policyTags}
        />
      </div>
    </div>
  );
}

export const PolicyFormBody = ({
  updateForm,
  name,
  description,
  actionName,
  eventTriggerName,
  policyTags
}: {
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>> | React.Dispatch<React.SetStateAction<PolicyForm>>;
  name: FormField<string>;
  description: FormField<string>;
  actionName: string;
  eventTriggerName: string;
  policyTags: FormField<string[]>;
}) => {
  const availableTags = usePolicyTags();

  return (
    <>
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
                        updateForm((form: any) =>
                          form!.updateIn(['policyName'], (item: FormField<string>) =>
                            item.setValue(e.target.value).setTouched(true)
                          )
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
                        updateForm((form: any) =>
                          form!.updateIn(['policyDescription'], (item: FormField<string>) =>
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
                {policyTags.map(field => (
                  <FormGroup>
                    <Label htmlFor="policy-tags" hasError={!field.valid && field.touched}>
                      {t('in-automation:tagsLabel')}
                    </Label>
                    <CreatableTagSelect
                      id="policy-tags"
                      isLoading={isLoading(availableTags)}
                      tags={availableTags.data}
                      value={field.value}
                      onChange={newTags =>
                        updateForm((form: any) =>
                          form!.updateIn(['policyTags'], (item: FormField<string[]>) =>
                            item.setValue(newTags).setTouched(true)
                          )
                        )
                      }
                    />
                  </FormGroup>
                ))}
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
    </>
  );
};
