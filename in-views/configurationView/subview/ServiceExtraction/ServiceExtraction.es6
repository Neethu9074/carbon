import { createLogger } from 'instalog';
import { List } from 'immutable';
import rpt from 'prop-types';
import React from 'react';

import {
  getLinkColumn,
  getEnableToggleColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import {
  upsertServiceRules,
  updateServiceRulesByType,
  getServiceRulesByType,
  deleteServiceRule,
  setEnabled
} from 'in-services/api/serviceExtraction';
import { openEditor } from 'in-views/configurationView/subview/ServiceExtraction/stores/editAsJson';
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
import { compare } from 'in-services/util/number';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './ServiceExtraction.less';

const block = 'in-service-extraction-form';
const logger = createLogger('ServiceExtraction');

const cols = [
  {
    title: 'Order',
    type: 'custom',
    width: 80,
    disableSorting: true,
    typeArgs: {
      comparator: compare,
      get(row) {
        const order = row.entity.get('order');
        return {
          value: order,
          content: (
            <div className={`${block}__order-icons`}>
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
        };
      }
    }
  },
  getEnableToggleColumn(),
  getDeleteButtonColumn()
];

export default class extends React.Component {
  constructor(props) {
    super(props);

    // because each table differs by the ruleType, we need to create the column once the component is mounting
    const linkColumn = getLinkColumn(getServiceRuleConfigLink, 'name', props.ruleType);
    linkColumn.disableSorting = true;
    const ruleTypeSpecificColumns = [linkColumn].concat(cols);
    this.cols = ruleTypeSpecificColumns;
  }

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

    const result$ = getServiceRulesByType(this.props.ruleType);
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
        serviceRules: this.state.serviceRules.filter(eachService => eachService.get('id') !== serviceId)
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
        serviceRules: newServices
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
          serviceRules: newServices
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
          <Button kind="info" onClick={this.addNewService} className={`${block}__button`}>
            Add Rule
          </Button>
          {__DEV__
            ? <Button
                kind="info"
                onClick={() => openEditor(this.state.serviceRules, this.saveJson, this.props.ruleType)}
                className={`${block}__button`}
              >
                Edit as JSON
              </Button>
            : null}

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
                cols={this.cols}
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
    const rules = sortServiceRules(this.state.serviceRules);
    for (let i = 1, size = rules.size; i < size; i++) {
      if (rules.getIn([i, 'id']) === ruleId) {
        return {
          indexA: i,
          indexB: i - 1,
          a: rule,
          b: rules.get(i - 1)
        };
      }
    }
  };

  getRuleAfter = rule => {
    const ruleId = rule.get('id');
    const rules = sortServiceRules(this.state.serviceRules);
    // console.log(ruleId, rules.toJS());
    for (let i = 0, size = rules.size - 1; i < size; i++) {
      if (rules.getIn([i, 'id']) === ruleId) {
        return {
          indexA: i,
          indexB: i + 1,
          a: rule,
          b: rules.get(i + 1)
        };
      }
    }
  };

  swap(matches) {
    if (!matches) {
      return;
    }

    const originalList = this.state.serviceRules;

    const rulesToUpdate = [
      matches.a.set('order', matches.b.get('order')).toJS(),
      matches.b.set('order', matches.a.get('order')).toJS()
    ];

    const newOptimisticList = getUpdatedRules(originalList, matches);

    // update swaped rules in the backend
    const result$ = upsertServiceRules(rulesToUpdate);

    // optimistic set new rules list
    this.setState({
      serviceRules: newOptimisticList
    });

    result$.errors().once(error => {
      const message = `Failed to set service rules ordering: ${error.message}`;
      logger.warn(message, error);

      // if something failed, restore the old list
      this.setState({
        serviceRules: originalList
      });
    });
  }

  saveJson = rules => {
    const result$ = updateServiceRulesByType(rules, this.props.ruleType);

    result$.once(this.refresServices);
    result$.errors().once(error => {
      const message = `Failed to set service rules ordering: ${error.message}`;
      logger.warn(message, error);
    });
  };
}

function getRowDetails(row) {
  const rule = row.entity;
  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title="comment">
          {rule.get('comment')}
        </DescriptionItem>
        <DescriptionItem title="match specification path">
          {rule.getIn(['matchSpecification', 'path'])}
        </DescriptionItem>
        <DescriptionItem title="match specification host">
          {rule.getIn(['matchSpecification', 'host'])}
        </DescriptionItem>
        <DescriptionItem title="extract specification label">
          {rule.getIn(['extractSpecification', 'label'])}
        </DescriptionItem>

        <DescriptionItem title="Endpoints">
          <ul className={`${block}__endpoint-list`}>
            {rule.get('endpointRules', emptyList).map(endpoint => (
              <li key={endpoint.get('id')} className={`${block}__endpoint-list-item`}>
                {endpoint.get('name')}
              </li>
            ))}
          </ul>
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

function sortServiceRules(rules) {
  return rules.sort((a, b) => a.get('order') - b.get('order'));
}

function getUpdatedRules(originalList, matches) {
  const updatedList = [];
  const aId = matches.a.get('id');
  const bId = matches.b.get('id');

  originalList.forEach(rule => {
    const ruleId = rule.get('id');
    if (ruleId === aId) {
      updatedList.push(matches.a.set('order', matches.b.get('order')));
    } else if (ruleId === bId) {
      updatedList.push(matches.b.set('order', matches.a.get('order')));
    } else {
      updatedList.push(rule);
    }
  });

  return List(updatedList);
}
