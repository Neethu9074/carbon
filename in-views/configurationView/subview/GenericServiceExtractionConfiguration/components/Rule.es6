import rpt from 'prop-types';
import React from 'react';

import {
  setValue,
  addMatchSpecification,
  removeMatchSpecification,
  moveRuleUp,
  moveRuleDown,
  removeRule
} from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/stores/ruleForms';
import MatchSpecificationSelector
  from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/MatchSpecificationSelector';
import RuleTester from 'in-views/configurationView/subview/GenericServiceExtractionConfiguration/components/RuleTester';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './Rule.less';

const block = 'in-config-generic-ex-rule';

export default class extends React.Component {
  static displayName = 'Rule';

  static propTypes = {
    ruleForm: rpt.any.isRequired,
    path: rpt.any,
    helpTexts: rpt.object.isRequired,
    matchSpecificationOptionsTree: rpt.array.isRequired,
    matchSpecificationOptions: rpt.object.isRequired
  };

  state = {
    isExpanded: false,
    isTesting: false
  };

  componentWillMount() {
    if (!this.props.ruleForm.valid) {
      this.setState({ isExpanded: true });
    }
  }

  render() {
    const { ruleForm, path, helpTexts, matchSpecificationOptionsTree, matchSpecificationOptions } = this.props;
    const id = ruleForm.get('id').value;
    return (
      <div>
        <div className={`${block}__actions-wrapper`}>
          <div
            className={evaluateClassNames({
              [`${block}__actions`]: true,
              [`${block}__actions--has-error`]: !ruleForm.valid
            })}
          >
            <SvgIcon type="chevron_up" width={12} className={`${block}__up`} onClick={() => moveRuleDown(path)} />
            <SvgIcon type="chevron_down" width={12} className={`${block}__down`} onClick={() => moveRuleUp(path)} />
            <SvgIcon
              type={this.state.isExpanded ? 'timeline_close' : 'timeline_open'}
              width={12}
              className={`${block}__toggle`}
              onClick={this.toggleExpanded}
            />
          </div>
        </div>

        <div
          className={evaluateClassNames({
            [block]: true,
            [`${block}--has-error`]: !ruleForm.valid
          })}
        >
          <div className={`${block}__header`}>
            {ruleForm.get('name').map(nameField => (
              <FormGroup
                className={evaluateClassNames({
                  [`${block}__name-group`]: true,
                  [`${block}__without-bottom-margin`]: !this.state.isExpanded
                })}
              >
                <Label htmlFor={`${id}-rule-name`}>Rule Name</Label>
                <Input
                  type="text"
                  id={`${id}-rule-name`}
                  value={nameField.value}
                  onChange={e => setValue([...path, 'name'], e.target.value)}
                />
              </FormGroup>
            ))}

            {ruleForm.get('enabled').map(enabledField => (
              <FormGroup
                className={evaluateClassNames({
                  [`${block}__without-bottom-margin`]: !this.state.isExpanded
                })}
              >
                <Label htmlFor={`${id}-enabled`}>{enabledField.value ? 'Enabled' : 'Disabled'}</Label>
                <Toggle
                  id={`${id}-enabled`}
                  checked={enabledField.value}
                  onChange={e => setValue([...path, 'enabled'], e.target.checked)}
                />
              </FormGroup>
            ))}
          </div>

          {this.state.isExpanded
            ? <div>
                {
                  <MatchSpecificationSelector
                    id={id}
                    matchSpecificationForm={ruleForm.get('matchSpecification')}
                    matchSpecificationOptionsTree={matchSpecificationOptionsTree}
                    helpTexts={helpTexts}
                    onChangeMatchOption={this.onChangeMatchOption}
                  />
                }

                {ruleForm.get('matchSpecification').reduce((acc, cur, key) => acc.concat(key), []).sort().map(key => {
                  const field = ruleForm.get('matchSpecification').get(key);

                  return (
                    <FormGroup key={key}>
                      <Label htmlFor={`${id}-${key}`} hasError={!field.valid}>
                        Match Expression: {matchSpecificationOptions[key].titleName}

                        <a href="#" onClick={e => this.removeMatch(e, key)} className={`${block}__remove-match`}>
                          Remove
                        </a>
                      </Label>
                      <Input
                        type="text"
                        id={`${id}-${key}`}
                        placeholder={matchSpecificationOptions[key].placeholder}
                        value={field.value}
                        onChange={e => setValue([...path, 'matchSpecification', key], e.target.value)}
                        hasError={!field.valid}
                      />
                      {field.error
                        ? <ValidationBlock hasError>
                            {field.error}
                          </ValidationBlock>
                        : null}
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
                      onChange={e => setValue([...path, 'label'], e.target.value)}
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
                      onChange={e => setValue([...path, 'comment'], e.target.value)}
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
                  <Button kind="danger" size="sm" onClick={() => removeRule(path)}>
                    Remove Rule
                  </Button>
                </div>

                {this.state.isTesting
                  ? <RuleTester
                      toggleRuleTesting={this.toggleTesting}
                      ruleForm={ruleForm}
                      matchSpecificationOptions={matchSpecificationOptions}
                    />
                  : null}
              </div>
            : null}
        </div>
      </div>
    );
  }

  toggleExpanded = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
      isTesting: false
    });
  };

  toggleTesting = () => {
    this.setState({
      isTesting: !this.state.isTesting
    });
  };

  onChangeMatchOption = e => {
    const newRuleName = e.target.value;
    if (!newRuleName) {
      return;
    }

    // reset selection to "Please Select"
    e.target.value = '';

    addMatchSpecification(
      this.props.path,
      newRuleName,
      this.props.matchSpecificationOptions[newRuleName].initialValue || ''
    );
  };

  removeMatch = (e, key) => {
    e.preventDefault();
    removeMatchSpecification(this.props.path, key);
  };
}
