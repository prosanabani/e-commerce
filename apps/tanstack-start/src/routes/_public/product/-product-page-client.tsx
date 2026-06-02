"use client";

import { Suspense, useEffect, useState } from "react";
import { notFound } from "@tanstack/react-router";

import {
  ProductDetailSkeleton,
  RelatedProductSkeleton,
} from "@/components/common/skeleton/ProductSkeleton";
import HeroCarousel from "@/components/common/slider/HeroCarousel";
import { HeroCarouselShimmer } from "@components/common/slider";
import {
  BASE_SCHEMA_URL,
  baseUrl,
  getImageUrl,
  NOT_IMAGE,
  PRODUCT_TYPE,
} from "@/utils/constants";
import { GET_PRODUCT_BY_URL_KEY } from "@/graphql";
import { isArray } from "@/utils/type-guards";
import type {
  ProductData,
  ProductNode,
  ProductVariantNode,
} from "@/components/catalog/type";
import { RelatedProductsSection } from "@components/catalog/product/RelatedProductsSection";
import ProductInfo from "@components/catalog/product/ProductInfo";
import { MobileSearchBar } from "@components/layout/navbar/MobileSearch";
import { graphqlRequestNoCache } from "@/graphql";

interface VariantImage {
  baseImageUrl: string;
  name: string;
}

interface SingleProductResponse {
  product: ProductNode;
}

export function ProductPageClient({ urlKey }: { urlKey: string }) {
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await graphqlRequestNoCache<SingleProductResponse>(
          GET_PRODUCT_BY_URL_KEY,
          { urlKey },
        );
        if (!cancelled) setProduct(data?.product ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [urlKey]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    throw notFound();
  }

  const imageUrl = getImageUrl(product?.baseImageUrl, baseUrl, NOT_IMAGE);
  const productJsonLd = {
    "@context": BASE_SCHEMA_URL,
    "@type": PRODUCT_TYPE,
    name: product?.name,
    description: product?.description,
    sku: product?.sku,
  };

  const reviews = Array.isArray(product?.reviews?.edges)
    ? product.reviews.edges.map((e) => e.node)
    : [];

  const variantImages = isArray(product?.variants?.edges)
    ? product.variants.edges.map(
        (edge: { node: ProductVariantNode }) => edge.node,
      )
    : [];

  return (
    <>
      <MobileSearchBar />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="flex flex-col gap-y-4 rounded-lg pb-0 pt-4 sm:gap-y-6 md:py-7.5 lg:flex-row w-full max-w-screen-2xl mx-auto px-4 xss:px-7.5 lg:gap-8">
        <div className="h-full w-full max-w-[885px] max-1366:max-w-[650px] max-lg:max-w-full">
          <Suspense fallback={<HeroCarouselShimmer />}>
            {isArray(variantImages) ? (
              <HeroCarousel
                images={
                  (variantImages as unknown as VariantImage[])?.map(
                    (image) => ({
                      src:
                        getImageUrl(image.baseImageUrl, baseUrl, NOT_IMAGE) ||
                        "",
                      altText: image.name || "",
                    }),
                  ) || []
                }
              />
            ) : (
              <HeroCarousel
                images={[
                  {
                    src: imageUrl || "",
                    altText: product?.name || "product image",
                  },
                ]}
              />
            )}
          </Suspense>
        </div>
        <div className="basis-full lg:basis-4/6">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductInfo
              product={product as ProductData}
              slug={urlKey}
              reviews={reviews}
            />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<RelatedProductSkeleton />}>
        <RelatedProductsSection fullPath={urlKey} />
      </Suspense>
    </>
  );
}
