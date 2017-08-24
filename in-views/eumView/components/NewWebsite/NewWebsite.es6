import { createField, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { eumKeysViewLink$ } from 'in-stores/navigation/configuration';
import Waiting from 'in-views/eumView/components/NewWebsite/Waiting';
import From from 'in-views/eumView/components/NewWebsite/Form';
import { combineDataAndError } from 'in-services/util/ro';
import { addKey } from 'in-services/api/eumKeys';
import connectTo from 'in-hoc/connectTo';

import './NewWebsite.less';

const block = 'in-new-website';

export default connectTo(
  { eumKeysViewLink: eumKeysViewLink$ },
  class NewWebsite extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        field: createField({ value: '', validator: notBlankValidator }),
        saveError: null,
        saveResult: {
          appName: 'spiegel.de',
          id: '12345678987654323456'
        },
        loading: false
      };
    }

    componentWillUnmount() {
      if (this.saveSubscription) {
        this.saveSubscription.dispose();
      }
    }

    render() {
      return (
        <FullscreenOverlayView>
          <div className={block}>
            {this.state.saveResult == null
              ? <From
                  field={this.state.field}
                  loading={this.state.loading}
                  saveError={this.state.saveError}
                  onChange={this.onChange}
                  onSubmit={this.onSubmit}
                />
              : null}
            {this.state.saveResult != null
              ? <Waiting websiteName={this.state.saveResult.appName} eumKey={this.state.saveResult.id} />
              : null}
          </div>
        </FullscreenOverlayView>
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
        saveError: null
      });

      this.saveSubscription = combineDataAndError(addKey(field.value)).once(({ data, error }) => {
        if (error) {
          this.setState({
            loading: false,
            saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
          });
        } else {
          this.setState({
            loading: false,
            saveError: null,
            saveResult: data
          });
        }
      });
    };
  }
);
