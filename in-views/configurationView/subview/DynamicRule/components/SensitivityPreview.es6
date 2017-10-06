import React from 'react';

import SensitivityDefaultChart from 'in-views/configurationView/subview/DynamicRule/components/SensitivityDefaultChart';
import { evaluateClassNames } from 'in-services/util/classnames';
import Table from 'in-sdk/components/dashboard/Table';

import './SensitivityPreview.less';

const block = 'in-dynamic-rule-dialog-sensitivity-preview';

export default class extends React.Component {
  static displayName = 'SensitivityPreview';

  state = {
    activeTab: 'generic'
  };

  render() {
    const entities = this.props.form.get('matchingEntities').value;
    const buttonElement = `${block}__button`;
    return (
      <div className={block}>
        <div className={`${block}__button-group`}>
          <div
            className={evaluateClassNames({
              [buttonElement]: true,
              [`${buttonElement}__left`]: true,
              [`${buttonElement}__active`]: this.state.activeTab === 'generic'
            })}
            onClick={() => this.setState({ activeTab: 'generic' })}
          >
            Generic Preview
          </div>
          <div
            className={evaluateClassNames({
              [buttonElement]: true,
              [`${buttonElement}__right`]: true,
              [`${buttonElement}__active`]: this.state.activeTab === 'entities'
            })}
            onClick={() => this.setState({ activeTab: 'entities' })}
          >{`Entities ${entities && entities.snapshots ? '(' + entities.snapshots.length + ')' : ''}`}</div>
        </div>
        {this.state.activeTab === 'entities' ? (
          <EntityTable form={this.props.form} getRowDetails={getRowDetails} />
        ) : (
          this.props.form.get('sensitivity').map(field => <SensitivityDefaultChart sensitivity={field.value} />)
        )}
      </div>
    );
  }
}

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
      }
    }
  }
];

function EntityTable({ form, getRowDetails }) {
  const matchingEntities = form.get('matchingEntities').map(field => field.value);
  let rows;
  if (matchingEntities && matchingEntities.snapshots) {
    rows = matchingEntities.snapshots
      .map(snapshot => {
        return {
          key: snapshot.get('id'),
          snapshot,
          isExcluded: form.get('excludedSnapshotIds').value.indexOf(snapshot.get('id')) >= 0
        };
      })
      .filter(row => !row.isExcluded);
  } else {
    rows = [];
  }

  return <Table cols={cols} rows={rows} maxItemsPerPage={10} getRowDetails={getRowDetails} />;
}

function getRowDetails() {
  return <div>hjsdfk</div>;
}
