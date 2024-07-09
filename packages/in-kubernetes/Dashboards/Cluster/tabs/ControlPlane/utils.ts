/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { KubernetesAnnotation } from 'in-types';

export interface InfosProps {
  [key: string]: string;
}

export function getItem(itemKey: string, items: KubernetesAnnotation[]): KubernetesAnnotation | undefined {
  if (!items || !itemKey) {
    return;
  }
  return items.find(({ key }: KubernetesAnnotation) => key == itemKey);
}

export function getKeyValueObjectAsArray(infos: InfosProps | undefined): { key: string; value: string }[] {
  if (!infos) {
    return [];
  }

  return Object.keys(infos).map(key => ({ key, value: infos[key] }));
}
