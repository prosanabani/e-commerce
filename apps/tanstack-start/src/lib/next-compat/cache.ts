export function revalidatePath(_path: string, _type?: "layout" | "page") {
  return undefined;
}

export function revalidateTag(_tag: string) {
  return undefined;
}

export function unstable_cache<T>(
  fn: () => Promise<T>,
  _keyParts?: string[],
  _options?: { revalidate?: number | false; tags?: string[] },
): () => Promise<T> {
  return fn;
}
