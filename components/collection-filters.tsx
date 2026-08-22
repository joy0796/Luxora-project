"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

type CollectionFiltersProps = {
  products: Product[];
};

export function CollectionFilters({
  products,
}: CollectionFiltersProps) {
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const colors = useMemo(() => {
    const values = products.flatMap((product) =>
      product.colors?.map((color) => color.name) || []
    );

    return ["All", ...Array.from(new Set(values))];
  }, [products]);

  const materials = useMemo(() => {
    const values = products
      .map((product) => product.material)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // COLOR
    if (selectedColor !== "All") {
      result = result.filter((product) =>
        product.colors?.some(
          (color) => color.name === selectedColor
        )
      );
    }

    // MATERIAL
    if (selectedMaterial !== "All") {
      result = result.filter(
        (product) => product.material === selectedMaterial
      );
    }

    // PRICE
    if (selectedPrice === "Under $100") {
      result = result.filter((product) => product.price < 100);
    }

    if (selectedPrice === "$100 - $200") {
      result = result.filter(
        (product) => product.price >= 100 && product.price <= 200
      );
    }

    if (selectedPrice === "$200 - $300") {
      result = result.filter(
        (product) => product.price > 200 && product.price <= 300
      );
    }

    if (selectedPrice === "$300+") {
      result = result.filter((product) => product.price > 300);
    }

    // SORT
    if (sort === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "Name: A-Z") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    selectedColor,
    selectedMaterial,
    selectedPrice,
    sort,
  ]);

  const resetFilters = () => {
    setSelectedColor("All");
    setSelectedMaterial("All");
    setSelectedPrice("All");
    setSort("Newest");
  };

  const hasActiveFilters =
    selectedColor !== "All" ||
    selectedMaterial !== "All" ||
    selectedPrice !== "All";

  return (
    <>
      {/* FILTER BAR */}
      <div className="mb-7 border-y border-line py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[.12em]">
            {filteredProducts.length} styles
          </span>

          <div className="flex flex-wrap gap-2">
            {/* FILTER */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`border px-3 py-2 text-[9px] uppercase tracking-[.1em] transition ${
                filtersOpen || hasActiveFilters
                  ? "border-ink bg-ink text-white"
                  : "border-line"
              }`}
            >
              Filter
            </button>

            {/* COLOR */}
            <select
              value={selectedColor}
              onChange={(e) =>
                setSelectedColor(e.target.value)
              }
              className="border border-line bg-transparent px-3 py-2 text-[9px] uppercase tracking-[.1em] outline-none"
            >
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color === "All"
                    ? "Color"
                    : color}
                </option>
              ))}
            </select>

            {/* MATERIAL */}
            <select
              value={selectedMaterial}
              onChange={(e) =>
                setSelectedMaterial(e.target.value)
              }
              className="border border-line bg-transparent px-3 py-2 text-[9px] uppercase tracking-[.1em] outline-none"
            >
              {materials.map((material) => (
                <option
                  key={material}
                  value={material}
                >
                  {material === "All"
                    ? "Material"
                    : material}
                </option>
              ))}
            </select>

            {/* PRICE */}
            <select
              value={selectedPrice}
              onChange={(e) =>
                setSelectedPrice(e.target.value)
              }
              className="border border-line bg-transparent px-3 py-2 text-[9px] uppercase tracking-[.1em] outline-none"
            >
              <option value="All">Price</option>
              <option value="Under $100">
                Under $100
              </option>
              <option value="$100 - $200">
                $100 - $200
              </option>
              <option value="$200 - $300">
                $200 - $300
              </option>
              <option value="$300+">$300+</option>
            </select>

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="border border-line bg-transparent px-3 py-2 text-[9px] uppercase tracking-[.1em] outline-none"
            >
              <option value="Newest">
                Sort: Newest
              </option>
              <option value="Price: Low to High">
                Price: Low to High
              </option>
              <option value="Price: High to Low">
                Price: High to Low
              </option>
              <option value="Name: A-Z">
                Name: A-Z
              </option>
            </select>
          </div>
        </div>

        {/* ADVANCED FILTER PANEL */}
        {filtersOpen && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="grid gap-6 md:grid-cols-3">
              {/* COLORS */}
              <div>
                <p className="mb-3 text-[9px] uppercase tracking-[.12em]">
                  Color
                </p>

                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`border px-3 py-2 text-[9px] uppercase tracking-[.08em] transition ${
                        selectedColor === color
                          ? "border-ink bg-ink text-white"
                          : "border-line"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* MATERIALS */}
              <div>
                <p className="mb-3 text-[9px] uppercase tracking-[.12em]">
                  Material
                </p>

                <div className="flex flex-wrap gap-2">
                  {materials.map((material) => (
                    <button
                      key={material}
                      onClick={() =>
                        setSelectedMaterial(material)
                      }
                      className={`border px-3 py-2 text-[9px] uppercase tracking-[.08em] transition ${
                        selectedMaterial === material
                          ? "border-ink bg-ink text-white"
                          : "border-line"
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* RESET */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="border border-line px-4 py-2 text-[9px] uppercase tracking-[.1em] transition hover:border-ink"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <h3 className="display-serif text-3xl">
            No bags found
          </h3>

          <p className="mt-3 text-sm text-muted">
            Try adjusting your filters.
          </p>

          <button
            onClick={resetFilters}
            className="lux-button mt-6"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}