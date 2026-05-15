export class FetchFreezeError extends Error {
  constructor(message: string, readonly code = 'FETCHFREEZE_ERROR') {
    super(message);
    this.name = 'FetchFreezeError';
  }
}

export function assertSafeRelativePath(path: string): void {
  if (!path || path.startsWith('/') || path.includes('..') || path.includes('\\')) {
    throw new FetchFreezeError(`Refusing unsafe fixture path: ${path}`, 'UNSAFE_PATH');
  }
}
