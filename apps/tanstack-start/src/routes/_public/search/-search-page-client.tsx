"use client";

import dynamic from "next/dynamic";
import Grid from "@/components/theme/ui/grid/Grid";
import NotFound from "@/components/theme/search/not-found";
import { isArray } from "@/utils/type-guards";
import { GET_FILTER_PRODUCTS, GET_PRODUCTS, GET_PRODUCTS_PAGINATION } from "@/graphql";
import SortOrder from "@/components/theme/filters/SortOrder";
import { SortByFields } from "@/utils/constants";
import MobileFilter from "@/components/theme/filters/MobileFilter";
import FilterList from "@/components/theme/filters/FilterList";
import { MobileSearchBar } from "@components/layout/navbar/MobileSearch";
import {
  buildProductFilters,
  getFilterAttributes,
} from "@/utils/helper";
import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import type { ProductsResponse } from "@/components/catalog/type";
import { graphqlRequestNoCache } from "@/graphql";

const Pagination = dynamic(() => import("@/components/catalog/Pagination"));
const ProductGridItems = dynamic(
  () => import("@/components/catalog/product/ProductGridItems"),
);

export function SearchPageClient() {
  const params = useSearch({ strict: false }) as Record<string, string>;
  const [products, setProducts] = useState<ProductsResponse["products"] | null>(
    null,
  );
  const [filterAttributes, setFilterAttributes] = useState<
    Awaited<ReturnType<typeof getFilterAttributes>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const searchValue = params.q;
      const itemsPerPage = 12;
      const currentPage = params.page ? parseInt(params.page, 10) - 1 : 0;
      const sortValue = params.sort || "name-asc";
      const selectedSort =
        SortByFields.find((s) => s.key === sortValue) || SortByFields[0];
      const afterCursor = params.cursor;
      const beforeCursor = params.before;
      const { filterInput, isFilterApplied } = buildProductFilters(params);

      try {
        let data: ProductsResponse | undefined;
        if (isFilterApplied) {
          data = await graphqlRequestNoCache<ProductsResponse>(
            GET_FILTER_PRODUCTS,
            {
              query: searchValue,
              filter: filterInput,
              ...(beforeCursor
                ? { last: itemsPerPage, before: beforeCursor }
                : { first: itemsPerPage, after: afterCursor }),
              sortKey: selectedSort.sortKey,
              reverse: selectedSort.reverse,
            },
          );
        } else {
          let currentAfterCursor = afterCursor;
          if (currentPage > 0 && !afterCursor) {
            const cursorData = await graphqlRequestNoCache<ProductsResponse>(
              GET_PRODUCTS_PAGINATION,
              {
                query: searchValue,
                first: currentPage * itemsPerPage,
                sortKey: selectedSort.sortKey,
                reverse: selectedSort.reverse,
              },
            );
            currentAfterCursor = cursorData?.products?.pageInfo?.endCursor;
          }
          data = await graphqlRequestNoCache<ProductsResponse>(GET_PRODUCTS, {
            query: searchValue,
            ...(beforeCursor
              ? { last: itemsPerPage, before: beforeCursor }
              : { first: itemsPerPage, after: currentAfterCursor }),
            sortKey: selectedSort.sortKey,
            reverse: selectedSort.reverse,
          });
        }

        const attrs = await getFilterAttributes();
        if (!cancelled) {
          setProducts(data?.products ?? null);
          setFilterAttributes(attrs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return <p className="p-8 text-center">Loading products…</p>;
  }

  const productNodes = products?.edges?.map((e) => e.node) || [];
  const pageInfo = products?.pageInfo;
  const totalCount = products?.totalCount ?? 0;
  const itemsPerPage = 12;
  const currentPage = params.page ? parseInt(params.page, 10) - 1 : 0;
  const searchValue = params.q;
  const { isFilterApplied } = buildProductFilters(params);

  return (
    <>
      <MobileSearchBar />
      <h2 className="text-2xl sm:text-4xl font-semibold mx-auto mt-7.5 w-full max-w-screen-2xl my-3 mx-auto px-4 xss:px-7.5">
        All Top Products
      </h2>
      <div className="my-10 hidden gap-4 md:flex md:items-baseline md:justify-between w-full mx-auto max-w-screen-2xl px-4 xss:px-7.5">
        <FilterList filterAttributes={filterAttributes} />
        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>
      <div className="flex items-center justify-between gap-4 py-8 md:hidden  mx-auto w-full max-w-screen-2xl px-4 xss:px-7.5">
        <MobileFilter filterAttributes={filterAttributes} />
        <SortOrder sortOrders={SortByFields} title="Sort by" />
      </div>
      {!isArray(productNodes) && (
        <NotFound
          msg={`${
            searchValue
              ? `There are no products that match Showing : ${searchValue}`
              : "There are no products that match Showing"
          } `}
        />
      )}
      {isArray(productNodes) ? (
        <Grid className="grid grid-flow-row grid-cols-2 gap-5 lg:gap-11.5 w-full max-w-screen-2xl mx-auto md:grid-cols-3 lg:grid-cols-4 px-4 xss:px-7.5">
          <ProductGridItems products={productNodes} />
        </Grid>
      ) : null}
      {!isFilterApplied && isArray(productNodes) && totalCount > itemsPerPage && (
        <nav
          aria-label="Collection pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
            prevCursor={pageInfo?.startCursor}
          />
        </nav>
      )}
      {isFilterApplied && isArray(productNodes) && pageInfo?.hasNextPage && (
        <nav
          aria-label="Filtered pagination"
          className="my-10 block items-center sm:flex"
        >
          <Pagination
            itemsPerPage={itemsPerPage}
            itemsTotal={totalCount}
            currentPage={currentPage}
            nextCursor={pageInfo?.endCursor}
            prevCursor={pageInfo?.startCursor}
          />
        </nav>
      )}
    </>
  );
}
