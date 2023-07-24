/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import CreatableTagSelect from 'in-service-levels/components/ConfigDialog/components/FormComponents/CreatableTagSelect';
import { SloForm, SloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import Sections from 'in-components/workspace/Sections/Sections';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import Section from 'in-components/workspace/Section';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './SloNameAndTagsSection.mless';

interface SloNameAndTagsSectionProps {
  hasError?: boolean;
  form: SloForm;
  onChange: (path: SloFormPath, updater: (i: Item) => Item) => void;
}

export default function SloNameAndTagsSection({ hasError, form, onChange }: SloNameAndTagsSectionProps) {
  const [availableTags, status] = useSloTags();
  const isLoading = status === 'pending';

  const nameField = form.getIn(['nameTags', 'name']);
  const tagField = form.getIn(['nameTags', 'tags']);

  return (
    <section>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.nameAndTagsTitle')}
      </Typography>
      <Stack gap="small">
        <Sections>
          <Section
            title={t('in-service-levels:createSloDialog.sloNameLabel')}
            titleHtmlFor="slo-name-input"
            hasError={hasError}
          >
            <Input
              id="slo-name-input"
              type="text"
              value={nameField.value}
              maxLength={256}
              placeholder={t('in-service-levels:createSloDialog.sloNamePlaceholder')}
              className={locals.nameInput}
              onChange={e =>
                onChange(['nameTags', 'name'], () => nameField.setValue(e.currentTarget.value).setTouched(true))
              }
            />
            {hasError &&
              nameField.messages.map(({ message }, index) => (
                <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
              ))}
          </Section>
          <Section title={t('in-service-levels:createSloDialog.tagsLabel')} titleHtmlFor="slo-tag-select">
            <CreatableTagSelect
              id="slo-tag-select"
              isLoading={isLoading}
              tags={availableTags}
              value={tagField.value}
              onChange={newTags => onChange(['nameTags', 'tags'], () => tagField.setValue(newTags).setTouched(true))}
            />
          </Section>
        </Sections>
      </Stack>
    </section>
  );
}
