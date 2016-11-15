/*::
export type Key = string | number;
export type NormalizedPath = Array<Key>;
export type Path = Array<Key> | Key;
export type Value = string | number | boolean;
export type ValidationError = ?string;
export type Validator = Value => ValidationError;

export interface Item {
  setValue(path: Path, value: Value, i: number): Item;
  addItem(path: Path, item: Item , i: number);
  getItem(path: Path, i: number): Item;
  removeItem(path: Path, i: number): Item;
  valid: boolean;
  pristine: boolean;
  error: ValidationError;
}

*/
