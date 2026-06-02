import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

type DynamicOptions = {
  loading?: () => React.ReactNode;
  ssr?: boolean;
};

export default function dynamic<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  _options?: DynamicOptions,
): ComponentType<P> {
  return lazy(loader) as LazyExoticComponent<ComponentType<P>>;
}
