import React from 'react';

import Form from 'in-applications/NewApplication/Form';

export default class NewApplication extends React.Component {
  state = {
    loading: true,
    error: false,
    form: null,
    entity: null,
    message: 'Loading…'
  };

  componentWillMount() {
    this.load(this.props.entityId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entityId !== nextProps.entityId) {
      this.load(nextProps.entityId);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    return (
      <div>
        <Form />
      </div>
    );
  }
}
