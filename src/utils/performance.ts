/**
 * Throttle function that limits the rate at which a function can fire
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: void;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
}

/**
 * Request animation frame wrapper for smooth animations
 * @param callback - The callback to execute on next frame
 * @returns The request ID
 */
export function requestFrame(callback: () => void): number {
  return requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 * @param id - The request ID to cancel
 */
export function cancelFrame(id: number): void {
  cancelAnimationFrame(id);
}
