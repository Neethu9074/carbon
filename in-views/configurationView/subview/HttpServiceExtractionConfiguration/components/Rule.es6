import Immutable from 'immutable';
import React from 'react';

import RuleTester from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/RuleTester';
import {evaluateClassNames} from 'in-services/util/classnames';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import Toggle from 'in-components/Toggle';

import './Rule.less';

const block = 'in-config-http-ex-rule';

export default React.createClass({
  displayName: 'HttpRule',

  getInitialState() {
    return {
      isExpanded: false,
      isTesting: false,
      rule: Immutable.Map({
        id: 'foo',
        name: '',
        enabled: false,
        comment: '',
        order: 0,
        type: 'http',
        parent: null,
        matchSpecification: Immutable.Map({
          host: '(.*)',
          path: '(/shop($|/))'
        }),
        extractSpecification: Immutable.Map({
          label: '{host-0}{path-0}'
        })
      })
    };
  },

  render() {
    const rule = this.state.rule;
    const id = rule.get('id');

    return (
      <div>
        <div className={`${block}__actions-wrapper`}>
          <div className={`${block}__actions`}>
            <SvgIcon type='chevron_up'
                     width={12}
                     className={`${block}__up`}/>
            <SvgIcon type='chevron_down'
                     width={12}
                     className={`${block}__down`}/>
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
              <Label htmlFor={`${id}--rule-name`}>Rule Name</Label>
              <Input type='text'
                     id={`${id}--rule-name`}
                     value={rule.getIn(['name'])}
                     onChange={e => this.setProp(['name'], e.target.value)}/>
            </FormGroup>

            <FormGroup className={evaluateClassNames({
                         [`${block}__without-bottom-margin`]: !this.state.isExpanded
                       })}>
              <Label htmlFor={`${id}--enabled`}>Enabled</Label>
              <Toggle id={`${id}--enabled`}
                      checked={rule.getIn(['enabled'])}
                      onChange={e => this.setProp(['enabled'], e.target.checked)}/>
            </FormGroup>
          </div>

          {this.state.isExpanded ? [
            <FormGroup key={0}>
              <Label htmlFor={`${id}--host`}>Match Host Header</Label>
              <Input type='text'
                     id={`${id}--host`}
                     placeholder='example.com'
                     value={rule.getIn(['data', 'hostHeader'])}
                     onChange={e => this.setProp(['data', 'hostHeader'], e.target.value)}/>
              <HelpBlock>
                Use regular expressions to match host headers. Host header regular expression capture groups are{' '}
                available in the format string via the prefix{' '} <code>host-</code>. For example, to access the{' '}
                first request request path capture group, use <code>{'{host-0}'}</code>.
              </HelpBlock>
            </FormGroup>,

            <FormGroup key={1}>
              <Label htmlFor={`${id}--path`}>Match Request Path</Label>
              <Input type='text'
                     id={`${id}--path`}
                     placeholder='/shop($|/.*)'
                     value={rule.getIn(['data', 'requestPath'])}
                     onChange={e => this.setProp(['data', 'requestPath'], e.target.value)}/>
              <HelpBlock>
                Use regular expressions to match requests paths. Request path regular expression capture groups are{' '}
                available in the format string via the prefix{' '} <code>path-</code>. For example, to access the{' '}
                first request path capture group, use <code>{'{path-0}'}</code>.
              </HelpBlock>
            </FormGroup>,

            <FormGroup key={2}>
              <Label htmlFor={`${id}--service-name`}>Service Name</Label>
              <Input type='text'
                     id={`${id}--service-name`}
                     placeholder='Shop'
                     value={rule.getIn(['data', 'extract'])}
                     onChange={e => this.setProp(['data', 'extract'], e.target.value)}/>
              <HelpBlock>
                Define the name of the service. You can reference HTTP host header capture groups and request path{' '}
                capture groups to dynamically create service names.
              </HelpBlock>
            </FormGroup>,

            <FormGroup key={3}>
              <Label htmlFor={`${id}--comment`}>Comment</Label>
              <TextArea rows='3'
                        id={`${id}--comment`}
                        value={rule.getIn(['comment'])}
                        onChange={e => this.setProp(['comment'], e.target.value)}/>
              <HelpBlock>
                Optionlly describe the service extraction rule for your future self and your colleagues.
              </HelpBlock>
            </FormGroup>,

            <div key={4}
                 className={`${block}__buttons`}>
              {!this.state.isTesting ?
                <Button kind='info'
                        size='sm'
                        onClick={this.toggleTesting}>
                  Test Rule
                </Button>
              : null}
              {' '}
              <Button kind='danger'
                      size='sm'>
                Remove Rule
              </Button>
            </div>,

            this.state.isTesting ?
              <RuleTester key={5}
                          toggleRuleTesting={this.toggleTesting}
                          rule={rule}/>
            : null
          ] : null}
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
    this.setState(state => {
      return {
        rule: state.rule.setIn(path, value)
      };
    });
  }
});
