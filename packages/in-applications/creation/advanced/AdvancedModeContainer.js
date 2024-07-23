/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Stack, Spacer, Pill, Button } from '@instana/components';

import BuiltInGlobalSmartAlertsPermissionWrapper from 'in-alerting/smart-alerts/applications/apCreation/BuiltInGlobalSmartAlertsPermissionWrapper';
import ContributionFilterDropdown, {
  showContributionFilterDropdown
} from 'in-applications/creation/components/ContributionFilterDropdown';
import DialogBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/DialogBuiltInSmartAlertsSelectionList';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import { findByRestrictingApplicationId } from 'in-applications/creation/contributionFilters';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { hasError, isLoading } from 'in-services/util/result';
import { getColor } from 'in-applications/endpointTypes';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({ form, updateForm, errorMessage, userRestrictedApplicationsResult }) {
  const labelField = form.get('label');
  const restrictingApplicationIdField = form.get('restrictingApplicationId');
  const tagFilterExpressionField = form.get('tagFilterExpression');

  if (isLoading(userRestrictedApplicationsResult) || hasError(userRestrictedApplicationsResult)) {
    // keep showing a loading indicator even on error, until we a proper design for error handling
    return (
      <div className={locals.loadingIndicator}>
        <LoadingIndicator />
      </div>
    );
  }

  const userRestrictedApplications = userRestrictedApplicationsResult.data;
  const selectedUserGroupRestrictions = findByRestrictingApplicationId(
    userRestrictedApplications,
    restrictingApplicationIdField.value
  );
  const contributionFilter = selectedUserGroupRestrictions?.filter?.tagFilterExpression;

  return (
    <>
      <div className={locals.container}>
        <Stack>
          <Section headingText={t('in-applications:creation.advanced.defineName')}>
            <FormGroup>
              <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
                {t('in-applications:creation.advanced.apName')}
              </Label>
              <Input
                type="text"
                id="label"
                value={labelField.value}
                onChange={e =>
                  updateForm(form.updateIn(['label'], field => field.setValue(e.target.value || '').setTouched(true)))
                }
                autoComplete="off"
                hasError={(!labelField.valid || errorMessage) && labelField.touched}
                autoFocus
              />
              <TouchedMessages field={labelField} />
              {errorMessage && (
                <Message className={locals.errorMessage} type="error" withIcon small fullInlineWidth>
                  {errorMessage}
                </Message>
              )}

              <DescriptionText className={locals.descriptionText}>
                {t('in-applications:creation.advanced.apNameDescription')}
              </DescriptionText>
            </FormGroup>
          </Section>

          <Section headingText={t('in-applications:creation.advanced.defineUsingTags')}>
            <DescriptionText className={locals.descriptionText}>
              {showContributionFilterDropdown(userRestrictedApplications) ? (
                <Trans i18nKey="in-applications:creation.advanced.defineUsingTagsContributionFilterDescription" />
              ) : (
                <Trans
                  i18nKey="in-applications:creation.advanced.defineUsingTagsDescription"
                  components={{
                    'pill-database': (
                      <Pill color={getColor('DATABASE')} kind="light">
                        {t('in-applications:creation.advanced.database')}
                      </Pill>
                    ),
                    'pill-messaging': (
                      <Pill color={getColor('MESSAGING')} kind="light">
                        {t('in-applications:creation.advanced.messaging')}
                      </Pill>
                    )
                  }}
                />
              )}
              <Spacer vertical="normal" />
              <strong>{t('in-applications:creation.advanced.andOperatorsPrecedenceBrackets')}</strong>
            </DescriptionText>

            {showContributionFilterDropdown(userRestrictedApplications) && (
              <div className={locals.contributionFilter}>
                <ContributionFilterDropdown
                  form={form}
                  updateForm={updateForm}
                  userRestrictedApplications={userRestrictedApplications}
                  className={locals.listItem}
                />
              </div>
            )}

            <div className={locals.queryBuilder}>
              <div className={locals.queryBuilderExpression}>
                <CreateApplicationQueryBuilder
                  value={tagFilterExpressionField.value}
                  getSuggestionsProps={{ contributionFilter }}
                  onChange={tagFilterExpression => setTagFilterExpression(tagFilterExpression, form, updateForm)}
                />
              </div>

              <HorizontalFlexWrapper>
                {tagFilterExpressionField.value.length > 0 && (
                  <Button
                    kind="subtle"
                    icon="lib_openclose_cancel"
                    size="compact"
                    onClick={() => setTagFilterExpression([], form, updateForm)}
                  >
                    {t('in-applications:creation.advanced.clear')}
                  </Button>
                )}
              </HorizontalFlexWrapper>
            </div>
          </Section>

          <Section headingText={t('in-applications:creation.advanced.downstreamCalls')}>
            <DescriptionText className={locals.descriptionText}>
              {t('in-applications:creation.advanced.downstreamCallsDescription')}
            </DescriptionText>
            <ApplicationScopeSelector
              form={form}
              updateForm={updateForm}
              maxScope={selectedUserGroupRestrictions?.filter?.scope}
            />
          </Section>

          <Section headingText={t('in-applications:creation.advanced.defaultDashboardView')}>
            <InboundAllCalls form={form} updateForm={updateForm} apCreation />
          </Section>

          <BuiltInGlobalSmartAlertsPermissionWrapper>
            <Section headingText={t('in-applications:creation.advanced.builtInSmartAlertsScope')}>
              <DescriptionText className={locals.descriptionText}>
                {t('in-applications:creation.advanced.builtInSmartAlertsScopeDescription')}
              </DescriptionText>
              <DialogBuiltInSmartAlertsSelectionList
                onChange={alertIds => {
                  updateForm(form.updateIn(['builtInAlertIds'], field => field.setValue(alertIds).setTouched(true)));
                }}
                alertIds={form.get('builtInAlertIds').value}
              />
            </Section>
          </BuiltInGlobalSmartAlertsPermissionWrapper>
        </Stack>
      </div>
      <Spacer vertical="normal" />
    </>
  );
}

function Section({ children, headingText }) {
  return (
    <section>
      <h2 className={locals.heading}>{headingText}</h2>
      {children}
    </section>
  );
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
