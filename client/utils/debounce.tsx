export default function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 1500,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
