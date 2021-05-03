/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import { get, find } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import { renameWebsite as renameWebsiteTracker } from 'in-websites/tracker';
import { renameWebsite, getWebsites } from 'in-websites/api/websites';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import { notBlankValidator } from 'in-services/validators/string';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Trans from 'in-i18n/Trans';
import { t } from 'in-i18n';

import locals from './Rename.mless';

export default class Rename extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      field: createField({ value: props.data.label, validator: notBlankValidator }),
      saveError: null,
      loading: true,
      savedLabel: props.data.label
    };
  }

  componentDidMount() {
    this.loadSubscription = combineDataAndError(getWebsites()).once(({ data, error }) => {
      if (error) {
        this.setState({
          loading: false
        });
        return;
      }

      const savedWebsite = find(data, w => w.id === this.props.websiteId);
      if (!savedWebsite) {
        this.setState({
          loading: false
        });
        return;
      }

      this.setState({
        loading: false,
        savedLabel: savedWebsite.name,
        field: this.state.field.setValue(savedWebsite.name)
      });
    });
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
    } else if (this.state.savedLabel === field.value) {
      return;
    }

    renameWebsiteTracker({
      newName: field.value,
      previousName: this.props.data.label
    });

    this.setState({
      loading: true,
      saveError: null,
      saveResult: null
    });

    this.saveSubscription = combineDataAndError(renameWebsite(this.props.websiteId, field.value)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        this.setState({
          loading: false,
          saveError: null,
          saveResult: Date.now()
        });
      }
    });
  };

  componentWillUnmount() {
    if (this.saveSubscription) {
      this.saveSubscription.dispose();
    }
    if (this.loadSubscription) {
      this.loadSubscription.dispose();
    }
  }

  render() {
    const { field, loading, saveError, savedLabel } = this.state;

    return (
      <Card title={t('in-websites:websiteDashboard.tabs.configuration.configurationRenameTitle')}>
        <form onSubmit={this.onSubmit}>
          <FormGroup className={locals.group}>
            {saveError && <SaveError>{saveError}</SaveError>}

            <HelpParagraph>
              <Trans i18nKey="in-websites:rename.help" />
            </HelpParagraph>

            <div className={locals.actionWrapper}>
              <Input
                id="website-name"
                type="text"
                value={field.value}
                onChange={this.onChange}
                hasError={field.touched && !field.valid}
                className={locals.input}
                disabled={loading}
              />
              <Button
                type="submit"
                kind="create"
                disabled={loading || (field.touched && !field.valid) || savedLabel === field.value}
                className={locals.button}
              >
                {t('in-websites:websiteDashboard.tabs.configuration.configurationRenameButton')}
              </Button>
              {this.state.saveResult != null ? (
                <TemporaryPresenter duration={5000} id={`${this.state.saveResult}`}>
                  <SvgIcon type="lib_check" size="s" className={locals.successIcon} />{' '}
                  <span className={locals.sucessLabel}>Saved</span>
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
      </Card>
    );
  }
}
