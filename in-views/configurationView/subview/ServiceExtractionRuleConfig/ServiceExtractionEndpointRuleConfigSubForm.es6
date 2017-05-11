import React from 'react';

import ServiceExtractionRuleConfigForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfigForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';

import './ServiceExtractionEndpointRuleConfigSubForm.less';

const block = 'in-views-service-extraction-endpoint-form';

export default class extends React.Component {
  static displayName = 'ServiceExtractionEndpointRuleConfigSubForm';

  state = {
    isTesting: false
  };

  render() {
    const {
      serviceRule,
      form,
      onChangeIn,
      matchSpecificationOptionsTree,
      matchSpecificationOptions,
      helpTexts,
      addEndpointRule,
      addMatchSpecification,
      removeMatchSpecification
    } = this.props;
    if (!serviceRule) {
      return null;
    }

    const serviceRuleId = serviceRule.get('id');
    const endpoints = form.get('endpointRules').reduce((acc, cur, key) => acc.concat(key), []).sort();

    return (
      <div className={`${block}__sub-section`}>
        <SubViewWrapper>
          <SubViewHeader>
            Endpoints
          </SubViewHeader>

          <Section>
            <Button kind="success" onClick={addEndpointRule}>
              Add
            </Button>
          </Section>
          {endpoints.map(key => {
            const endpointRuleForm = form.get('endpointRules').get(key);
            const endpointHtmlId = `${serviceRuleId}-${key}`;
            return (
              <Section key={key}>
                <FormGroup>
                  <Label htmlFor={endpointHtmlId}>
                    <a href="#" onClick={e => this.removeRule(e, key)} className={`${block}__remove-endpoint`}>
                      Remove
                    </a>
                  </Label>
                </FormGroup>

                <ServiceExtractionRuleConfigForm
                  prePath={['endpointRules', key]}
                  ruleForm={endpointRuleForm}
                  helpTexts={helpTexts}
                  matchSpecificationOptionsTree={matchSpecificationOptionsTree}
                  matchSpecificationOptions={matchSpecificationOptions}
                  onChangeIn={onChangeIn}
                  addMatchSpecification={addMatchSpecification}
                  removeMatchSpecification={removeMatchSpecification}
                />
              </Section>
            );
          })}
        </SubViewWrapper>
      </div>
    );
  }

  removeRule = (e, key) => {
    e.preventDefault();
    this.props.removeEndpointRule(key);
  };
}
