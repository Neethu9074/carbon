import React from 'react';

import Form from 'in-applications/NewApplication/Form';
import Title from 'in-components/Title';

export default class NewApplication extends React.Component {
  state = {
    loading: true,
    error: false,
    form: null,
    entity: null,
    message: 'Loading…'
  };

  // componentWillMount() {
  //   this.load(this.props.entityId);
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //
  // }

  // componentWillUnmount() {
  //   this.disposeAsyncAction();
  // }

  render() {
    return (
      <div>
        <Title title="New application" />
        <Form />
      </div>
    );
  }
}
