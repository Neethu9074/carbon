import React from 'react';

import AddNewIntegrationDialog from 'in-views/configurationView/subview/AlertingConfiguration/components/AddNewIntegrationDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getIntegrations } from 'in-services/api/integrations';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { compare } from 'in-services/util/boolean';
import Step from 'in-components/form/Step';
import connectTo from 'in-hoc/connectTo';

import './Step3.less';

const block = 'in-alerting-config-form-step-3';

const cols = [
  {
    title: '',
    type: 'custom',
    width: 30,
    typeArgs: {
      comparator: compare,
      get(row) {
        return {
          value: row.checked,
          content: (
            <input
              type="checkbox"
              checked={row.checked}
              onChange={() => (row.checked ? row.exclude(row.key) : row.include(row.key))}
            />
          )
        };
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      comparator: compareIgnoreCase,
      getValue(row) {
        return row.name;
      }
    }
  }
];

export default function Step2({ form, onChange }) {
  return (
    <Step number={2} title="Integrations" form={form} onChange={onChange}>
      <div className={`${block}__create-link`} onClick={addNewItem}>
        new integration...
      </div>

      <IntegrationTable form={form} onChange={onChange} />
    </Step>
  );
}

const IntegrationTable = connectTo(
  {
    integrations: getIntegrations()
  },
  function IntegrationTable({ form, onChange, integrations }) {
    if (!integrations) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = integrations
      .toArray()
      .filter(value => value)
      .map(integration => ({
        key: integration.get('id'),
        name: integration.get('name'),
        checked: form.get('integrationIds').value.includes(integration.get('id')),
        include: id => select(id, form, onChange),
        exclude: id => remove(id, form, onChange)
      }));

    return <Table cols={cols} rows={rows} maxItemsPerPage={10} initialSortColumn={1} />;
  }
);

function addNewItem() {
  setActiveDialog(<AddNewIntegrationDialog />);
}

function select(id, form, onChange) {
  let ids = form.get('integrationIds').value;
  ids = ids.push(id);
  onChange('integrationIds', ids);
}

function remove(id, form, onChange) {
  let ids = form.get('integrationIds').value;
  ids = ids.delete(ids.indexOf(id));
  onChange('integrationIds', ids);
}
