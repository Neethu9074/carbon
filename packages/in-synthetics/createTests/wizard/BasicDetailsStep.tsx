/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Field, MapForm, Item } from 'formalistic';

import { GroupPermissionEntity, Result } from '@instana/types';

// eslint-disable-next-line no-restricted-imports
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { apiScriptTest, apiSimpleTest, browserScriptTest, browserSimpleTest } from 'in-synthetics/utils/constants';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SearchInput from 'in-components/SearchInput/SearchInput';
import Section from 'in-synthetics/createTests/wizard/Section';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/BasicDetailsStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  applications: Result<GroupPermissionEntity[]>;
}

export default function BasicDetailsStep({ form, updateForm, selectedBlueprint, applications }: Props) {
  const labelField = form.get('label') as Field<string>;
  const descriptionField = form.get('description') as Field<string>;
  const applicationsField = (form.get('applicationId') as Field<string>) || null;

  const [searchInput, setSearchInput] = useState('');

  const filterApplications = useCallback(
    (apps: Result<GroupPermissionEntity[]> | undefined) => {
      return apps?.data?.filter((app: GroupPermissionEntity | undefined) =>
        app?.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    },
    [searchInput]
  );

  const filteredApplications: GroupPermissionEntity[] | undefined = useMemo(
    () => filterApplications(applications),
    [applications, filterApplications]
  );

  function renderApplications() {
    if (applications.progress?.loading) {
      return <LoadingIndicator size="xl" />;
    }
    if (!applications.data?.filter(Boolean)?.length) {
      return <NoDataAvailable text={t('in-synthetics:dialog.createTest.noApplicationsFound')} />;
    }

    let header = (
      <SearchInput
        className={locals.rightHeader}
        maxWidth="140"
        query={searchInput}
        placeholder=""
        onChange={q => setSearchInput(q)}
      />
    );

    return (
      <ExpandableLightCard
        className={locals.container}
        title={t('in-synthetics:dialog.createTest.basicDetails.labelApplications')}
        bodyWithoutPadding
        openByDefault
        darkFrame
        framed
        header={header}
      >
        {filteredApplications?.length != 0 ? (
          filteredApplications?.filter(Boolean).map((app: Record<string, any>) => {
            return (
              <div key={app.id} className={locals.item}>
                <CheckboxFancy
                  asRadioButton
                  key={app.id}
                  label={app.name}
                  checked={applicationsField?.value === app.id}
                  onChange={() => {
                    let selectedApplication: string = applicationsField.value;
                    selectedApplication = selectedApplication === app.id ? null : app.id;
                    updateForm(
                      form.updateIn(['applicationId'], (field: Item) =>
                        (field as Field<string>).setValue(selectedApplication).setTouched(true)
                      )
                    );
                  }}
                />
              </div>
            );
          })
        ) : (
          <NoDataAvailable text={t('in-synthetics:dialog.createTest.noMatchingFound')} />
        )}
      </ExpandableLightCard>
    );
  }

  const renderHeadingText = (type: string) => {
    switch (type) {
      case apiSimpleTest:
        return t('in-synthetics:dialog.createTest.basicDetails.title');
      case apiScriptTest:
        return t('in-synthetics:dialog.createTest.basicDetails.scriptTitle');
      case browserSimpleTest:
        return t('in-synthetics:dialog.createTest.basicDetails.webpageActionTitle');
      case browserScriptTest:
        return t('in-synthetics:dialog.createTest.basicDetails.browserScriptTitle');
      default:
        return '';
    }
  };

  return (
    <Section headingText={renderHeadingText(selectedBlueprint?.type)}>
      {labelField.map(field => (
        <FormGroup className={locals.urlInput}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-synthetics:dialog.createTest.basicDetails.labelName')}
          </Label>
          <Input
            name="name"
            value={field.value}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              updateForm(
                form.updateIn(['label'], (labelField: Item) =>
                  (labelField as Field<string>).setValue(target.value).setTouched(true)
                )
              );
            }}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {descriptionField.map(field => (
        <FormGroup className={locals.urlInput}>
          <Label htmlFor="description" hasError={!field.valid && field.touched}>
            {t('in-synthetics:dialog.createTest.basicDetails.labelDescription')}
          </Label>
          <TextArea
            name="description"
            value={field.value}
            onChange={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
              updateForm(
                form.updateIn(['description'], (descriptionField: Item) =>
                  (descriptionField as Field<string>).setValue(target.value).setTouched(true)
                )
              );
            }}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {renderApplications()}
    </Section>
  );
}
