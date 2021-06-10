/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import FormFooter, { SaveButton, CancelButton } from 'in-components/form/FormFooter/FormFooter';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import Spacer from 'in-applications/Forms/components/Spacer';
import { getColor } from 'in-applications/endpointTypes';
import { error } from 'in-new-components/Message/types';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Pill from 'in-new-components/Pill';
import { t, Trans } from 'in-i18n';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({
  form,
  updateForm,
  onClose,
  onCreate,
  isSaving,
  isValidTagFilterExpression,
  errorMessage
}) {
  const labelField = form.get('label');

  const tagFilterExpressionField = form.get('tagFilterExpression');

  return (
    <>
      <div className={locals.container}>
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.defineName')}</h1>
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
            <Message className={locals.errorMessage} type={error} withIcon small>
              {errorMessage}
            </Message>
          )}

          <DescriptionText className={locals.descriptionText}>
            {t('in-applications:creation.advanced.apNameDescription')}
          </DescriptionText>
        </FormGroup>
        <Spacer type="dark" />

        <>
          <h1 className={locals.heading}>{t('in-applications:creation.advanced.defineUsingTags')}</h1>
          <DescriptionText className={locals.descriptionText}>
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
            <br />
            <br />
            <strong>{t('in-applications:creation.advanced.andOperatorsPrecedenceBrackets')}</strong>
          </DescriptionText>

          <div className={locals.queryBuilder}>
            <div className={locals.queryBuilderExpression}>
              <CreateApplicationQueryBuilder
                value={tagFilterExpressionField.value}
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
        </>
        <Spacer type="dark" />
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.downstreamCalls')}</h1>
        <DescriptionText className={locals.descriptionText}>
          {t('in-applications:creation.advanced.downstreamCallsDescription')}
        </DescriptionText>
        <ApplicationScopeSelector form={form} updateForm={updateForm} />
        <Spacer type="dark" />
        <h1 className={locals.heading}>{t('in-applications:creation.advanced.defaultDashboardView')}</h1>
        <InboundAllCalls form={form} updateForm={updateForm} apCreation />
      </div>
      <FormFooter className={locals.controls}>
        <CancelButton onClick={() => onClose()} />
        <SaveButton
          onClick={() => onCreate()}
          isSaving={isSaving}
          form={form}
          disabled={!form.hierarchyValid || !isValidTagFilterExpression}
        >
          {t('in-applications:creation.advanced.create')}
        </SaveButton>
      </FormFooter>
    </>
  );
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
