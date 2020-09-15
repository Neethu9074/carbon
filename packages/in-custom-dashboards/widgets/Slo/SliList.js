import { compose, setPropTypes } from 'recompose';
import { get } from 'lodash';
import rpt from 'prop-types';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import getApplication from 'in-subscription/application/getApplication';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { deleteSliConfiguration } from 'in-custom-dashboards/api';
import KeyValue from 'in-new-components/lists/KeyValue';
import { alwaysNull } from 'in-services/fixedStreams';
import WithIcon from 'in-new-components/WithIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from 'in-custom-dashboards/widgets/Slo/SliManageList.mless';

export default compose(
  setPropTypes({
    getItems: rpt.func.isRequired,
    rightHeader: rpt.node,
    selectSli: rpt.func.isRequired,
    onChange: rpt.func.isRequired,
    query: rpt.string,
    EmptyStateComponent: rpt.func
  }),
  connectTo(({ getItems }) => ({
    result: getItems()
  }))
)(SliList);

function SliList(props) {
  return (
    <ServerTablePresenter
      getRowProps={getRowProps}
      orderDirection="ASC"
      cardTitle="Service Level Indicators"
      {...props}
      numSkeletonRows={3}
      isSearchable
      columnDefinitions={columnDefinitions}
      renderNoDataAvailable={() => NoDataAvailable}
    />
  );
}
const getRowProps = () => {
  return {
    size: 'compact'
  };
};

const columnDefinitions = [
  {
    id: 'name',
    sortable: false,
    label: 'Name',
    getContent(item) {
      return (
        <WithIcon iconColor={theme.lib.colors.N500} icon={getIcon(item)} className={locals.withIcon}>
          {getSliNameWithSubscript(item)}
        </WithIcon>
      );
    }
  },
  {
    id: 'metric',
    sortable: false,
    label: 'SLI Type',
    getContent(item) {
      const metric = metricConfiguration => {
        if (metricConfiguration) {
          const { metricName, metricAggregation } = metricConfiguration;
          return metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
        }
        return valueMissingPlaceholder;
      };
      const value = item => {
        if (item.sliEntity?.sliType === 'application') {
          return 'Time-based, ' + (item?.metricConfiguration && metric(item.metricConfiguration));
        } else if (item.sliEntity?.sliType === 'availability') {
          return 'Event-based';
        } else {
          return '';
        }
      };
      return (item && value(item)) ?? valueMissingPlaceholder;
    }
  },
  {
    sortable: false,
    width: '1',
    getContent(item, { selectSli }) {
      if (!role.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content="View/Clone SLI Configuration">
            <SvgIcon type="lib_actions_edit" color="rgb(0,152,232)" onClick={() => selectSli(item)} />
          </Tooltip>
        </div>
      );
    }
  },
  {
    sortable: false,
    width: '1',
    getContent(item) {
      if (!role.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content="Delete SLI Configuration">
            <SvgIcon
              type="lib_actions_delete"
              color="rgb(0,152,232)"
              onClick={() =>
                deleteSliConfiguration(item.id).subscribe(result => {
                  if (result.progress.loading) {
                    return;
                  }
                  if (result.errors.length > 0) {
                    addMessage(
                      {
                        type: 'danger',
                        timeout: 3000,
                        content: 'Failed to delete the sli.'
                      },
                      'custom-dashboard-error'
                    );
                  } else {
                    addMessage(
                      {
                        type: 'info',
                        timeout: 2000,
                        content: 'SLI configuration was successfully deleted.'
                      },
                      'custom-dashboard-info'
                    );
                  }
                })
              }
            />
          </Tooltip>
        </div>
      );
    }
  }
];

function getIcon(item) {
  if (item?.sliEntity?.endpointId) {
    return 'lib_application_endpoint';
  } else if (item?.sliEntity?.serviceId) {
    return 'lib_application_service';
  }
  return 'lib_application';
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getSliNameWithSubscript(item) {
  return (
    <Labels
      sliName={item.sliName}
      applicationId={item?.sliEntity?.applicationId}
      serviceId={item?.sliEntity?.serviceId}
      endpointId={item?.sliEntity?.endpointId}
    />
  );
}

const Labels = connectTo(
  props => {
    return {
      applicationLabel: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : alwaysNull,
      serviceLabel: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : alwaysNull,
      endpointLabel: props.endpointId ? getEndpointInfo({ id: props.endpointId }).map(getLabel) : alwaysNull
    };
  },
  function Labels({ ...props }) {
    const { serviceLabel, endpointLabel, applicationLabel, sliName } = props;
    let subscript = '';
    if (applicationLabel) {
      subscript = subscript + applicationLabel;
    }
    if (serviceLabel) {
      subscript = `${subscript} > ${serviceLabel}`;
    }
    if (endpointLabel) {
      subscript = `${subscript} > ${endpointLabel}`;
    }
    return <KeyValue label={subscript} value={sliName} className={locals.nameColumn} />;
  }
);
