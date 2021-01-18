import { get } from 'lodash';
import rpt from 'prop-types';
import React from 'react';

import { availabilityType, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import { trackSliDeleted } from 'in-custom-dashboards/widgets/Slo/tracker';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import getApplication from 'in-subscription/application/getApplication';
import { deleteSliConfiguration } from 'in-custom-dashboards/api';
import KeyValue from 'in-new-components/lists/KeyValue';
import { isLoading } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';
import WithIcon from 'in-new-components/WithIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from 'in-custom-dashboards/widgets/Slo/sli/SliManageList.mless';

export default function SliList(props) {
  const result = useObservable(props.getItems, [props.getItems]);
  return (
    <ServerTablePresenter
      getRowProps={getRowProps}
      orderDirection="ASC"
      cardTitle="Service Level Indicators"
      {...props}
      result={result}
      onRowClick={role.canConfigureServiceLevelIndicators ? props.selectSli : undefined}
      numSkeletonRows={3}
      isSearchable
      columnDefinitions={columnDefinitions}
      deleteSli={deleteSliConfig}
    />
  );
}

SliList.propTypes = {
  getItems: rpt.func.isRequired,
  rightHeader: rpt.node,
  selectSli: rpt.func.isRequired,
  onChange: rpt.func.isRequired,
  query: rpt.string,
  EmptyStateComponent: rpt.func
};

const deleteSliConfig = id => {
  deleteSliConfiguration(id).once(
    result => {
      if (isLoading(result)) {
        return;
      }
      addMessage(
        {
          type: 'info',
          timeout: 2000,
          content: 'SLI configuration was successfully deleted.'
        },
        'custom-dashboard-info'
      );
    },
    () => {
      addMessage(
        {
          type: 'danger',
          timeout: 3000,
          content: 'Failed to delete the sli.'
        },
        'custom-dashboard-error'
      );
    }
  );
};
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
    width: 20,
    getContent(item) {
      const metric = metricConfiguration => {
        if (metricConfiguration) {
          const { metricName, metricAggregation } = metricConfiguration;
          return metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
        }
        return valueMissingPlaceholder;
      };
      const value = item => {
        if (item.sliEntity?.sliType === applicationType) {
          return 'Time-based, ' + (item?.metricConfiguration && metric(item.metricConfiguration));
        } else if (item.sliEntity?.sliType === availabilityType) {
          return 'Event-based';
        } else {
          return '';
        }
      };
      return (item && value(item)) ?? valueMissingPlaceholder;
    }
  },
  {
    id: 'view',
    sortable: false,
    width: '1',
    getContent(item, { selectSli }) {
      if (
        !role.canConfigureServiceLevelIndicators ||
        (!isQB2ModeEnabled && item.sliEntity.sliType === 'availability' && !item.convertedTagFilterExpression)
      ) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content="View/Clone SLI Configuration">
            <SvgIcon type="lib_actions_edit" className={locals.iconButton} onClick={() => selectSli(item)} />
          </Tooltip>
        </div>
      );
    }
  },
  {
    id: 'delete',
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
              className={locals.iconButton}
              onClick={() => {
                addActiveDialog(
                  <ConfirmationDialog
                    header="Please Confirm"
                    description={
                      <span>
                        Are you sure you want to delete <strong>{item.sliName}</strong>?
                      </span>
                    }
                    confirmButtonLabel="Delete"
                    onSubmit={() => {
                      close();
                      deleteSliConfig(item.id);
                      trackSliDeleted();
                    }}
                  />
                );
              }}
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
      applicationId={item.sliEntity?.applicationId}
      serviceId={item.sliEntity?.serviceId}
      endpointId={item.sliEntity?.endpointId}
    />
  );
}

function Labels({ serviceId, endpointId, applicationId, sliName }) {
  const applicationLabel = useObservable(() => applicationId && getApplication({ id: applicationId }).map(getLabel), [
    applicationId
  ]);
  const serviceLabel = useObservable(() => serviceId && getServiceLabel({ id: serviceId }).map(getLabel), [serviceId]);
  const endpointLabel = useObservable(() => endpointId && getEndpointInfo({ id: endpointId }).map(getLabel), [
    endpointId
  ]);

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
