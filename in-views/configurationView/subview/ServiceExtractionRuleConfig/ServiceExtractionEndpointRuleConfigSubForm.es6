/* eslint-disable react/no-multi-comp */
import React from 'react';

import ServiceExtractionRuleConfigForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfigForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './ServiceExtractionEndpointRuleConfigSubForm.less';

const block = 'in-views-service-extraction-endpoint-form';

export default class extends React.Component {
  static displayName = 'ServiceExtractionEndpointRuleConfigSubForm';

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
          {rows.length > 0
            ? <Section>
                {rows.map((row, index) => <Row key={row.key} row={row} index={index} {...this.props} />)}
              </Section>
            : null}
        </SubViewWrapper>
      </div>
    );
  }

  removeRule = (e, key) => {
    e.preventDefault();
    this.props.removeEndpointRule(key);
  };
}

const Row = class extends React.Component {
  static displayName = 'ServiceExtractionRuleConfig';

  state = {
    isExpanded: false
  };

  render() {
    const { form } = this.props.row;
    const {
      index,
      onChangeIn,
      matchSpecificationOptionsTree,
      matchSpecificationOptions,
      helpTexts,
      row,
      addMatchSpecification,
      removeMatchSpecification,
      moveUp,
      moveDown
    } = this.props;

    return (
      <div>
        <div className={`${block}__endpoint-header`}>
          <div className={`${block}__flex-wrapper`}>
            <SvgIcon
              className={`${block}__expand-icon`}
              type={this.state.isExpanded ? 'timeline_close' : 'timeline_open'}
              width={12}
              color="#172429"
              onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
            />

            {form.hierarchyValid
              ? form.get('name').value
              : <span className={`${block}__invalid-row`}>
                  {form.get('name').value}
                </span>}
          </div>
          <div className={`${block}__flex-wrapper`}>
            <SvgIcon
              className={`${block}__order-up`}
              type="chevron_up"
              width={12}
              color="#172429"
              onClick={() => moveUp(index)}
            />
            <SvgIcon
              className={`${block}__order-down`}
              type="chevron_down"
              width={12}
              color="#172429"
              onClick={() => moveDown(index)}
            />
            <a href="#" onClick={e => row.removeRule(e, row.index)} className={`${block}__remove-endpoint`}>
              Remove endpoint
            </a>
          </div>
        </div>
        {this.state.isExpanded
          ? <ServiceExtractionRuleConfigForm
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
          : null}
      </div>
    );
  }
};
