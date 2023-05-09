/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { isNotBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ScriptsSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function ScriptsSection({ form, updateForm }: Props): JSX.Element {
  const configForm = form.get('configuration') as MapForm<any>;
  const scriptField = configForm.get('script') as Field<string>;
  //state variable to store file name
  const [script, setScript] = useState(isNotBlank(scriptField.value) ? 'fileName.js' : null);
  const columnDefinition = [
    {
      id: 'file_name',
      label: t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName'),
      sortable: false,
      getContent() {
        return (
          <HorizontalFlexWrapper className={locals.row}>
            <span>{script}</span>
            <SvgIcon type="lib_actions_delete" onClick={deleteScript} />
          </HorizontalFlexWrapper>
        );
      }
    }
  ];

  const scriptResult = {
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: isNotBlank(scriptField.value) ? [scriptField] : [],
      page: 0,
      pageSize: 1,
      totalHits: 0
    }
  };

  const rightHeader =
    script === null ? (
      <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={addScript}>
        {t('in-synthetics:dialog.createTest.advancedMode.configStep.addscriptAction')}
      </Button>
    ) : (
      <Button kind="action" icon="lib_actions_edit" onClick={editScript}>
        {t('in-synthetics:dialog.createTest.advancedMode.configStep.editscriptAction')}
      </Button>
    );

  function addScript() {
    // open add script dialog will be moved
    // updateForm will be moved to dialog section later
    updateForm(
      form.updateIn(['configuration', 'script'], (field: Item) =>
        (field as Field<string>).setValue('script content to be updated here').setTouched(true)
      )
    );
    setScript('filename.js');
  }

  function editScript() {
    // open edit script dialog
  }

  function deleteScript() {
    updateForm(
      form.updateIn(['configuration', 'script'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(true)
      )
    );
    setScript(null);
  }

  return (
    <ServerTablePresenter
      columnDefinitions={columnDefinition}
      result={scriptResult}
      rightHeader={rightHeader}
      leftHeader={
        <Label className={locals.leftHeader}>
          {t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptLabel')}
        </Label>
      }
      renderNoDataAvailable={() => (
        <NoDataAvailable
          type="lib_help_error_warning_outline"
          height={100}
          className={locals.boldText}
          text={t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptNotAdded')}
        />
      )}
      page={0}
      pageSize={1}
      orderBy={''}
      orderDirection={'ASC'}
      isSearchable={false}
    />
  );
}
