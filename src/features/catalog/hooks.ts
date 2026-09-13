import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { FALLBACK_PACKS, FALLBACK_PROGRAMS, Pack, Program } from "../../lib/money";

type VariantDto = { sku: string; qty: number; price: number; mrp: number; label: string; description: string };
type ProductDto = { variants: VariantDto[] };
type ProgramDto = { key: string; name: string; description: string; duration: string; icon: string };

export function mapVariants(products: ProductDto[]): Pack[] {
  const variants = products[0]?.variants || [];
  if (!variants.length) return FALLBACK_PACKS;
  return variants.map((item) => ({
    sku: item.sku,
    qty: item.qty,
    price: item.price,
    mrp: item.mrp,
    label: item.label,
    desc: item.description,
  }));
}

export function mapPrograms(rows: ProgramDto[]): Program[] {
  if (!rows.length) return FALLBACK_PROGRAMS;
  return rows.map((item) => ({
    key: item.key,
    name: item.name,
    description: item.description,
    duration: item.duration,
    icon: item.icon,
  }));
}

export function usePacks() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<ProductDto[]>("/products");
      return mapVariants(data);
    },
    initialData: FALLBACK_PACKS,
  });
}

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await api.get<ProgramDto[]>("/programs");
      return mapPrograms(data);
    },
    initialData: FALLBACK_PROGRAMS,
  });
}
