export default function flatMap(flatMapper) {
  return this.transform({
    transform: flatMapper
  });
}
