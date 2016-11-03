import React from 'react';

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
      isExpanded: false
    };
  },

  render() {
    const id = 'foo';

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
                     onClick={this.toggle}/>
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
                     id={`${id}--rule-name`}/>
            </FormGroup>

            <FormGroup className={evaluateClassNames({
                         [`${block}__without-bottom-margin`]: !this.state.isExpanded
                       })}>
              <Label htmlFor={`${id}--enabled`}>Enabled</Label>
              <Toggle id={`${id}--enabled`}/>
            </FormGroup>
          </div>

          {this.state.isExpanded ? [
            <FormGroup key={0}>
              <Label htmlFor={`${id}--host`}>Host</Label>
              <Input type='text'
                     id={`${id}--host`}/>
            </FormGroup>,

            <FormGroup key={1}>
              <Label htmlFor={`${id}--path`}>Path</Label>
              <Input type='text'
                     id={`${id}--path`}/>
            </FormGroup>,

            <FormGroup key={2}>
              <Label htmlFor={`${id}--format`}>Format String</Label>
              <Input type='text'
                     id={`${id}--format`}/>
            </FormGroup>,

            <FormGroup key={3}>
              <Label htmlFor={`${id}--comment`}>Comment</Label>
              <TextArea rows='3'
                        id={`${id}--comment`} />
              <HelpBlock>
                Optionlly describe the service extraction rule for your future self and your colleagues.
              </HelpBlock>
            </FormGroup>,

            <div key={4}
                 className={`${block}__remove-wrapper`}>
              <Button kind='danger'
                      size='sm'>
                Remove Rule
              </Button>
            </div>
          ] : null}
        </div>
      </div>
    );
  },

  toggle() {
    this.setState({isExpanded: !this.state.isExpanded});
  }
});
