export function includesIgnoreCase(items, text) {
  const txt = text.toLowerCase();
  for (let item of items) {
    if (item.toLowerCase() === txt) {
      return true;
    }
  }
  return false;
}

export function waitFor(ms) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}
