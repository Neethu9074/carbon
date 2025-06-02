/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Checkbox, IconButton, Link, Spacer, TextArea } from '@instana/components';
import { Action } from '@instana/types';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useNavigateToPolicyDetails from 'in-automation/navigation/hooks/useNavigateToPolicyDetails';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { usePolicyFormContext } from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import usePolicyDetailsUrlParams from 'in-automation/Policies/usePolicyDetailsUrlParams';
import useNavigateToPolicies from 'in-automation/navigation/hooks/useNavigateToPolicies';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { ApplyOn } from 'in-automation/Policies/usePolicyForm/types';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import SectionHeading from 'in-settings/components/SectionHeading';
import SelectTrigger from 'in-automation/Policies/SelectTrigger';
import ScrollStep from 'in-components/StepsContainer/ScrollStep';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import SelectAction from 'in-automation/Policies/SelectAction';
import usePolicyTags from 'in-automation/hooks/usePolicyTags';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { Triggers, isPolicy } from 'in-automation/types';
import FormGroup from 'in-components/form/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { isLoading } from 'in-services/util/result';
import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import { FetchStatus } from 'in-hooks/utils/types';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './Policy.mless';

function CopyPolicyLink({ policy }: { policy: PolicyFormEntity }) {
  const { isNew } = usePolicyDetailsUrlParams({ copy: false });
  const navigateToPolicyDetails = useNavigateToPolicyDetails();

  if (isNew || !isPolicy(policy)) return null;

  return (
    <Tooltip content={t('in-automation:duplicate')} delay={500}>
      <Link ellipsis onClick={() => navigateToPolicyDetails(policy.id, true)}>
        <IconButton id={`copy_${policy.id}`} buttonType="button" kind="primaryv2" type="lib_actions_copy" />
      </Link>
    </Tooltip>
  );
}

export function PolicyFormHeader({ policy }: { policy: PolicyFormEntity }) {
  const { isNew } = usePolicyDetailsUrlParams({ copy: false });

  return (
    <HorizontalFlexWrapper className={locals.spaceBetween}>
      <SubViewHeader>
        {isNew
          ? t('in-automation:policies.createANewPolicy')
          : t('in-automation:policies.configurePolicyEntityName', { entityName: policy.name })}
      </SubViewHeader>
      <HorizontalFlexWrapper>
        {isPolicy(policy) && role?.canConfigureAutomationPolicies && <CopyPolicyLink policy={policy} />}
      </HorizontalFlexWrapper>
    </HorizontalFlexWrapper>
  );
}

export function PolicyFormBody({
  actions,
  triggers,
  inEventPage = false
}: {
  actions: Action[];
  triggers: Triggers;
  inEventPage?: boolean;
}) {
  return (
    <LeftRightPadding>
      <Row>
        <Col lg={8}>
          <ScrollStep id="1-action-details">
            <SectionHeading>{t('in-automation:policies.1PolicyDetails')}</SectionHeading>
            <DetailsSection />
          </ScrollStep>
          <ScrollStep id="2-trigger-configuration">
            <SectionHeading>{t('in-automation:policies.2TriggerConfiguration')}</SectionHeading>
            <SelectTrigger triggers={triggers} inEventPage={inEventPage} />
            <TypeSection />
            <ScopeSection />
          </ScrollStep>
          <ScrollStep id="3-action-configuration">
            <SectionHeading>{t('in-automation:policies.3ActionConfiguration')}</SectionHeading>
            <SelectAction actions={actions} />
          </ScrollStep>
        </Col>
      </Row>
    </LeftRightPadding>
  );
}

export function PolicyFormFooter({ submitStatus }: { submitStatus: FetchStatus | undefined }) {
  const { isNew } = usePolicyDetailsUrlParams({ copy: false });
  const { form } = usePolicyFormContext();
  const navigateToPolicies = useNavigateToPolicies();
  return (
    <>
      <Spacer vertical="xlarge" />
      <FormFooter>
        <CancelButton onClick={() => navigateToPolicies()} />
        {role?.canConfigureAutomationPolicies && (
          <SaveButton form={form} isSaving={submitStatus === 'pending'}>
            {submitStatus === 'pending'
              ? t('forms.states.saving')
              : isNew
              ? t('forms.actions.create')
              : t('forms.actions.save')}
          </SaveButton>
        )}
      </FormFooter>
    </>
  );
}

