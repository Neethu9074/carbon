/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useRef, useState } from 'react';

type AddItemsFunction<ITEM_TYPE> = (newItems: Array<ITEM_TYPE>) => void;
type ResetItemsFunction = () => void;

/**
 * This hook can be used to store references to specific elements in child
 * components and return a counter for unique elements in the reference-set.
 * Warning: The reset function intentionally does NOT cause an state update.
 **/
export default function useChildUniqueItemCount<ITEM_TYPE>(): [
  number,
  AddItemsFunction<ITEM_TYPE>,
  ResetItemsFunction
] {
  const itemsRef = useRef<Set<ITEM_TYPE>>(new Set());
  const [itemCount, setItemCount] = useState<number>(0);

  function addItems(newItems: Array<ITEM_TYPE>) {
    itemsRef.current = new Set([...Array.from(itemsRef.current), ...newItems]);
    setItemCount(Array.from(itemsRef.current).length);
  }

  function resetItems() {
    itemsRef.current = new Set();
  }

  return [itemCount, addItems, resetItems];
}
