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
const HTTP_VERBS = [
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
      verbs: []
    };
  }

  handleSelectedStatusChange = statusCodes => {
    this.setState(previousState => {
      return {
        statusCodes: statusCodes,
        verbs: previousState.verbs
      };
    });
  };

  handleSelectedVerbChange = verbs => {
    this.setState(previousState => {
      return {
        statusCodes: previousState.statusCodes,
        verbs: verbs
      };
    });
  };

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
              onChange={this.handleSelectedVerbChange}
              options={HTTP_VERBS}
              placeholder="Filter HTTP methods"
              simpleValue
              value={this.state.verbs}
            />
          </span>
        </span>
      </span>
    );
  }
}
