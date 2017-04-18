import React from 'react';

import { add } from 'in-views/configurationView/subview/EumKeys/stores/keys';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './NewAppForm.less';

const block = 'in-eum-keys-config-new-app';

export default class extends React.Component {
  static displayName = 'NewAppForm';

  state = {
    appName: ''
  };

  render() {
    return (
      <form className={block} onSubmit={this.onSubmit}>
        <FormGroup className={`${block}__app-name`}>
          <Label htmlFor="eum-new-app-name">App Name</Label>
          <Input
            id="eum-new-app-name"
            value={this.state.appName}
            onChange={e => this.setState({ appName: e.target.value })}
          />
        </FormGroup>

        <Button type="submit" kind="success" size="sm" className={`${block}__add`}>
          Add App
        </Button>
      </form>
    );
  }

  onSubmit = e => {
    e.preventDefault();
    add(this.state.appName);
    this.setState({
      appName: ''
    });
  };
}
