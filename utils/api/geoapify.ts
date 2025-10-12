const DEAL_KEYWORDS = [
  "discount",
  "deal",
  "bargain",
  "outlet",
  "thrift",
  "pawn",
  "sale",
  "markdown",
  "clearance",
  "budget",
  "frugal",
  "save",
  "coupon",
  "cheap",
  "warehouse",
];

const DEAL_CATEGORIES = [
  "commercial.discount_store",
  "commercial.marketplace",
  "commercial.second_hand",
  "commercial.outdoor_and_sport",
  "commercial.outdoor_and_sport.water_sports",
  "commercial.outdoor_and_sport.ski",
  "commercial.outdoor_and_sport.diving",
  "commercial.outdoor_and_sport.hunting",
  "commercial.outdoor_and_sport.bicycle",
  "commercial.outdoor_and_sport.fishing",
  "commercial.outdoor_and_sport.golf",
  "commercial.supermarket",
  "commercial.convenience",
  "commercial.food_and_drink",
  "commercial.houseware_and_hardware",
  "commercial.second_hand",
  "commercial.toy_and_game",
  "commercial.gift_and_souvenir",
  "commercial.clothing",
  "commercial.clothing.sport",
  "commercial.clothing.shoes",
  "commercial.clothing.accessories",
  "commercial.energy",
  "commercial.marketplace",
  "commercial.trade",
];

export type NearbyPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category?: string;
  distanceMeters?: number;
  website?: string;
  phone?: string;
  isDeal: boolean;
  highlight?: string;
};

type FetchNearbyPlacesOptions = {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
};

const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v2/places";

const mapFeatureToPlace = (feature: any): NearbyPlace | null => {
  const coords = feature?.geometry?.coordinates;
  const props = feature?.properties;

  if (!Array.isArray(coords) || coords.length < 2 || !props?.place_id) {
    return null;
  }

  const [longitude, latitude] = coords;
  const addressParts = [
    props.address_line1,
    props.address_line2,
    props.city,
  ].filter(Boolean);

  const categories: string[] = props.categories ?? [];
  const rawName = props.name?.toLowerCase?.() ?? "";
  const formattedCategory = categories[0];

  let isDeal =
    categories.some((category: string) =>
      DEAL_CATEGORIES.includes(category),
    ) || DEAL_KEYWORDS.some((keyword) => rawName.includes(keyword));

  const tags = props.datasource?.raw ? Object.values(props.datasource.raw) : [];
  if (!isDeal && Array.isArray(tags)) {
    isDeal = DEAL_KEYWORDS.some((keyword) =>
      tags.join(" ").toLowerCase().includes(keyword),
    );
  }

  const highlight = categories
    .filter((category: string) => DEAL_CATEGORIES.includes(category))
    .map((category) => category.split(".").slice(-1)[0].replace(/_/g, " "))
    .join(", ");

  if (!isDeal) {
    return null;
  }

  return {
    id: String(props.place_id),
    name: props.name || "Unnamed Location",
    latitude,
    longitude,
    address: addressParts.join(", "),
    category: props.categories?.[0],
    distanceMeters: props.distance,
    website: props.website,
    phone: props.contact?.phone,
    isDeal,
    highlight: highlight || undefined,
  };
};

/**
 * Fetch nearby discount-friendly places using Geoapify Places API.
 * Requires EXPO_PUBLIC_GEOAPIFY_API_KEY to be set.
 */
export const fetchNearbyPlaces = async ({
  latitude,
  longitude,
  radiusMeters = 3000,
  limit = 15,
}: FetchNearbyPlacesOptions): Promise<NearbyPlace[]> => {
  const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Geoapify API key. Set EXPO_PUBLIC_GEOAPIFY_API_KEY in your Expo config.",
    );
  }

  const params = new URLSearchParams({
    categories: Array.from(new Set(DEAL_CATEGORIES)).join(","),
    bias: `proximity:${longitude},${latitude}`,
    filter: `circle:${longitude},${latitude},${Math.min(radiusMeters, 5000)}`,
    lang: "en",
    limit: Math.min(limit, 50).toString(),
    apiKey,
  });

  const response = await fetch(`${GEOAPIFY_BASE_URL}?${params.toString()}`);

  const rawBody = await response.text();

  if (!response.ok) {
    let friendly = rawBody;

    try {
      const errorJson = JSON.parse(rawBody);
      friendly =
        errorJson?.message ||
        errorJson?.error?.message ||
        errorJson?.error?.description ||
        errorJson?.error ||
        friendly;
    } catch {
      // ignore if body is not JSON
    }

    throw new Error(
      `Geoapify request failed (${response.status}): ${
        friendly || "Unknown error"
      }`,
    );
  }

  let data: any = {};

  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw new Error("Geoapify returned an unexpected payload.");
  }
  const features: any[] = data?.features ?? [];

  return features
    .map(mapFeatureToPlace)
    .filter((place): place is NearbyPlace => !!place);
};
