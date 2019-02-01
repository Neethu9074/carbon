import React from 'react';

import AddNewIntegrationDialog from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/components/AddNewIntegrationDialog';
import IntegrationsDetails from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/components/IntegrationsDetails';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getIntegrations } from 'in-api/integrations';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import RuleControl from 'in-components/form/RuleControl';
import Table from 'in-sdk/components/dashboard/Table';
import { compare } from 'in-services/util/boolean';
import Step from 'in-components/form/Step';

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
      <IntegrationTable form={form} onChange={onChange} />
    </Step>
  );
}

class IntegrationTable extends React.Component {
  static displayName = 'IntegrationTable';

  state = {
    integrations: null
  };

  subscription = null;

  componentWillMount() {
    this.update();
  }

  componentWillUnmount() {
    this.disposeSubscription();
  }

  update = integration => {
    if (integration) {
      select(integration.get('id'), this.props.form, this.props.onChange);
    }
    this.disposeSubscription();
    this.subscription = getIntegrations().once(integrations => this.setState({ integrations }));
  };

  disposeSubscription = () => {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  };

  render() {
    const { form, onChange } = this.props;
    const { integrations } = this.state;

    if (!integrations) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = integrations
      .toArray()
      .filter(value => value)
      .map(integration => ({
        key: integration.get('id'),
        name: integration.get('name'),
        entity: integration,
        checked: form.get('integrationIds').value.includes(integration.get('id')),
        include: id => select(id, form, onChange),
        exclude: id => remove(id, form, onChange)
      }));

    return (
      <RuleControl name="Send to" helpText="Select integrations you want to be alerted on.">
        <div
          className={`${block}__create-link`}
          onClick={() => setActiveDialog(<AddNewIntegrationDialog onClose={this.update} />)}
        >
          New integration...
        </div>
        <Table cols={cols} rows={rows} maxItemsPerPage={10} initialSortColumn={1} getRowDetails={getRowDetails} />
      </RuleControl>
    );
  }
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

function getRowDetails(row) {
  return <IntegrationsDetails integration={row.entity} />;
}
