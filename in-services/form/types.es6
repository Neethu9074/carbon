/*::
export type Key = string | number;
export type NormalizedPath = Array<Key>;
export type Path = Array<Key> | Key;
export type Value = string | number | boolean;
export type ValidationError = ?string;
export type Validator = Value => ValidationError;
export type Mapper = (Item, Key) => any;
export type Consumer = (Item, Key) => any;

export interface Item {
  valid: boolean;
  pristine: boolean;
  error: ValidationError;

  setValue(path: Path, value: Value, i: number): Item;
  addItem(path: Path, item: Item , i: number);
  getItem(path: Path, i: number): Item;
  removeItem(path: Path, i: number): Item;
  moveUp(path: Path): ListForm;
  moveDown(path: Path): ListForm;
  _move(path: Path, positionModification: number);
}

*/
