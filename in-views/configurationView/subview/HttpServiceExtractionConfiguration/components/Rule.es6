import React from 'react';

import {
  upsertRule,
  removeRule,
  moveRuleDown,
  moveRuleUp
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rules';
import RuleTester from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/RuleTester';
import options from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/options';
import {evaluateClassNames} from 'in-services/util/classnames';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Select from 'in-components/form/Select';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './Rule.less';

const block = 'in-config-http-ex-rule';

export default React.createClass({
  displayName: 'HttpRule',

  propTypes: {
    rule: React.PropTypes.any.isRequired
  },

  getInitialState() {
    return {
      isExpanded: false,
      isTesting: false
    };
  },

  render() {
    const rule = this.props.rule;
    const id = rule.get('id');

    return (
      <div>
        <div className={`${block}__actions-wrapper`}>
          <div className={`${block}__actions`}>
            <SvgIcon type='chevron_up'
                     width={12}
                     className={`${block}__up`}
                     onClick={() => moveRuleUp(rule.get('id'))}/>
            <SvgIcon type='chevron_down'
                     width={12}
                     className={`${block}__down`}
                     onClick={() => moveRuleDown(rule.get('id'))}/>
            <SvgIcon type={this.state.isExpanded ? 'timeline_close' : 'timeline_open'}
                     width={12}
                     className={`${block}__toggle`}
                     onClick={this.toggleExpanded}/>
          </div>
        </div>

        <div className={block}>
          <div className={`${block}__header`}>
            <FormGroup className={evaluateClassNames({
                         [`${block}__name-group`]: true,
                         [`${block}__without-bottom-margin`]: !this.state.isExpanded
                       })}>
              <Label htmlFor={`${id}-rule-name`}>Rule Name</Label>
              <Input type='text'
                     id={`${id}-rule-name`}
                     value={rule.getIn(['name'])}
                     onChange={e => this.setProp(['name'], e.target.value)}/>
            </FormGroup>

            <FormGroup className={evaluateClassNames({
                         [`${block}__without-bottom-margin`]: !this.state.isExpanded
                       })}>
              <Label htmlFor={`${id}-enabled`}>Enabled</Label>
              <Toggle id={`${id}-enabled`}
                      checked={rule.getIn(['enabled'])}
                      onChange={e => this.setProp(['enabled'], e.target.checked)}/>
            </FormGroup>
          </div>

          {this.state.isExpanded ? (
            <div>
              <FormGroup>
                <Label htmlFor={`${id}-select-match-rule`}>Match</Label>
                <Select id={`${id}-select-match-rule`}
                        onChange={this.onChangeMatchOption}>
                  <option value=''>Please Select</option>

                  <optgroup label='Headers'>
                    <option value='host'
                            disabled={rule.getIn(['matchSpecification', 'host']) != null}>
                      Host
                    </option>
                  </optgroup>

                  <option value='path'
                          disabled={rule.getIn(['matchSpecification', 'path']) != null}>
                    Request Path
                  </option>
                </Select>
                <HelpBlock>
                  TODO
                </HelpBlock>
              </FormGroup>

              {rule.get('matchSpecification').keySeq().toArray().sort().map(key =>
                <FormGroup key={key}>
                  <Label htmlFor={`${id}-${key}`}>
                    Match: {options[key].titleName}

                    <a href='#'
                       onClick={e => this.removeMatch(e, key)}
                       className={`${block}__remove-match`}>
                      Remove
                    </a>
                  </Label>
                  <Input type='text'
                         id={`${id}-${key}`}
                         placeholder={options[key].placeholder}
                         value={rule.getIn(['matchSpecification', key])}
                         onChange={e => this.setProp(['matchSpecification', key], e.target.value)}/>
                  <HelpBlock>
                    {options[key].help}
                  </HelpBlock>
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor={`${id}-service-name`}>Service Name</Label>
                <Input type='text'
                       id={`${id}-service-name`}
                       placeholder='Shop'
                       value={rule.getIn(['extractSpecification', 'label'])}
                       onChange={e => this.setProp(['extractSpecification', 'label'], e.target.value)}/>
                <HelpBlock>
                  TODO
                </HelpBlock>
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`${id}-comment`}>Comment</Label>
                <TextArea rows='3'
                          id={`${id}-comment`}
                          value={rule.getIn(['comment'])}
                          onChange={e => this.setProp(['comment'], e.target.value)}/>
                <HelpBlock>
                  TODO
                </HelpBlock>
              </FormGroup>

              <div className={`${block}__buttons`}>
                {!this.state.isTesting ?
                  <Button kind='info'
                          size='sm'
                          onClick={this.toggleTesting}>
                    Test Rule
                  </Button>
                : null}
                {' '}
                <Button kind='danger'
                        size='sm'
                        onClick={() => removeRule(rule.get('id'))}>
                  Remove Rule
                </Button>
              </div>

              {this.state.isTesting ?
                <RuleTester toggleRuleTesting={this.toggleTesting}
                            rule={rule}/>
                            : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  },

  toggleExpanded() {
    this.setState({
      isExpanded: !this.state.isExpanded,
      isTesting: false
    });
  },

  toggleTesting() {
    this.setState({
      isTesting: !this.state.isTesting
    });
  },

  setProp(path, value) {
    const updatedRule = this.props.rule.setIn(path, value);
    upsertRule(updatedRule);
  },

  onChangeMatchOption(e) {
    const newRuleName = e.target.value;
    if (!newRuleName) {
      return;
    }

    // reset selection to "Please Select"
    e.target.value = '';

    const rule = this.props.rule;
    const ruleValue = rule.getIn(['matchSpecification', newRuleName], undefined);
    if (ruleValue == null) {
      const updatedRule = rule.setIn(['matchSpecification', newRuleName], options[newRuleName].initialValue || '');
      upsertRule(updatedRule);
    }
  },

  removeMatch(e, key) {
    e.preventDefault();
    const updatedRule = this.props.rule.deleteIn(['matchSpecification', key]);
    upsertRule(updatedRule);
  }
});
