import { createField, notBlankValidator } from 'formalistic';
import { interval } from '@instana/observables';
import { get } from 'lodash';
import React from 'react';

import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import { addWebsite as addWebsiteTracker } from 'in-websites/tracker';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import InputStep from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStep from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStep from 'in-websites/NewWebsiteFlow/WaitStep';
import { combineDataAndError } from 'in-services/util/ro';
import { addWebsite } from 'in-websites/api/websites';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default class NewWebsiteFlow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      field: createField({ value: '', validator: notBlankValidator }),
      saveError: null,
      saveResult: null,
      loading: false,
      trackSessions: true
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

    addWebsiteTracker({
      websiteName: field.value
    });

    this.saveSubscription = combineDataAndError(addWebsite(field.value)).once(({ data, error }) => {
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

  setTrackSessions = trackSessions => this.setState({ trackSessions });

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
    let content;
    if (!websiteId) {
      content = <InputStep {...this.state} onChange={this.onChange} onSubmit={this.onSubmit} />;
    } else if (!website) {
      content = <WaitStep {...this.state} setTrackSessions={this.setTrackSessions} />;
    } else {
      content = (
        <ReadyStep
          {...this.state}
          setTrackSessions={this.setTrackSessions}
          websiteLink$={getLinkToWebsite(websiteId, {
            timeConfig: getWaitForEntityCreationTimeConfig()
          })}
        />
      );
    }

    return (
      <Sticky header={<ViewSwitcher isWebsites />}>
        <Title title="New Website" />
        {content}
        <Footer />
      </Sticky>
    );
  }
}
