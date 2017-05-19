import React from 'react';

import ServiceExtractionRuleConfigForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfigForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
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
      removeMatchSpecification,
      moveUp,
      moveDown
    } = this.props;
    if (!serviceRule) {
      return null;
    }

    const serviceRuleId = serviceRule.get('id');
    const endpoints = form.get('endpointRules');
    const numEndpoints = endpoints.items.length;

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
          {endpoints.map((endpointRuleForm, index) => {
            const key = endpointRuleForm.get('id').value;
            const endpointHtmlId = `${serviceRuleId}-${key}`;
            return (
              <Section key={key}>
                <div className={`${block}__header`}>
                  {numEndpoints > 1
                    ? <SvgIcon
                        className={`${block}__order-up`}
                        type="chevron_up"
                        width={12}
                        color="#172429"
                        onClick={() => moveUp(index)}
                      />
                    : null}
                  {numEndpoints > 1
                    ? <SvgIcon
                        className={`${block}__order-down`}
                        type="chevron_down"
                        width={12}
                        color="#172429"
                        onClick={() => moveDown(index)}
                      />
                    : null}

                  <Label htmlFor={endpointHtmlId}>
                    <a href="#" onClick={e => this.removeRule(e, key)} className={`${block}__remove-endpoint`}>
                      Remove endpoint
                    </a>
                  </Label>
                </div>

                <ServiceExtractionRuleConfigForm
                  prePath={['endpointRules', index]}
                  ruleForm={endpointRuleForm}
                  helpTexts={helpTexts}
                  resultingEntityNameTitle="Endpoint Name"
                  resultingEntityTooltipText={helpTexts.serviceEndpointNameHelp}
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
