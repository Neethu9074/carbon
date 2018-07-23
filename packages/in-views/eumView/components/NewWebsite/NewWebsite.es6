import { createField, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import { eumKeysView$ } from 'in-stores/navigation/paths/settingPaths';
import Waiting from 'in-views/eumView/components/NewWebsite/Waiting';
import { websitePath } from 'in-stores/navigation/paths/mainPaths';
import From from 'in-views/eumView/components/NewWebsite/Form';
import { combineDataAndError } from 'in-services/util/ro';
import LegacyView from 'in-components/LegacyView';
import { getSnapshot } from 'in-stores/snapshot';
import { addKey } from 'in-api/eumKeys';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import './NewWebsite.less';

const block = 'in-new-website';

export default connectTo(
  { eumKeysViewLink: eumKeysView$ },
  class NewWebsite extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        field: createField({ value: '', validator: notBlankValidator }),
        saveError: null,
        saveResult: null,
        loading: false
      };
    }

    componentWillUnmount() {
      if (this.saveSubscription) {
        this.saveSubscription.dispose();
      }
      if (this.snapshotSubscription) {
        this.snapshotSubscription.dispose();
      }
    }

    render() {
      return (
        <div className={block}>
          <LegacyView />
          <Title title="New Website" />

          {this.state.saveResult == null ? (
            <From
              field={this.state.field}
              loading={this.state.loading}
              saveError={this.state.saveError}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
            />
          ) : null}
          {this.state.saveResult != null ? (
            <Waiting
              websiteName={this.state.saveResult.appName}
              eumKey={this.state.saveResult.id}
              isWaiting={this.state.snapshot == null}
              href$={getDashboardLink(this.state.saveResult.websiteSnapshotId, {
                ...getWaitForEntityCreationTimeConfig(),
                pathname: `${websitePath}/dashboard`
              })}
            />
          ) : null}
        </div>
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
            saveResult: data,
            snapshot: null
          });

          this.snapshotSubscription = getSnapshot(
            data.websiteSnapshotId,
            getWaitForEntityCreationTimeConfig()
          ).subscribe(snapshot => this.setState({ snapshot }));
        }
      });
    };
  }
);
