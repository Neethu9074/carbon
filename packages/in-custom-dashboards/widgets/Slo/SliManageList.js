import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import { formatDateTime } from 'in-services/formatters/date';
import KeyValue from 'in-new-components/lists/KeyValue';
import { noop } from 'in-services/fixedObjects';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { role } from 'in-stores/user';

const createSliHeader = (true || // in storybook
  role.canConfigureObjectives) && (
  <Button
    disabled
    kind="action"
    onClick={
      noop // TODO mixpanel tracking () => applicationOpenSubmitFormTracker()
    }
    icon="lib_openclose_add"
  >
    Create SLI
  </Button>
);

const DEFAULT_API = {
  getSliConfigurations: getSliConfigurations
};

export default function SliManageList({ api = DEFAULT_API, applicationId }) {
  return (
    <SliList
      columnDefinitions={columnDefinitions}
      getItems={() => api.getSliConfigurations().map(onlyWithAPid(applicationId))}
      rightHeader={createSliHeader}
    />
  );
}

const onlyWithAPid = applicationId => {
  return sliConfigs => {
    if (isLoading(sliConfigs) || hasError(sliConfigs)) {
      return sliConfigs;
    }

    return {
      ...sliConfigs,
      data: {
        items: sliConfigs?.data?.filter(sli => sli?.sliEntity?.applicationId === applicationId) ?? []
      }
    };
  };
};

const columnDefinitions = [
  {
    sortable: false,
    width: '3rem',
    getContent() {
      return <SvgIcon type="lib_application" />;
    }
  },
  {
    sortable: false,
    label: 'Name',
    getContent(item) {
      if (item?.apConfigName) {
        return <KeyValue label={`${item?.apConfigName}`} value={item?.sliName} accentuated />;
      }
      return <KeyValue value={item?.sliName} accentuated />;
    }
  },
  {
    sortable: false,
    label: 'Metric',
    getContent(item) {
      const metric = metricConfiguration => {
        if (metricConfiguration) {
          return `${metricConfiguration.metricName} (${metricConfiguration.metricAggregation})`;
        }
        return valueMissingPlaceholder;
      };
      return (item?.metricConfiguration && metric(item.metricConfiguration)) ?? valueMissingPlaceholder;
    }
  },
  {
    sortable: false,
    label: 'First evaluation',
    getContent(item) {
      const timestamp = item?.initialEvaluationTimestamp;
      return timestamp ? (
        <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
      ) : (
        <span>{valueMissingPlaceholder}</span>
      );
    }
  },
  {
    sortable: false,
    width: '2rem',
    getContent() {
      return (
        <Tooltip content="View/Clone SLI, will come soon">
          <SvgIcon type="lib_actions_edit" color={'primary'} />
        </Tooltip>
      );
    }
  }
];
