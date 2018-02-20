import Select from 'react-select';
import React from 'react';

import locals from './HttpFilterSelect.mless';

const HTTP_STATUS_CODES = [
  { label: '1xx', value: '1xx' },
  { label: '2xx', value: '2xx' },
  { label: '3xx', value: '3xx' },
  { label: '4xx', value: '4xx' },
  { label: '5xx', value: '5xx' }
];
const HTTP_METHODS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' }
];

export default class extends React.Component {
  static displayName = 'HttpFilterSelect';

  constructor(props) {
    super(props);
    this.state = {
      statusCodes: [],
      methods: []
    };
  }

  handleSelectedStatusChange = statusCodes => {
    this.setState(previousState => {
      return {
        statusCodes: statusCodes,
        methods: previousState.methods
      };
    });
    if (typeof this.props.onSelectedStatusChange === 'function') {
      this.props.onSelectedStatusChange(this.preProcessForListeners(statusCodes));
    }
  };

  handleSelectedMethodsChange = methods => {
    this.setState(previousState => {
      return {
        statusCodes: previousState.statusCodes,
        methods: methods
      };
    });
    if (typeof this.props.onSelectedMethodsChange === 'function') {
      this.props.onSelectedMethodsChange(this.preProcessForListeners(methods));
    }
  };

  preProcessForListeners(value) {
    if (typeof value === 'string') {
      if (value.trim().length === 0) {
        // currently no option is selected, send null to listener to reset associated filter
        return null;
      } else {
        // send selected options as an array of strings
        return value.split(',');
      }
    } else {
      return value;
    }
  }

  render() {
    return (
      <span>
        <span className={locals.filterGroup}>
          <span>Status Code</span>
          <span className={locals.selectWrapper}>
            <Select
              closeOnSelect={false}
              multi
              onChange={this.handleSelectedStatusChange}
              options={HTTP_STATUS_CODES}
              placeholder="Filter HTTP status codes"
              simpleValue
              value={this.state.statusCodes}
            />
          </span>
        </span>
        <span className={locals.filterGroup}>
          <span>Method</span>
          <span className={locals.selectWrapper}>
            <Select
              closeOnSelect
              multi
              onChange={this.handleSelectedMethodsChange}
              options={HTTP_METHODS}
              placeholder="Filter HTTP methods"
              simpleValue
              value={this.state.methods}
            />
          </span>
        </span>
      </span>
    );
  }
}
