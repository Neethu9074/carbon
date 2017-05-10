import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';

import './ServiceExtractionEndpointRuleConfig.less';

const block = 'in-views-service-extraction-endpoint-form';

export default class extends React.Component {
  static displayName = 'ServiceExtractionEndpointRuleConfig';

  render() {
    const { serviceRule, form, onChangeIn } = this.props;
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
            <Button kind="success" onClick={this.props.addEndpointRule}>
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
                  <Label htmlFor={`${serviceRuleId}-endpoinrule-${key}`}>
                    Rule
                  </Label>
                </FormGroup>

                {endpointRuleForm.get('name').map(field => (
                  <FormGroup>
                    <Label htmlFor={`${endpointHtmlId}-name`}>Endpoint Name</Label>
                    <Input
                      type="text"
                      id={`${endpointHtmlId}-name`}
                      placeholder="Affenjunge"
                      value={field.value}
                      onChange={e => onChangeIn(['endpointRules', key, 'name'], e.target.value)}
                    />
                  </FormGroup>
                ))}
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
