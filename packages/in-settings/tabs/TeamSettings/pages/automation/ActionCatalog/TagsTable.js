/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable.mless';

export default function TagsTable({ columnDefinitions, result, addRow, deleteRow, form }) {
  return (
    <div>
      <ServerTablePresenter
        columnDefinitions={columnDefinitions}
        getRowProps={getRowProps}
        result={result}
        isSearchable={false}
        rightHeader={<RightHeader addRow={addRow} />}
        noDataMessage={t('in-settings:tabs.noTagsConfigured')}
        deleteRow={deleteRow}
      />
      <Section>
        <TouchedMessages field={form} />
      </Section>
    </div>
  );
}

function RightHeader({ addRow }) {
  return (
    <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline">
      {t('in-settings:tabs.addRow')}
    </Button>
  );
}

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact'
  };
}
