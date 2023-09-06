/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item, MapForm } from 'formalistic';
import React, { ReactNode } from 'react';

//@ts-expect-error
import TriggersIncidentRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/TriggersIncidentRow';
import AlertDescriptionRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertDescriptionRow';
import AlertLevelRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertLevelRow';
import Sections from 'in-components/workspace/Sections';

interface AlertPropertiesProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  renderAlertPropertiesTitleRow: () => ReactNode;
}

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  onChange,
  renderAlertPropertiesTitleRow
}: AlertPropertiesProps): JSX.Element {
  return (
    <Sections>
      {renderAlertPropertiesTitleRow()}
      <AlertLevelRow onChange={onChange} form={form} />
      <TriggersIncidentRow form={form} onChange={onChange} />
      <AlertDescriptionRow form={form} getDescriptionPlaceholder={getDescriptionPlaceholder} onChange={onChange} />
    </Sections>
  );
}
