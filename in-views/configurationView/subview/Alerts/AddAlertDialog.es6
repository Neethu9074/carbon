import {createMapForm, createField, notBlankValidator} from 'formalistic';
import irpt from 'react-immutable-proptypes';
import {fromJS} from 'immutable';
import React from 'react';

import {addOrUpdateAlert} from 'in-services/groundskeeper/alertings';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {close} from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/Alerts/AddAlertDialog.less';


const block = 'in-alerts-add-dialog';

export default connectTo({
},
React.createClass({

  displayName: 'AddAlertDialog',

  propTypes: {
    alert: irpt.map
  },

  getInitialState() {
    const alert = this.props.alert;
    const form = createMapForm()
      .put('name', createField({
        value: alert ? alert.getIn(['data', 'name']) : '',
        validator: notBlankValidator
      }))
      .put('entityType', createField({
        value: alert ? alert.getIn(['data', 'entityType']) : undefined,
        validator: notBlankValidator
      }))
      .put('metricName', createField({
        value: alert ? alert.getIn(['data', 'metricName']) : '',
        validator: notBlankValidator
      }))
      .put('rollup', createField({
        value: alert ? String(alert.getIn(['data', 'rollup'])) : undefined,
        validator: notBlankValidator
      }))
      .put('aggregation', createField({
        value: alert ? alert.getIn(['data', 'aggregation']) : undefined,
        validator: notBlankValidator
      }))
      .put('threshold', createField({
        value: alert ? alert.getIn(['data', 'threshold']) : undefined,
        validator: notBlankValidator
      }))
      .put('thresholdValue', createField({
        value: alert ? String(alert.getIn(['data', 'thresholdValue'])) : '0.0',
        validator: notBlankValidator
      }))
      .put('eventText', createField({
        value: alert ? String(alert.getIn(['data', 'eventText'])) : '',
        validator: notBlankValidator
      }))
      .put('severity', createField({
        value: alert ? String(alert.getIn(['data', 'severity'])) : undefined,
        validator: notBlankValidator
      }))
      .put('query', createField({
        value: alert ? alert.getIn(['data', 'query']) : '',
        validator: notBlankValidator
      }))
      .put('isTriggering', createField({
        value: alert ? alert.getIn(['data', 'isTriggering']) : false
      }));

    return {
      form
    };
  },

  render() {
    const {form} = this.state;

    return (
      <Dialog header='Add Alert'
              onClose={close}>
        <form onSubmit={this.onSubmit}>

          {form.get('name').map(field =>
            <FormGroup>
              <Label htmlFor='name'
                     hasError={!field.valid}>
                Name
              </Label>
              <Input id='name'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('name', e.target.value)}
                     hasError={!field.valid}
                     autoFocus />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('entityType').map(field =>
            <FormGroup>
              <Label htmlFor='entityType'
                     hasError={!field.valid}>
                Entity Type
              </Label>
              <select onChange={e => this.onChange('entityType', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='host'
                        value='host'>
                  Host
                </option>
                <option key='process'
                        value='process'>
                  Process
                </option>
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('metricName').map(field =>
            <FormGroup>
              <Label htmlFor='metricName'
                     hasError={!field.valid}>
                Metric
              </Label>
              <Input id='metricName'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('metricName', e.target.value)}
                     hasError={!field.valid} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('rollup').map(field =>
            <FormGroup>
              <Label htmlFor='rollup'
                     hasError={!field.valid}>
                Rollup
              </Label>
              <select onChange={e => this.onChange('rollup', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='1s'
                        value='1000'>
                  1s
                </option>
                <option key='5s'
                        value='5000'>
                  5s
                </option>
                <option key='1min'
                        value='60000'>
                  1min
                </option>
                <option key='5min'
                        value='300000'>
                  5min
                </option>
                <option key='1h'
                        value='3600000'>
                  1h
                </option>
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('aggregation').map(field =>
            <FormGroup>
              <Label htmlFor='aggregation'
                     hasError={!field.valid}>
                Aggregation
              </Label>
              <select onChange={e => this.onChange('aggregation', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='min'
                        value='min'>
                  min
                </option>
                <option key='max'
                        value='max'>
                  max
                </option>
                <option key='avg'
                        value='avg'>
                  avg
                </option>
                <option key='median'
                        value='median'>
                  median
                </option>
                <option key='sum'
                        value='sum'>
                  sum
                </option>
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('threshold').map(field =>
            <FormGroup>
              <Label htmlFor='threshold'
                     hasError={!field.valid}>
                Threshold
              </Label>
              <select onChange={e => this.onChange('threshold', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='<'
                        value='<'>
                  {'<'}
                </option>
                <option key='<='
                        value='<='>
                  {'<='}
                </option>
                <option key='=='
                        value='=='>
                  {'=='}
                </option>
                <option key='>='
                        value='>='>
                  {'>='}
                </option>
                <option key='>'
                        value='>'>
                  {'>'}
                </option>
                <option key='!='
                        value='!='>
                  {'!='}
                </option>
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('thresholdValue').map(field =>
            <FormGroup>
              <Label htmlFor='thresholdValue'
                     hasError={!field.valid}>
                Threshold Value
              </Label>
              <Input id='thresholdValue'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('thresholdValue', e.target.value)}
                     hasError={!field.valid} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('eventText').map(field =>
            <FormGroup>
              <Label htmlFor='eventText'
                     hasError={!field.valid}>
                Event Text
              </Label>
              <Input id='eventText'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('eventText', e.target.value)}
                     hasError={!field.valid} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('severity').map(field =>
            <FormGroup>
              <Label htmlFor='severity'
                     hasError={!field.valid}>
                Severity
              </Label>
              <select onChange={e => this.onChange('severity', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='0'
                        value='0'>
                  0
                </option>
                <option key='5'
                        value='5'>
                  5
                </option>
                <option key='10'
                        value='10'>
                  10
                </option>
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          {form.get('isTriggering').map(field =>
            <FormGroup>
              <Label htmlFor='isTriggering'>
                Is Triggering
              </Label>
              <Toggle className={`${block}__toggle`}
                      checked={field.value}
                      onChange={e => this.onChange('isTriggering', e.target.checked)} />
            </FormGroup>
          )}

          {form.get('query').map(field =>
            <FormGroup>
              <Label htmlFor='query'
                     hasError={!field.valid}>
                Filter Query
              </Label>
              <Input id='query'
                     type='text'
                     value={field.value}
                     onChange={e => this.onChange('query', e.target.value)}
                     hasError={!field.valid} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )}

          <Button kind='success'
                  type='submit'
                  disabled={!form.hierarchyValid && form.touched}>
            Add alert
          </Button>
        </form>
      </Dialog>
    );
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
      });
      return;
    }

    const alert = this.props.alert;
    const form = this.state.form;
    addOrUpdateAlert(fromJS({
      id: alert ? alert.get('id') : null,
      data: {
        name: form.get('name').value,
        enabled: alert ? alert.getIn(['data', 'enabled']) : true,
        entityType: form.get('entityType').value,
        metricName: form.get('metricName').value,
        isTriggering: form.get('isTriggering').value,
        rollup: Number(form.get('rollup').value),
        aggregation: form.get('aggregation').value,
        threshold: form.get('threshold').value,
        thresholdValue: Number(form.get('thresholdValue').value),
        severity: Number(form.get('severity').value),
        eventText: form.get('eventText').value,
        description: alert ? alert.getIn(['data', 'description']) : '',
        query: form.get('query').value,
        condition: '10 minute(s) > 50%'
      }
    }));
    close();
  }
}));
