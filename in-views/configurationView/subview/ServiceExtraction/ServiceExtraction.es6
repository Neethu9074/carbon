import { createLogger } from 'instalog';
import rpt from 'prop-types';
import React from 'react';

import {
  getLinkColumn,
  getEnableToggleColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import { updateServiceRules, getServiceRules, deleteServiceRule, setEnabled } from 'in-services/api/serviceExtraction';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import { openServiceExtractionConfig } from 'in-stores/navigation/configuration';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { getServiceRuleConfigLink } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import { compare } from 'in-services/util/number';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './ServiceExtraction.less';

const block = 'in-service-extraction-form';
const logger = createLogger('ServiceExtraction');

const linkColumn = getLinkColumn(getServiceRuleConfigLink);
linkColumn.disableSorting = true;
const cols = [
  linkColumn,
  {
    title: 'Order',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: compare,
      get(row) {
        return always({
          value: row.entity.get('order'),
          content: (
            <div className={`${block}__order-icons`}>
              {row.entity.get('order')}
              <SvgIcon
                className={`${block}__order-up`}
                type="chevron_up"
                width={12}
                color="#172429"
                onClick={() => row.moveUp(row.entity)}
              />
              <SvgIcon
                className={`${block}__order-down`}
                type="chevron_down"
                width={12}
                color="#172429"
                onClick={() => row.moveDown(row.entity)}
              />
            </div>
          )
        });
      }
    }
  },
  getEnableToggleColumn(),
  getDeleteButtonColumn()
];

export default class extends React.Component {
  static displayName = 'ServiceExtraction';

  static propTypes = {
    helpTexts: rpt.object.isRequired,
    ruleType: rpt.string.isRequired,
    title: rpt.string.isRequired
  };

  state = {
    loading: true,
    error: false,
    message: null,
    serviceRules: emptyList,
    status: {}
  };

  componentWillMount() {
    this.refresServices();
  }

  refresServices = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading service rules…'
    });

    const result$ = getServiceRules(this.props.ruleType);
    this.responseSubscription = result$.once(serviceRules => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        serviceRules
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve service rules: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  addNewService = () => {
    this.disposeAsyncAction();

    // just open the rule dialog without an id will create a new one in the dialog
    openServiceExtractionConfig(null, this.props.ruleType);
  };

  onDelete = service => {
    const serviceId = service.get('id');
    this.setState({
      error: false,
      loading: true,
      message: `Removing service ${serviceId}`
    });

    const result$ = deleteServiceRule(serviceId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        serviceRules: sortServiceRules(
          this.state.serviceRules.filter(eachService => eachService.get('id') !== serviceId)
        )
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove service ${serviceId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  setEnabled = (service, enabled) => {
    const previousEnabled = service.get('enabled');
    const serviceId = service.get('id');

    this.setState(state => {
      state.status[serviceId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving service…'
      };

      const index = state.serviceRules.findIndex(eachService => serviceId === eachService.get('id'));
      const newServices = state.serviceRules.update(index, modifiableServices =>
        modifiableServices.set('enabled', enabled)
      );
      return {
        status: state.status,
        serviceRules: sortServiceRules(newServices)
      };
    });

    const result$ = setEnabled(service, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[serviceId] = {
          state: 'success',
          time: Date.now(),
          message: 'Service change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set service rules enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[serviceId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.serviceRules.findIndex(eachService => serviceId === eachService.get('id'));
        const newServices = state.serviceRules.update(index, modifiableServices =>
          modifiableServices.set('enabled', previousEnabled)
        );
        return {
          status: state.status,
          serviceRules: sortServiceRules(newServices)
        };
      });
    });
  };

  render() {
    const { serviceRules } = this.state;
    const servicesAvailable = serviceRules && serviceRules.size > 0;

    const rows = serviceRules.toArray().map(serviceRule => {
      return {
        key: serviceRule.get('id'),
        entity: serviceRule,
        onDelete: this.onDelete,
        setEnabled: this.setEnabled,
        status: this.state.status[serviceRule.get('id')],
        moveUp: this.moveUp,
        moveDown: this.moveDown
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {this.props.title}
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewService}>
            Add Rule
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}

          <p>
            {this.props.helpTexts.viewHelp}
          </p>
        </Section>

        {servicesAvailable
          ? <Section>
              <SectionHeading>
                Service Rules
              </SectionHeading>
              <Table
                cols={cols}
                rows={rows}
                getRowDetails={getRowDetails}
                initialSortColumn={1}
                initialSortDirection="asc"
              />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }

  moveUp = rule => {
    this.swap(this.getRuleBefore(rule));
  };

  moveDown = rule => {
    this.swap(this.getRuleAfter(rule));
  };

  getRuleBefore = rule => {
    const ruleId = rule.get('id');
    for (let i = 1, size = this.state.serviceRules.size; i < size; i++) {
      if (this.state.serviceRules.getIn([i, 'id']) === ruleId) {
        return {
          indexA: i,
          indexB: i - 1,
          a: rule,
          b: this.state.serviceRules.get(i - 1)
        };
      }
    }
  };

  getRuleAfter = rule => {
    const ruleId = rule.get('id');
    for (let i = 0, size = this.state.serviceRules.size - 1; i < size; i++) {
      if (this.state.serviceRules.getIn([i, 'id']) === ruleId) {
        return {
          indexA: i,
          indexB: i + 1,
          a: rule,
          b: this.state.serviceRules.get(i + 1)
        };
      }
    }
  };

  swap(matches) {
    if (!matches) {
      return;
    }

    const originalList = this.state.serviceRules;
    let rules = this.state.serviceRules;
    rules = rules.setIn([matches.indexB, 'order'], matches.a.get('order'));
    rules = rules.setIn([matches.indexA, 'order'], matches.b.get('order'));

    const result$ = updateServiceRules([
      originalList.get(matches.indexB).set('order', matches.a.get('order')).toJS(),
      originalList.get(matches.indexA).set('order', matches.b.get('order')).toJS()
    ]);

    // optimistic set new rules list
    this.setState({
      serviceRules: sortServiceRules(rules)
    });
    result$.errors().once(error => {
      const message = `Failed to set service rules ordering: ${error.message}`;
      logger.warn(message, error);

      // if something failed, restore the old list
      this.setState({
        serviceRules: sortServiceRules(originalList)
      });
    });
  }
}

function getRowDetails(row) {
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title="comment">
          {row.entity.get('comment')}
        </DescriptionItem>
        <DescriptionItem title="match specification path">
          {row.entity.getIn(['matchSpecification', 'path'])}
        </DescriptionItem>
        <DescriptionItem title="match specification host">
          {row.entity.getIn(['matchSpecification', 'host'])}
        </DescriptionItem>
        <DescriptionItem title="extract specification label">
          {row.entity.getIn(['extractSpecification', 'label'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

function sortServiceRules(rules) {
  return rules.sort((a, b) => a.get('order') - b.get('order'));
}
