import { createField, notBlankValidator } from 'formalistic';
import { interval } from '@instana/observables';
import { get } from 'lodash';
import React from 'react';

import { addMobileApp as addMobileAppTracker } from 'in-mobile-apps/tracker';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import InputStep from 'in-mobile-apps/NewMobileAppFlow/InputStep';
import ReadyStep from 'in-mobile-apps/NewMobileAppFlow/ReadyStep';
import WaitStep from 'in-mobile-apps/NewMobileAppFlow/WaitStep';
import { addMobileApp } from 'in-mobile-apps/api/mobileApps';
import { combineDataAndError } from 'in-services/util/ro';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default class NewMobileAppFlow extends React.PureComponent {
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

    addMobileAppTracker({
      mobileAppName: field.value
    });

    this.saveSubscription = combineDataAndError(addMobileApp(field.value)).once(({ data, error }) => {
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
          mobileApp: null,
          mobileAppId: data.id,
          mobileAppName: field.value
        });

        this.mobileAppSubscription = interval(5000)
          .flatMap(millis =>
            getMobileApp({
              id: data.id,

              // to break websocket subscription caching
              cacheBreaker: millis
            })
          )
          .filter(result => result.data)
          .once(mobileApp => this.setState({ mobileApp }));
      }
    });
  };

  componentWillUnmount() {
    if (this.saveSubscription) {
      this.saveSubscription.dispose();
    }
    if (this.mobileAppSubscription) {
      this.mobileAppSubscription.dispose();
    }
  }

  render() {
    const { mobileAppId, mobileApp } = this.state;
    let content;
    if (!mobileAppId) {
      content = <InputStep {...this.state} onChange={this.onChange} onSubmit={this.onSubmit} />;
    } else if (!mobileApp) {
      content = <WaitStep {...this.state} />;
    } else {
      content = (
        <ReadyStep
          {...this.state}
          mobileAppLink$={getLinkToMobileApp(mobileAppId, {
            timeConfig: getWaitForEntityCreationTimeConfig()
          })}
        />
      );
    }

    return (
      <Sticky header={<ViewSwitcher />}>
        <Title title="New Mobile App" />
        {content}
        <Footer />
      </Sticky>
    );
  }
}
