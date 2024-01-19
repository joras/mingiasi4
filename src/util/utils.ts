export function sumByField<T, K extends keyof T>(
  items: T[],
  field: K extends any ? (T[K] extends number ? K : never) : never,
): number {
  return items.reduce((acc, item) => {
    const value = item[field];
    return acc + Number(value);
  }, 0);
}

export function sum(array: number[]): number {
  return array.reduce((acc, num) => acc + num, 0);
}
