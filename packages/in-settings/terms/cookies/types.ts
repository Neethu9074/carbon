/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

export interface ExpandableCookieListProps {
  form: MapForm<any>;
  onChange: (form: MapForm<any>, fieldName: string, value: string | boolean) => void;
}

export interface ExpandableListItemProps {
  cookie: ExpandableListItemDetailsProps;
}

interface ExpandableListItemDetailsProps {
  description: string;
  details: Details[];
  key: string;
  title: string;
}
interface Details {
  category: string;
  moreInformation: string;
  name: string;
  purpose: string;
}

export interface ListItemProps {
  tool: ListItemDetailsProps;
}

interface ListItemDetailsProps {
  description: string;
  key: string;
  title: string;
}

export interface CookieColumnDefinitionProps {
  form: MapForm<any>;
  cookie: ExpandableListItemDetailsProps;
  onChange: (form: MapForm<any>, fieldName: string, value: string | boolean) => void;
}

export interface ToolColumnDefinitionProps {
  form: MapForm<any>;
  tool: ListItemDetailsProps;
  onChange: (form: MapForm<any>, fieldName: string, value: string | boolean) => void;
}
