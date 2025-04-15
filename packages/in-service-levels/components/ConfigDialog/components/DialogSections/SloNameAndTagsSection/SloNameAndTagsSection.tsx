/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Input, ValidationBlock } from '@instana/components';

import SloDialogSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/Shared/SloDialogSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import CreatableTagSelect from 'in-components/CreatableTagSelect';
import Sections from 'in-components/workspace/Sections/Sections';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import { titleWidth } from 'in-service-levels/constants';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './SloNameAndTagsSection.mless';

export default function SloNameAndTagsSection() {
  const { form, onChange } = useContext(SloFormContext);
  const [availableTags, status] = useSloTags();
  const isLoading = status === 'pending';

  const tagField = form.getIn(['nameTags', 'tags']);
  const nameField = form.getIn(['nameTags', 'name']);

  const isNameValid = isFieldValid(nameField);

  return (
    <SloDialogSection title={t('in-service-levels:createSloDialog.nameAndTagsTitle')}>
      <Stack gap="small">
        <Sections>
          <Section
            title={t('in-service-levels:createSloDialog.sloNameLabel')}
            titleHtmlFor="slo-name-input"
            hasError={!isNameValid}
            titleWidth={titleWidth}
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
            {!isNameValid &&
              nameField.messages.map(({ message }, index) => (
                <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
              ))}
          </Section>
          <Section
            title={t('in-service-levels:createSloDialog.tagsLabel')}
            titleHtmlFor="slo-tag-select"
            titleWidth={titleWidth}
          >
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
    </SloDialogSection>
  );
}
