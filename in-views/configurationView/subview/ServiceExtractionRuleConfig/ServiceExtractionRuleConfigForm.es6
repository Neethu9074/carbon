import React from 'react';

import MatchSpecificationSelector
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/MatchSpecificationSelector';
import RuleTester from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/RuleTester';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './ServiceExtractionRuleConfigForm.less';

const block = 'in-config-service-extraction-rule-form';

export default class extends React.Component {
  static displayName = 'Rule';

  state = {
    isTesting: false
  };

  render() {
    const {
      prePath,
      onChangeIn,
      ruleForm,
      helpTexts,
      matchSpecificationOptionsTree,
      matchSpecificationOptions
    } = this.props;
    const id = ruleForm.get('id').value;
    return (
      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}--has-error`]: !ruleForm.hierarchyValid
        })}
      >
        <div className={`${block}__header`}>
          {ruleForm.get('name').map(nameField => (
            <FormGroup className={`${block}__name-group`}>
              <Label htmlFor={`${id}-rule-name`}>Rule Name</Label>
              <Input
                type="text"
                id={`${id}-rule-name`}
                value={nameField.value}
                onChange={e => onChangeIn(prePath.concat(['name']), e.target.value)}
              />
            </FormGroup>
          ))}
        </div>
        <div>
          {
            <MatchSpecificationSelector
              id={id}
              matchSpecificationForm={ruleForm.get('matchSpecification')}
              matchSpecificationOptionsTree={matchSpecificationOptionsTree}
              helpTexts={helpTexts}
              onChangeMatchOption={e =>
                this.onChangeMatchOption(e, matchSpecificationOptions, prePath.concat(['matchSpecification']))}
            />
          }

          {ruleForm.get('matchSpecification').reduce((acc, cur, key) => acc.concat(key), []).sort().map(key => {
            const field = ruleForm.get('matchSpecification').get(key);

            return (
              <FormGroup key={key}>
                <Label htmlFor={`${id}-${key}`} hasError={!field.valid}>
                  Match Expression: {matchSpecificationOptions[key].titleName}

                  <a
                    href="#"
                    onClick={e => this.removeMatch(e, key, prePath.concat(['matchSpecification']))}
                    className={`${block}__remove-match`}
                  >
                    Remove
                  </a>
                </Label>
                <Input
                  type="text"
                  id={`${id}-${key}`}
                  placeholder={matchSpecificationOptions[key].placeholder}
                  value={field.value}
                  onChange={e => onChangeIn(prePath.concat(['matchSpecification', key]), e.target.value)}
                  hasError={!field.valid}
                />
                {field.valid
                  ? null
                  : <ValidationBlock hasError>
                      {field.messages.map(e => e.message)}
                    </ValidationBlock>}
                <HelpBlock>
                  {matchSpecificationOptions[key].help}
                </HelpBlock>
              </FormGroup>
            );
          })}

          {ruleForm.get('label').map(labelField => (
            <FormGroup>
              <Label htmlFor={`${id}-service-name`}>Service Name</Label>
              <Input
                type="text"
                id={`${id}-service-name`}
                placeholder="Shop"
                value={labelField.value}
                onChange={e => onChangeIn(prePath.concat(['label']), e.target.value)}
              />
              <HelpBlock>
                {helpTexts.serviceNameHelp}
              </HelpBlock>
            </FormGroup>
          ))}

          {ruleForm.get('comment').map(commentField => (
            <FormGroup>
              <Label htmlFor={`${id}-comment`}>Comment</Label>
              <TextArea
                rows="3"
                id={`${id}-comment`}
                value={commentField.value}
                onChange={e => onChangeIn(prePath.concat(['comment']), e.target.value)}
              />
              <HelpBlock>
                {helpTexts.commentHelp}
              </HelpBlock>
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
                ruleForm={ruleForm}
                matchSpecificationOptions={matchSpecificationOptions}
              />
            : null}
        </div>
      </div>
    );
  }

  toggleTesting = () => {
    this.setState({
      isTesting: !this.state.isTesting
    });
  };

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
}
