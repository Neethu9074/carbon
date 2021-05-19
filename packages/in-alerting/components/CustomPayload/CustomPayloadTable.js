/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-settings/components/Section';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/CustomPayload/CustomPayloadTable.mless';

const maximumNumberOfRows = 20;

export default function CustomPayloadTable({
  columnDefinitions,
  result,
  getRowIndex,
  addRow,
  deleteRow,
  updateIn,
  customPayloadForm,
  canConfigureAlertPayload = true,
  enabled = true,
  trackChange = () => {}
}) {
  return (
    <div>
      <ServerTablePresenter
        columnDefinitions={columnDefinitions}
        getRowProps={getRowProps}
        result={result}
        isSearchable={false}
        rightHeader={
          <RightHeader
            canConfigureAlertPayload={canConfigureAlertPayload}
            formSize={customPayloadForm.size}
            addRow={addRow}
            enabled={enabled}
          />
        }
        noDataMessage={t('in-alerting:components.customPayload.noCustomPayloadConfigured')}
        getRowIndex={getRowIndex}
        deleteRow={deleteRow}
        updateIn={updateIn}
        enabled={enabled}
        trackChange={trackChange}
      />
      <Section>
        <TouchedMessages field={customPayloadForm} />
      </Section>
    </div>
  );
}

function RightHeader({ canConfigureAlertPayload, formSize, addRow, enabled }) {
  return canConfigureAlertPayload ? (
    formSize >= maximumNumberOfRows ? (
      <Tooltip
        content={t('in-alerting:components.customPayload.theNumberOfRowsIsRestrictedToMaximumNumberOfRows', {
          maximumNumberOfRows: maximumNumberOfRows
        })}
        align="bottomMiddle"
      >
        <Button kind="action" icon="lib_openclose_add_circle_outline" disabled>
          {t('in-alerting:components.customPayload.addRow')}
        </Button>
      </Tooltip>
    ) : (
      <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline" disabled={!enabled}>
        {t('in-alerting:components.customPayload.addRow')}
      </Button>
    )
  ) : (
    <span />
  );
}

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact'
  };
}
