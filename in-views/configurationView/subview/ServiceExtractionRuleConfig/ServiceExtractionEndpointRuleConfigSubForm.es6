import React from 'react';

import ServiceExtractionRuleConfigForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfigForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Table from 'in-sdk/components/dashboard/Table';
import { compare } from 'in-services/util/number';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './ServiceExtractionEndpointRuleConfigSubForm.less';

const block = 'in-views-service-extraction-endpoint-form';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        const value = row.form.get('name').value;
        let content = value;

        if (!row.form.hierarchyValid) {
          content = (
            <span className={`${block}__invalid-row`}>
              {row.form.get('name').value}
            </span>
          );
        }
        return {
          value,
          content
        };
      }
    }
  },
  {
    title: 'Order',
    type: 'custom',
    width: 50,
    disableSorting: true,
    typeArgs: {
      comparator: compare,
      get(row) {
        const order = row.index;
        return {
          value: order,
          content: (
            <div className={`${block}__order-icons`}>
              <SvgIcon
                className={`${block}__order-up`}
                type="chevron_up"
                width={12}
                color="#172429"
                onClick={() => row.moveUp(row.index)}
              />
              <SvgIcon
                className={`${block}__order-down`}
                type="chevron_down"
                width={12}
                color="#172429"
                onClick={() => row.moveDown(row.index)}
              />
            </div>
          )
        };
      }
    }
  },
  {
    title: '',
    type: 'custom',
    width: 130,
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return {
          value: 0,
          content: (
            <a href="#" onClick={e => row.removeRule(e, row.index)} className={`${block}__remove-endpoint`}>
              Remove endpoint
            </a>
          )
        };
      }
    }
  }
];

export default class extends React.Component {
  static displayName = 'ServiceExtractionEndpointRuleConfigSubForm';

  state = {
    isTesting: false
  };

  render() {
    const { serviceRule, form, addEndpointRule, moveUp, moveDown } = this.props;
    if (!serviceRule) {
      return null;
    }

    const endpoints = form.get('endpointRules');
    const rows = endpoints.map((form, index) => {
      return {
        key: form.get('id').value,
        index,
        form,
        moveUp,
        moveDown,
        removeRule: this.removeRule
      };
    });

    return (
      <div className={`${block}__sub-section`}>
        <SubViewWrapper>
          <SubViewHeader>
            Endpoints
          </SubViewHeader>

          <Section>
            <Button kind="success" onClick={addEndpointRule}>
              Add Endpoint
            </Button>
          </Section>
          <Section>
            <Table
              cols={cols}
              rows={rows}
              getRowDetails={this.getRowDetails}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
          </Section>
        </SubViewWrapper>
      </div>
    );
  }

  removeRule = (e, key) => {
    e.preventDefault();
    this.props.removeEndpointRule(key);
  };

  getRowDetails = row => {
    const { form, index } = row;
    const {
      onChangeIn,
      matchSpecificationOptionsTree,
      matchSpecificationOptions,
      helpTexts,
      addMatchSpecification,
      removeMatchSpecification
    } = this.props;

    return (
      <ServiceExtractionRuleConfigForm
        prePath={['endpointRules', index]}
        ruleForm={form}
        helpTexts={helpTexts}
        resultingEntityNameTitle="Endpoint Name"
        resultingEntityTooltipText={helpTexts.serviceEndpointNameHelp}
        matchSpecificationOptionsTree={matchSpecificationOptionsTree}
        matchSpecificationOptions={matchSpecificationOptions}
        onChangeIn={onChangeIn}
        addMatchSpecification={addMatchSpecification}
        removeMatchSpecification={removeMatchSpecification}
      />
    );
  };
}