function DetailsSection() {
  const { form, setForm } = usePolicyFormContext();
  const availableTags = usePolicyTags();

  const name = form.get('name');
  const description = form.get('description');
  const tags = form.get('tags');

  return (
    <>
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="policy-name" hasError={!field.valid && field.touched}>
            {t('in-automation:name')}
          </Label>
          <Input
            id="policy-name"
            type="text"
            value={field.value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
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
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form.updateIn(['description'], item =>
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
      {tags.map(field => (
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
              setForm(form => form.updateIn(['tags'], item => item.setValue(newTags).setTouched(true)))
            }
            disabled={!role?.canConfigureAutomationActions}
          />
        </FormGroup>
      ))}
    </>
  );
}

function ScopeSection() {
  const { form, setForm } = usePolicyFormContext();

  const scope = form.get('scope');
  const applyOn = scope.get('applyOn');
  const query = scope.get('query');
  const automatic = form.getIn(['action', 'type', 'automatic']);

  if (!automatic.value) return null;

  return (
    <Row>
      <Col lg={6}>
        <FormGroup>
          {applyOn.map(field => (
            <>
              <Label htmlFor="policy-applyOn" hasError={!field.valid && field.touched}>
                {t('in-automation:policies.applyOn')}
              </Label>
              <ComboBox
                id="policy-applyOn"
                value={field.value}
                isClearable={false}
                disabled={!role?.canConfigureAutomationPolicies}
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['scope', 'applyOn'], item =>
                      item.setValue((e as Option).value as ApplyOn).setTouched(true)
                    )
                  )
                }
                options={[
                  { value: SCOPE.ALL, label: t('in-automation:policies.allAvailableEntities') },
                  { value: SCOPE.DFQ, label: t('in-automation:policies.selectedEntitiesOnly') }
                ]}
              />
            </>
          ))}
        </FormGroup>
      </Col>
      <Col lg={6}>
        {applyOn.value === SCOPE.DFQ &&
          query.map(field => (
            <FormGroup>
              <Label hasError={!scope.valid && field.touched}>{t('in-automation:policies.dynamicFocusQuery')}</Label>
              <DfqSearchBar
                theme="light"
                disabled={!role?.canConfigureAutomationPolicies}
                onQueryValueChange={value => {
                  setForm(form => form.updateIn(['scope', 'query'], item => item.setValue(value).setTouched(true)));
                }}
                queryValue={field.value}
                manageFiltersDisabled
              />
              <DescriptionText>
                <Trans
                  i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesForWhichEntitiesTheRuleWillBeApplied"
                  components={{
                    // @ts-expect-error
                    docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
                  }}
                />
              </DescriptionText>
            </FormGroup>
          ))}
      </Col>
    </Row>
  );
}

function TypeSection() {
  const { form, setForm } = usePolicyFormContext();

  const type = form.getIn(['action', 'type']);

  return (
    <FormGroup>
      <Label hasError={!type.valid && type.touched}>{t('in-automation:policies.policyType')}</Label>
      <Row>
        <Col lg={3} className={locals.column}>
          <Checkbox
            label={t('in-automation:policies.manual')}
            checked={type.get('manual').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'manual'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
        </Col>
        <Col lg={3} className={locals.column}>
          <Checkbox
            label={t('in-automation:policies.automatic')}
            checked={type.get('automatic').value}
            disabled={!role?.canConfigureAutomationPolicies}
            onChange={e =>
              setForm(form =>
                form
                  .updateIn(['action', 'type', 'automatic'], item => item.setValue(e.target.checked))
                  .updateIn(['action', 'type'], item => item.setTouched(true))
              )
            }
          />
        </Col>
      </Row>
      <TouchedMessages field={type} className={locals.subErrorTextFormField} />
    </FormGroup>
  );
}
