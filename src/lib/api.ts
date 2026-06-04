const PLACEHOLDER = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";
const IMAGE_DEFAULTS = "w=800&q=80&auto=format&fit=crop";

const normalizeImageUrl = (url: string) => {
  if (!url) return PLACEHOLDER;
  if (!url.includes("images.unsplash.com")) return url;
  return url.includes("?") ? `${url}&${IMAGE_DEFAULTS}` : `${url}?${IMAGE_DEFAULTS}`;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  url?: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  thumbnail: string;
  category: Category;
  creationAt: string;
  updatedAt: string;
};

type RawProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

const RAW_PRODUCTS: RawProduct[] = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    category: "Tops",
    price: 23.49,
    description: "Soft cotton jersey with a clean crew neck and an easy everyday cut.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    id: 2,
    name: "Black Oversized Hoodie",
    category: "Hoodies",
    price: 26.99,
    description: "A roomy fleece hoodie with dropped shoulders and a brushed interior.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  },
  {
    id: 3,
    name: "Blue Denim Jacket",
    category: "Outerwear",
    price: 30.49,
    description: "Mid-weight denim with a lived-in wash and room for light layering.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
  },
  {
    id: 4,
    name: "Slim Fit Jeans",
    category: "Bottoms",
    price: 33.99,
    description: "A tapered five-pocket jean cut close through the leg without feeling rigid.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  },
  {
    id: 5,
    name: "Running Sneakers",
    category: "Shoes",
    price: 37.49,
    description: "Light running shoes with cushioned soles for errands, commutes and long walks.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 6,
    name: "Summer Floral Dress",
    category: "Dresses",
    price: 40.99,
    description: "A breezy floral dress with a relaxed waist and movement through the skirt.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    id: 7,
    name: "Formal Blazer",
    category: "Formal Wear",
    price: 44.49,
    description: "A structured blazer with neat lapels for workdays, dinners and travel.",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7",
  },
  {
    id: 8,
    name: "Cargo Pants",
    category: "Bottoms",
    price: 47.99,
    description: "Utility pants with a relaxed leg, deep pockets and a durable cotton handfeel.",
    image: "https://images.unsplash.com/photo-1506629905607-d9f4f5b5c7c9",
  },
  {
    id: 9,
    name: "Leather Boots",
    category: "Shoes",
    price: 51.49,
    description: "Polished leather boots with a sturdy sole and a shape that dresses up easily.",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
  },
  {
    id: 10,
    name: "Striped Polo Shirt",
    category: "Tops",
    price: 54.99,
    description: "A striped cotton polo that keeps its shape after repeat wears.",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
  },
  {
    id: 11,
    name: "Wool Winter Coat",
    category: "Outerwear",
    price: 58.49,
    description: "A warm wool-blend coat with a straight silhouette and simple front closure.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    id: 12,
    name: "Athletic Joggers",
    category: "Sportswear",
    price: 61.99,
    description: "Soft joggers with a tapered ankle, drawcord waist and weekend-level comfort.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  },
  {
    id: 13,
    name: "Canvas Sneakers",
    category: "Shoes",
    price: 65.49,
    description: "Canvas low-tops with a flexible sole and a broken-in feel from day one.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
  },
  {
    id: 14,
    name: "Casual Linen Shirt",
    category: "Tops",
    price: 68.99,
    description: "A breathable linen shirt cut loose enough for warm days and easy layering.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    id: 15,
    name: "Pleated Skirt",
    category: "Bottoms",
    price: 72.49,
    description: "A pressed pleated skirt with a clean waistband and a fluid drape.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    id: 16,
    name: "Vintage Graphic Tee",
    category: "Tops",
    price: 75.99,
    description: "A washed graphic tee with a vintage handfeel and an easy boxy fit.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2",
  },
  {
    id: 17,
    name: "Puffer Jacket",
    category: "Outerwear",
    price: 79.49,
    description: "A quilted puffer jacket with light insulation and practical zip pockets.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    id: 18,
    name: "Yoga Leggings",
    category: "Sportswear",
    price: 82.99,
    description: "Stretch leggings with a supportive waistband for studio days or slow mornings.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
  {
    id: 19,
    name: "Chelsea Boots",
    category: "Shoes",
    price: 86.49,
    description: "Chelsea boots with elastic side panels and a clean almond toe.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  },
  {
    id: 20,
    name: "Knitted Sweater",
    category: "Tops",
    price: 89.99,
    description: "A textured knit sweater with ribbed edges and enough weight for cool evenings.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    id: 21,
    name: "Relaxed Fit Shorts",
    category: "Bottoms",
    price: 93.49,
    description: "Relaxed shorts with a tidy hem, side pockets and a comfortable rise.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
  },
  {
    id: 22,
    name: "Silk Evening Dress",
    category: "Dresses",
    price: 96.99,
    description: "A silk evening dress with a soft sheen and a simple, flattering line.",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31",
  },
  {
    id: 23,
    name: "Track Jacket",
    category: "Sportswear",
    price: 100.49,
    description: "A track jacket with a smooth finish, zip front and light ribbed trim.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
  },
  {
    id: 24,
    name: "High Top Sneakers",
    category: "Shoes",
    price: 103.99,
    description: "High-top sneakers with padded collars and a sturdy streetwear profile.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  {
    id: 25,
    name: "Flannel Shirt",
    category: "Tops",
    price: 107.49,
    description: "A brushed flannel shirt with a relaxed fit and an easy check pattern.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  },
  {
    id: 26,
    name: "Wide Leg Trousers",
    category: "Bottoms",
    price: 110.99,
    description: "Wide-leg trousers with a soft drape and enough polish for office rotation.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  },
  {
    id: 27,
    name: "Raincoat",
    category: "Outerwear",
    price: 114.49,
    description: "A clean raincoat with a protective hood and a lightweight water-resistant shell.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
  {
    id: 28,
    name: "Training Tank Top",
    category: "Sportswear",
    price: 117.99,
    description: "A training tank with an open arm cut and quick-drying feel.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    id: 29,
    name: "Loafers",
    category: "Shoes",
    price: 121.49,
    description: "Classic loafers with a low profile, rounded toe and comfortable slip-on build.",
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb",
  },
  {
    id: 30,
    name: "Zip-Up Hoodie",
    category: "Hoodies",
    price: 124.99,
    description: "A zip hoodie with soft fleece, ribbed cuffs and a reliable everyday weight.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
  },
];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildCategory = (name: string): Category => {
  const slug = toSlug(name);
  return {
    id: slug,
    slug,
    name,
    url: PLACEHOLDER,
  };
};

const buildProduct = (raw: RawProduct): Product => {
  const category = buildCategory(raw.category);
  const images = [normalizeImageUrl(raw.image || PLACEHOLDER)];

  return {
    id: raw.id,
    title: raw.name,
    description: raw.description,
    price: raw.price,
    slug: String(raw.id),
    images,
    thumbnail: images[0] ?? PLACEHOLDER,
    category,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const PRODUCTS: Product[] = RAW_PRODUCTS.map(buildProduct);

const CATEGORIES: Category[] = Array.from(
  RAW_PRODUCTS.reduce((map, item) => {
    const category = buildCategory(item.category);
    if (!map.has(category.slug)) {
      map.set(category.slug, category);
    }
    return map;
  }, new Map<string, Category>()),
).map(([, category]) => category);

export type ProductFilters = {
  query?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  offset?: number;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const query = filters.query?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  let results = [...PRODUCTS];

  if (category) {
    results = results.filter((product) => product.category.slug === category);
  }

  if (query) {
    results = results.filter((product) => {
      const haystack =
        `${product.title} ${product.description} ${product.category.name}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  const priceMin = filters.priceMin;
  if (priceMin !== undefined) {
    results = results.filter((product) => product.price >= priceMin);
  }

  const priceMax = filters.priceMax;
  if (priceMax !== undefined) {
    results = results.filter((product) => product.price <= priceMax);
  }

  return results.slice(offset, offset + limit);
}

export async function getProduct(id: number | string): Promise<Product> {
  const numericId = Number(id);
  const product = PRODUCTS.find((item) => item.id === numericId);
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return product;
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
