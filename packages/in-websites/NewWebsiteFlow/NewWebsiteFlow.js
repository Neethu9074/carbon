import { createField, notBlankValidator } from 'formalistic';
import { interval } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import getWebsite from 'in-subscription/websiteMonitoring/getWebsite';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import InputStep from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStep from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStep from 'in-websites/NewWebsiteFlow/WaitStep';
import { combineDataAndError } from 'in-services/util/ro';
import { addWebsite } from 'in-websites/tracker';
import { addKey } from 'in-api/eumKeys';

export default class NewWebsiteFlow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      field: createField({ value: '', validator: notBlankValidator }),
      saveError: null,
      saveResult: null,
      loading: false
    };
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

    addWebsite({
      websiteName: field.value
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
          saveResult: data,
          website: null,
          websiteId: data.id,
          websiteName: field.value
        });

        this.websiteSubscription = interval(5000)
          .flatMap(millis =>
            getWebsite({
              id: data.id,

              // to break websocket subscription caching
              cacheBreaker: millis
            })
          )
          .filter(result => result.data)
          .once(website => this.setState({ website }));
      }
    });
  };

  componentWillUnmount() {
    if (this.saveSubscription) {
      this.saveSubscription.dispose();
    }
    if (this.websiteSubscription) {
      this.websiteSubscription.dispose();
    }
  }

  render() {
    const { websiteId, website } = this.state;
    if (!websiteId) {
      return <InputStep {...this.state} onChange={this.onChange} onSubmit={this.onSubmit} />;
    }

    if (!website) {
      return <WaitStep {...this.state} />;
    }

    return (
      <ReadyStep
        {...this.state}
        websiteLink$={getLinkToWebsite(websiteId, {
          timeConfig: getWaitForEntityCreationTimeConfig()
        })}
      />
    );
  }
}
