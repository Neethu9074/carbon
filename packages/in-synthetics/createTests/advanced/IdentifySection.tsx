/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { useState } from 'react';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import SearchInput from 'in-components/SearchInput/SearchInput';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import TextArea from 'in-components/form/TextArea/TextArea';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/IdentifySection.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  applications: Result<GroupPermissionEntity[]>;
}

export default function IdentifySection({ form, updateForm, applications }: Props) {
  const labelField = form.get('label') as Field<string>;
  const descriptionField = form.get('description') as Field<string>;
  const applicationsField = (form.get('applicationId') as Field<string>) || null;

  const [searchInput, setSearchInput] = useState('');

  const filteredApplications: GroupPermissionEntity[] | undefined = applications.data?.filter(
    (app: GroupPermissionEntity | undefined) => app?.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const [visibleItems, setVisibleItems] = useState(10);

  const handleLoadMore = (event: React.MouseEvent) => {
    event.preventDefault();
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
  };

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
        className={locals.baseContainer}
        title={t('in-synthetics:dialog.createTest.basicDetails.labelApplications')}
        bodyWithoutPadding
        openByDefault
        darkFrame
        framed
        header={header}
      >
        {filteredApplications?.length != 0 ? (
          <div>
            {filteredApplications
              ?.filter(Boolean)
              .slice(0, visibleItems)
              .map((app: Record<string, any>) => {
                return (
                  <div key={app.id} className={locals.item}>
                    <CheckboxFancy
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
              })}
            <div className={locals.center}>
              {visibleItems < (filteredApplications?.length ?? 0) && (
                <button className={locals.button} onClick={handleLoadMore}>
                  {t('in-synthetics:dialog.createTest.advancedMode.loadMore')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <NoDataAvailable text={t('in-synthetics:dialog.createTest.noMatchingFound')} />
        )}
      </ExpandableLightCard>
    );
  }

  return (
    <div>
      <div className={locals.outerBox}>
        <div>
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
                    form.updateIn(['label'], (field: Item) =>
                      (field as Field<string>).setValue(target.value).setTouched(true)
                    )
                  );
                }}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </div>
      </div>
      <div className={locals.outerBox}>
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
                  form.updateIn(['description'], (field: Item) =>
                    (field as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </div>
      <div className={locals.baseContainer}>{renderApplications()}</div>
    </div>
  );
}
