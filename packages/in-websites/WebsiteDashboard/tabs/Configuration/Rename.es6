import { createField, notBlankValidator } from 'formalistic';
import React from 'react';

// import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Card from 'in-new-components/Card';

export default class Rename extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      field: createField({ value: props.data.label, validator: notBlankValidator }),
      saveError: null,
      loading: true
    };
  }

  render() {
    const { field, loading } = this.state;

    return (
      <Card title="Rename Website">
        <p>
          Renaming a website is an eventually consistent action within the Instana system. For this reason, a change to
          a website name may take up to a few minutes until it has populated throughout the whole system.
        </p>
        <Input
          id="website-name"
          type="text"
          value={field.value}
          onChange={this.onChange}
          hasError={field.touched && !field.valid}
          disabled={loading}
        />
      </Card>
    );
  }
}
