export function includesIgnoreCase(items: string[], text: string | undefined) {
  const txt = text?.toLowerCase() || "";
  for (let item of items) {
    if (item.toLowerCase() === txt) {
      return true;
    }
  }
  return false;
}

export function waitFor(ms: number) {
  return new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}
