export function enumToKeyValueArray<T extends object>(
  enumObj: T,
  descricao?: Record<keyof T, string>
): { key: keyof T; value: string }[] {
  return Object.keys(enumObj).map((key) => ({
    key: key as keyof T,
    value: descricao ? descricao[key as keyof T] : (enumObj[key as keyof T] as string)
  }));
}