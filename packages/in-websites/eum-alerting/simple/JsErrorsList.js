import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import HelpText from 'in-components/form/HelpText/HelpText';
import { operators } from 'in-analyze/applicationFilter';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';

import locals from './JsErrorsList.mless';

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: 'Error Message',
    getContent: error => ErrorRow(error)
  }
];

export default function JsErrorsList({ form, timeConfig, onChange, slideOut }) {
  return (
    <>
      <List
        isSearchable={false}
        getHeader={() => ''}
        getEntityName={config => config.name}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilters: [
              ...form.get(fieldNames.tagFilters).value,
              {
                name: 'beacon.website.id',
                operator: 'EQUALS',
                stringValue: form.get(fieldNames.websiteId).value
              }
            ],
            timeConfig
          })
            .filter(tableData => tableData.data)
            .map(tableData => tableData.data.items.map(item => item.error))
        }
        pageSize={15}
        noDataMessage="No alert configured."
        onRowClick={error => {
          const updatedForm = form.updateIn([fieldNames.operator], field => field.setValue(operators.EQUALS));
          onChange(updatedForm, fieldNames.value, error.message);
          slideOut();
        }}
      />
      <HelpText>Click on a row to select a JS Error</HelpText>
    </>
  );
}

JsErrorsList.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getTableData({
  page = 1,
  pageSize = 20,
  orderBy = 'errorsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  return getWebsiteErrors({
    tagFilters,
    timeConfig,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      errorsAgg: {
        metric: 'errors',
        aggregation: 'SUM'
      }
    }
  });
}

function ErrorRow(error) {
  return (
    <Tooltip content={error.message} align="topLeft">
      <div className={locals.row}>{error.message}</div>;
    </Tooltip>
  );
}
