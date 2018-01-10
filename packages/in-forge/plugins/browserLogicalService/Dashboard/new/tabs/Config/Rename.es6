import { createField, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import { renameKey } from 'in-api/eumKeys';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './Rename.less';

const block = 'in-eum-rename';

export default class Rename extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      field: createField({ value: props.snapshot.getIn(['data', 'eumKeyName']), validator: notBlankValidator }),
      saveError: null,
      loading: false
    };
  }

  render() {
    const { field, saveError, loading } = this.state;
    const { snapshot } = this.props;

    const activeName = snapshot.getIn(['data', 'eumKeyName']);
    return (
      <DashboardTile>
        <form onSubmit={this.onSubmit}>
          <FormGroup className={`${block}__group`}>
            <Label htmlFor="website-name">Website Name</Label>

            {saveError && <SaveError>{saveError}</SaveError>}

            <p className={`${block}__help`}>
              Renaming a website is an eventually consistent action within the Instana system. For this reason, a change
              to a website name may take <em>up to a few minutes</em> until it has populated throughout the whole
              system.
            </p>

            <div className={`${block}__action-wrapper`}>
              <Input
                id="website-name"
                type="text"
                value={field.value}
                onChange={this.onChange}
                hasError={field.touched && !field.valid}
                className={`${block}__input`}
                disabled={loading}
              />
              <Button
                type="submit"
                kind="default"
                disabled={loading || (field.touched && !field.valid) || activeName === field.value}
                className={`${block}__button`}
              >
                Rename
              </Button>
              {this.state.saveResult != null ? (
                <TemporaryPresenter duration={5000} id={`${this.state.saveResult}`}>
                  <SvgIcon type="ok" width={16} className={`${block}__success-icon`} />{' '}
                  <span className={`${block}__sucess-label`}>Saved</span>
                </TemporaryPresenter>
              ) : null}
            </div>

            {field.touched &&
              field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
          </FormGroup>
        </form>
      </DashboardTile>
    );
  }

  onChange = e => {
    this.setState({
      field: this.state.field.setValue(e.target.value).setTouched(true)
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const { field } = this.state;
    if (!field.valid) {
      this.setState({
        field: this.state.field.setTouched(true)
      });
      return;
    }

    this.setState({
      loading: true,
      saveError: null,
      saveResult: null
    });

    this.saveSubscription = combineDataAndError(
      renameKey(this.props.snapshot.getIn(['data', 'eumKey']), field.value)
    ).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        this.setState({
          loading: false,
          saveError: null,
          saveResult: Date.now(),
          snapshot: null
        });
      }
    });
  };
}
