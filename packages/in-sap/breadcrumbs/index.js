/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SapDbInstanceHomeViewBreadcrumb from 'in-sap/breadcrumbs/SapDbInstanceHomeViewBreadcrumb';
import AbapInstanceHomeViewBreadcrumb from 'in-sap/breadcrumbs/AbapInstanceHomeViewBreadcrumb';
import SapAbapSystemSensorBreadcrumb from 'in-sap/breadcrumbs/SapAbapSystemSensorBreadcrumb';
import SapJavaNetWeaverSystemSensorBreadcrumb from 'in-sap/breadcrumbs/SapJavaNetWeaverSystemSensorBreadcrumb';
import AbapSystemHomeViewBreadcrumb from 'in-sap/breadcrumbs/AbapSystemHomeViewBreadcrumb';
import RelatedResourcesBreadcrumbs from 'in-sap/breadcrumbs/RelatedResourcesBreadcrumbs';
import SapWebDispatcherBreadcrumb from 'in-sap/breadcrumbs/SapWebDispatcherBreadcrumb';
import SapDbInstanceBreadcrumb from 'in-sap/breadcrumbs/SapDbInstanceBreadcrumb';
import SapHanaSystemBreadcrumb from 'in-sap/breadcrumbs/SapHanaSystemBreadcrumb';
import SapAbapSensorBreadcrumb from 'in-sap/breadcrumbs/SapAbapSensorBreadcrumb';
import SapJavaNetWeaverSensorBreadcrumb from 'in-sap/breadcrumbs/SapJavaNetWeaverSensorBreadcrumb';
import JavaInstanceBreadcrumb from 'in-sap/breadcrumbs/JavaInstanceBreadcrumb';
import AbapInstanceBreadcrumb from 'in-sap/breadcrumbs/AbapInstanceBreadcrumb';
import SapDbTenantBreadcrumb from 'in-sap/breadcrumbs/SapDbTenantBreadcrumb';
import AbapSystemBreadcrumb from 'in-sap/breadcrumbs/AbapSystemBreadcrumb';
import JavaSystemBreadcrumb from 'in-sap/breadcrumbs/JavaSystemBreadcrumb';
import SapDbmsBreadcrumb from 'in-sap/breadcrumbs/SapDbmsBreadcrumb';
import HanaBreadcrumb from 'in-sap/breadcrumbs/HanaBreadcrumb';

export function AbapInstanceBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;

  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapInstanceHomeViewBreadcrumb />, hostId && <AbapInstanceBreadcrumb {...props} />];
  }
}

export function SapAbapSystemSensorBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <SapAbapSystemSensorBreadcrumb {...props} />];
  }
}

export function SapJavaNetWeaverSystemSensorBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <SapJavaNetWeaverSystemSensorBreadcrumb {...props} />];
  }
}

export function SapJavaInstanceBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapInstanceHomeViewBreadcrumb />, hostId && <JavaInstanceBreadcrumb {...props} />];
  }
}

export function AbapSystemBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <AbapSystemBreadcrumb {...props} />];
  }
}

export function JavaSystemBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <JavaSystemBreadcrumb {...props} />];
  }
}

export function SapHanaSystemBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <SapHanaSystemBreadcrumb {...props} />];
  }
}

export function SapWebDispatcherBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapSystemHomeViewBreadcrumb />, hostId && <SapWebDispatcherBreadcrumb {...props} />];
  }
}

export function SapAbapSensorBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapInstanceHomeViewBreadcrumb />, hostId && <SapAbapSensorBreadcrumb {...props} />];
  }
}

export function SapJavaNetWeaverSensorBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<AbapInstanceHomeViewBreadcrumb />, hostId && <SapJavaNetWeaverSensorBreadcrumb {...props} />];
  }
}

export function SapDbmsBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<SapDbInstanceHomeViewBreadcrumb />, hostId && <SapDbmsBreadcrumb {...props} />];
  }
}

export function SapDbInstanceBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<SapDbInstanceHomeViewBreadcrumb />, hostId && <SapDbInstanceBreadcrumb {...props} />];
  }
}

export function SapDbTenantBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<SapDbInstanceHomeViewBreadcrumb />, hostId && <SapDbTenantBreadcrumb {...props} />];
  }
}

export function SapHanaBreadcrumbs(props) {
  const { hostId, systemPrefix } = props;
  if (systemPrefix) {
    return RelatedResourcesBreadcrumbs(props);
  } else {
    return [<SapDbInstanceHomeViewBreadcrumb />, hostId && <HanaBreadcrumb {...props} />];
  }
}
