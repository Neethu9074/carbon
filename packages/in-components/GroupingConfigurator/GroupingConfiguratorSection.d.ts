/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Group } from '@instana/types';

interface GroupingConfiguratorSectionProps {
  value: unknown;
  tagFilterExpression: unknown;
  tagCatalog?: TagCatalog;
  GroupingConfigurator: unknown;
  onChange: unknown;
  tracking: Record<string, (group: Group) => void>;
  actions?: unknown;
  additionalContent?: unknown;
  withoutIcon?: boolean;
  withOptionalMarker?: boolean;
  hasError?: boolean;
  fixOverlayLeftAlignment?: boolean;
  additionalGetTagCatalogProps?: any;
  SectionWrapper?: React.FunctionComponent<any>;
}
declare const GroupingConfiguratorSection = (props: GroupingConfiguratorSectionProps) => JSX.Element;

export default GroupingConfiguratorSection;
