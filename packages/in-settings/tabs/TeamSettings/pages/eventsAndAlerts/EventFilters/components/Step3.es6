import React from 'react';

import AddNewAlertChannelDialog from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/AddNewAlertChannelDialog';
import AlertChannelDetails from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelDetails';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import RuleControl from 'in-components/form/RuleControl';
import Table from 'in-sdk/components/dashboard/Table';
import { getIntegrations } from 'in-api/integrations';
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
    <Step number={2} title="Alert Channels" form={form} onChange={onChange}>
      <AlertChannelTable form={form} onChange={onChange} />
    </Step>
  );
}

class AlertChannelTable extends React.Component {
  static displayName = 'AlertChannelTable';

  state = {
    alertChannels: null
  };

  subscription = null;

  componentWillMount() {
    this.update();
  }

  componentWillUnmount() {
    this.disposeSubscription();
  }

  update = alertChannel => {
    if (alertChannel) {
      select(alertChannel.get('id'), this.props.form, this.props.onChange);
    }
    this.disposeSubscription();
    this.subscription = getIntegrations().once(alertChannels => this.setState({ alertChannels }));
  };

  disposeSubscription = () => {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  };

  render() {
    const { form, onChange } = this.props;
    const { alertChannels } = this.state;

    if (!alertChannels) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = alertChannels
      .toArray()
      .filter(value => value)
      .map(alertChannel => ({
        key: alertChannel.get('id'),
        name: alertChannel.get('name'),
        entity: alertChannel,
        checked: form.get('integrationIds').value.includes(alertChannel.get('id')),
        include: id => select(id, form, onChange),
        exclude: id => remove(id, form, onChange)
      }));

    return (
      <RuleControl name="Send to" helpText="Select channels you want to be alerted on.">
        <div
          className={`${block}__create-link`}
          onClick={() => setActiveDialog(<AddNewAlertChannelDialog onClose={this.update} />)}
        >
          New alert channel...
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
  return <AlertChannelDetails alertChannel={row.entity} />;
}
