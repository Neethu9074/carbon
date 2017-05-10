import React from 'react';

import MatchSpecificationSelector
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/MatchSpecificationSelector';
import RuleTester from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/RuleTester';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Input from 'in-components/form/Input';
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
    const { serviceRule, form, onChangeIn, matchSpecificationOptionsTree, matchSpecificationOptions } = this.props;
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
                </FormGroup>

                <div className={`${block}__header`}>
                  {endpointRuleForm.get('name').map(nameField => (
                    <FormGroup className={`${block}__name-group`}>
                      <Label htmlFor={`${serviceRuleId}-rule-name`}>Rule Name</Label>
                      <Input
                        type="text"
                        id={`${serviceRuleId}-rule-name`}
                        value={nameField.value}
                        onChange={e => onChangeIn(['endpointRules', key, 'name'], e.target.value)}
                      />
                    </FormGroup>
                  ))}
                </div>
                <div>
                  {
                    <MatchSpecificationSelector
                      id={serviceRuleId}
                      matchSpecificationForm={endpointRuleForm.get('matchSpecification')}
                      matchSpecificationOptionsTree={matchSpecificationOptionsTree}
                      onChangeMatchOption={e =>
                        this.onChangeMatchOption(e, matchSpecificationOptions, [
                          'endpointRules',
                          key,
                          'matchSpecification'
                        ])}
                    />
                  }

                  {endpointRuleForm
                    .get('matchSpecification')
                    .reduce((acc, cur, matchKey) => acc.concat(matchKey), [])
                    .sort()
                    .map(matchKey => {
                      const field = endpointRuleForm.get('matchSpecification').get(matchKey);

                      return (
                        <FormGroup key={matchKey}>
                          <Label htmlFor={`${serviceRuleId}-${matchKey}`} hasError={!field.valid}>
                            Match Expression: {matchSpecificationOptions[matchKey].titleName}

                            <a
                              href="#"
                              onClick={e => this.removeMatch(e, matchKey, ['endpointRules', key, 'matchSpecification'])}
                              className={`${block}__remove-match`}
                            >
                              Remove
                            </a>
                          </Label>
                          <Input
                            type="text"
                            id={`${serviceRuleId}-${matchKey}`}
                            placeholder={matchSpecificationOptions[matchKey].placeholder}
                            value={field.value}
                            onChange={e =>
                              onChangeIn(['endpointRules', key, 'matchSpecification', matchKey], e.target.value)}
                            hasError={!field.valid}
                          />
                          {field.valid
                            ? null
                            : <ValidationBlock hasError>
                                {field.messages.map(e => e.message)}
                              </ValidationBlock>}
                        </FormGroup>
                      );
                    })}

                  {endpointRuleForm.get('label').map(labelField => (
                    <FormGroup>
                      <Label htmlFor={`${serviceRuleId}-service-name`}>Service Name</Label>
                      <Input
                        type="text"
                        id={`${serviceRuleId}-service-name`}
                        placeholder="Shop"
                        value={labelField.value}
                        onChange={e => onChangeIn(['endpointRules', key, 'label'], e.target.value)}
                      />
                    </FormGroup>
                  ))}

                  {endpointRuleForm.get('comment').map(commentField => (
                    <FormGroup>
                      <Label htmlFor={`${serviceRuleId}-comment`}>Comment</Label>
                      <TextArea
                        rows="3"
                        id={`${serviceRuleId}-comment`}
                        value={commentField.value}
                        onChange={e => onChangeIn(['endpointRules', key, 'comment'], e.target.value)}
                      />
                    </FormGroup>
                  ))}

                  <div className={`${block}__buttons`}>
                    {!this.state.isTesting
                      ? <Button kind="info" size="sm" onClick={this.toggleTesting}>
                          Test Rule
                        </Button>
                      : null}
                    {' '}
                  </div>

                  {this.state.isTesting
                    ? <RuleTester
                        toggleRuleTesting={this.toggleTesting}
                        form={endpointRuleForm}
                        matchSpecificationOptions={matchSpecificationOptions}
                      />
                    : null}
                </div>
              </Section>
            );
          })}
        </SubViewWrapper>
      </div>
    );
  }

  onChangeMatchOption = (e, matchSpecificationOptions, path) => {
    const newRuleName = e.target.value;
    if (!newRuleName) {
      return;
    }

    // reset selection to "Please Select"
    e.target.value = '';

    this.props.addMatchSpecification(path, newRuleName, matchSpecificationOptions[newRuleName].initialValue || '');
  };

  removeMatch = (e, key, path) => {
    e.preventDefault();
    this.props.removeMatchSpecification(key, path);
  };

  removeRule = (e, key) => {
    e.preventDefault();
    this.props.removeEndpointRule(key);
  };
}
