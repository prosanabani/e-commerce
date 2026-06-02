import {
  Link as TanStackLink,
  type LinkProps as TanStackLinkProps,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

export default function Link({
  href,
  children,
  className,
  replace,
  ...rest
}: NextLinkProps) {
  const to = href as TanStackLinkProps["to"];
  return (
    <TanStackLink
      to={to}
      className={className}
      replace={replace}
      {...(rest as object)}
    >
      {children}
    </TanStackLink>
  );
}
