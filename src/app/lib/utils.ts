export function startsWith(str: string, prefix: string): boolean {
  const lowerStr = str.toLowerCase();
  const lowerPrefix = prefix.toLowerCase();

  if (lowerPrefix.length > lowerStr.length) {
    return false;
  }

  for (let i = 0; i < lowerPrefix.length; i++) {
    if (lowerStr[i] !== lowerPrefix[i]) {
      return false;
    }
  }

  return true;
}
