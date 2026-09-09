import type { FeatureCollection, Feature, Point, Polygon } from "geojson";

// ═══════════════════════════════════════════════════════
// QUẦN ĐẢO HOÀNG SA (Paracel Islands) — VIỆT NAM
// Gồm 2 nhóm chính: Nhóm An Vĩnh (phía Đông) và Nhóm Lưỡi Liềm (phía Tây)
// ═══════════════════════════════════════════════════════

export const hoangSaIslands: Feature<Point>[] = [
  // ── Nhóm An Vĩnh (Amphitrite Group) ──
  {
    type: "Feature",
    properties: { name: "Đ. Phú Lâm", nameEn: "Woody Island", group: "An Vĩnh", size: "large" },
    geometry: { type: "Point", coordinates: [112.3381, 16.8361] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Linh Côn", nameEn: "Lincoln Island", group: "An Vĩnh", size: "medium" },
    geometry: { type: "Point", coordinates: [112.7278, 16.6697] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Cây", nameEn: "Tree Island", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.2672, 16.9761] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Bắc", nameEn: "North Island", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.3064, 16.9528] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Trung", nameEn: "Middle Island", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.3367, 16.9631] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Nam", nameEn: "South Island", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.3314, 16.9478] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Đá", nameEn: "Rocky Island", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.4625, 16.8472] },
  },
  {
    type: "Feature",
    properties: { name: "Cồn cát Tây", nameEn: "West Sand", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [112.2133, 16.8744] },
  },

  // ── Nhóm Lưỡi Liềm (Crescent Group) ──
  {
    type: "Feature",
    properties: { name: "Đ. Hoàng Sa", nameEn: "Pattle Island", group: "Lưỡi Liềm", size: "large" },
    geometry: { type: "Point", coordinates: [111.5592, 16.5303] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Hữu Nhật", nameEn: "Robert Island", group: "Lưỡi Liềm", size: "medium" },
    geometry: { type: "Point", coordinates: [111.5278, 16.5053] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Quang Ảnh", nameEn: "Money Island", group: "Lưỡi Liềm", size: "medium" },
    geometry: { type: "Point", coordinates: [111.5833, 16.4500] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Duy Mộng", nameEn: "Drummond Island", group: "Lưỡi Liềm", size: "medium" },
    geometry: { type: "Point", coordinates: [111.7392, 16.4700] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Quang Hòa", nameEn: "Duncan Island", group: "Lưỡi Liềm", size: "medium" },
    geometry: { type: "Point", coordinates: [111.7097, 16.4531] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Bạch Quy", nameEn: "Passu Keah", group: "Lưỡi Liềm", size: "small" },
    geometry: { type: "Point", coordinates: [111.7583, 16.0567] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Tri Tôn", nameEn: "Triton Island", group: "Lưỡi Liềm", size: "medium" },
    geometry: { type: "Point", coordinates: [111.2011, 15.7828] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Ba Ba", nameEn: "Observation Bank", group: "Lưỡi Liềm", size: "small" },
    geometry: { type: "Point", coordinates: [111.6500, 16.3417] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Lồi", nameEn: "Discovery Reef", group: "An Vĩnh", size: "small" },
    geometry: { type: "Point", coordinates: [111.8167, 16.2417] },
  },
];

// ═══════════════════════════════════════════════════════
// QUẦN ĐẢO TRƯỜNG SA (Spratly Islands) — VIỆT NAM
// Gồm nhiều đảo, đá, bãi cạn trải rộng trên Biển Đông
// ═══════════════════════════════════════════════════════

export const truongSaIslands: Feature<Point>[] = [
  // ── Các đảo lớn ──
  {
    type: "Feature",
    properties: { name: "Đ. Trường Sa Lớn", nameEn: "Spratly Island", group: "Trung tâm", size: "large" },
    geometry: { type: "Point", coordinates: [111.9183, 8.6431] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Song Tử Tây", nameEn: "Southwest Cay", group: "Song Tử", size: "large" },
    geometry: { type: "Point", coordinates: [114.3283, 11.4319] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Song Tử Đông", nameEn: "Northeast Cay", group: "Song Tử", size: "medium" },
    geometry: { type: "Point", coordinates: [114.3469, 11.4700] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Sinh Tồn", nameEn: "Sin Cowe Island", group: "Sinh Tồn", size: "large" },
    geometry: { type: "Point", coordinates: [114.3319, 9.8822] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Sinh Tồn Đông", nameEn: "Grierson Reef", group: "Sinh Tồn", size: "medium" },
    geometry: { type: "Point", coordinates: [114.5800, 9.9100] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Nam Yết", nameEn: "Namyit Island", group: "Nam Yết", size: "large" },
    geometry: { type: "Point", coordinates: [114.3683, 10.1792] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Sơn Ca", nameEn: "Sand Cay", group: "Nam Yết", size: "medium" },
    geometry: { type: "Point", coordinates: [114.4789, 10.3756] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. An Bang", nameEn: "Amboyna Cay", group: "An Bang", size: "medium" },
    geometry: { type: "Point", coordinates: [112.2333, 7.8667] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Trường Sa Đông", nameEn: "Central London Reef", group: "Trung tâm", size: "medium" },
    geometry: { type: "Point", coordinates: [112.0683, 8.9317] },
  },
  {
    type: "Feature",
    properties: { name: "Đ. Phan Vinh", nameEn: "Pearson Reef", group: "Trung tâm", size: "medium" },
    geometry: { type: "Point", coordinates: [113.6833, 8.9583] },
  },

  // ── Các đá, bãi ngầm quan trọng ──
  {
    type: "Feature",
    properties: { name: "Đá Lát", nameEn: "Ladd Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [111.6683, 8.6650] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Tây", nameEn: "West London Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [112.2233, 8.8617] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Đông", nameEn: "East London Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [112.5917, 8.8333] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Cô Lin", nameEn: "Collins Reef", group: "Sinh Tồn", size: "small" },
    geometry: { type: "Point", coordinates: [114.2572, 9.7742] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Len Đao", nameEn: "Lansdowne Reef", group: "Sinh Tồn", size: "small" },
    geometry: { type: "Point", coordinates: [114.3694, 9.7711] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Gạc Ma", nameEn: "Johnson South Reef", group: "Sinh Tồn", size: "small" },
    geometry: { type: "Point", coordinates: [114.2153, 9.7150] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Núi Le", nameEn: "Cornwallis South Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [114.1833, 8.7167] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Tiên Nữ", nameEn: "Tennent Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [114.7333, 8.8500] },
  },
  {
    type: "Feature",
    properties: { name: "Bãi Tư Chính", nameEn: "Vanguard Bank", group: "Phía Nam", size: "small" },
    geometry: { type: "Point", coordinates: [110.6000, 7.4500] },
  },
  {
    type: "Feature",
    properties: { name: "Đá Thuyền Chài", nameEn: "Barque Canada Reef", group: "Trung tâm", size: "small" },
    geometry: { type: "Point", coordinates: [113.2833, 8.1167] },
  },
];

// ═══════════════════════════════════════════════════════
// ĐƯỜNG VIỀN HÀNH CHÍNH - Chi tiết hơn, sát hình dạng thực tế
// ═══════════════════════════════════════════════════════

export const hoangSaBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: {
    name: "QĐ. Hoàng Sa",
    fullName: "Quần đảo Hoàng Sa (Việt Nam)",
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [111.0, 15.6],
        [111.0, 16.2],
        [111.1, 16.6],
        [111.3, 17.0],
        [111.8, 17.15],
        [112.3, 17.15],
        [112.85, 17.0],
        [113.0, 16.7],
        [113.0, 16.3],
        [112.9, 15.9],
        [112.5, 15.6],
        [112.0, 15.5],
        [111.5, 15.5],
        [111.0, 15.6],
      ],
    ],
  },
};

export const truongSaBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: {
    name: "QĐ. Trường Sa",
    fullName: "Quần đảo Trường Sa (Việt Nam)",
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [110.4, 7.2],
        [110.4, 7.8],
        [111.2, 8.8],
        [111.5, 9.4],
        [112.0, 10.0],
        [112.5, 10.5],
        [113.2, 11.0],
        [113.8, 11.4],
        [114.2, 11.65],
        [114.7, 11.65],
        [115.1, 11.3],
        [115.2, 10.8],
        [115.0, 10.0],
        [114.9, 9.4],
        [115.0, 8.8],
        [114.8, 8.3],
        [114.3, 7.8],
        [113.5, 7.3],
        [112.5, 7.0],
        [111.5, 7.0],
        [110.8, 7.0],
        [110.4, 7.2],
      ],
    ],
  },
};

// ═══════════════════════════════════════════════════════
// GeoJSON Collections
// ═══════════════════════════════════════════════════════

export const allIslandsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [...hoangSaIslands, ...truongSaIslands],
};

// Tách riêng đảo lớn và nhỏ để render khác nhau
export const largeIslandsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [...hoangSaIslands, ...truongSaIslands].filter(
    (f) => f.properties?.size === "large"
  ),
};

export const mediumIslandsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [...hoangSaIslands, ...truongSaIslands].filter(
    (f) => f.properties?.size === "medium"
  ),
};

export const smallIslandsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [...hoangSaIslands, ...truongSaIslands].filter(
    (f) => f.properties?.size === "small"
  ),
};

// Labels cho quần đảo (vị trí đặt nhãn chính)
export const islandLabels: Feature<Point>[] = [
  {
    type: "Feature",
    properties: {
      name: "QUẦN ĐẢO HOÀNG SA",
      subtitle: "(Việt Nam)",
      type: "main",
    },
    geometry: { type: "Point", coordinates: [111.85, 16.4] },
  },
  {
    type: "Feature",
    properties: {
      name: "QUẦN ĐẢO TRƯỜNG SA",
      subtitle: "(Việt Nam)",
      type: "main",
    },
    geometry: { type: "Point", coordinates: [113.5, 9.8] },
  },
];

// Labels phụ cho nhóm đảo
export const islandGroupLabels: Feature<Point>[] = [
  {
    type: "Feature",
    properties: { name: "Nhóm An Vĩnh", type: "group" },
    geometry: { type: "Point", coordinates: [112.4, 16.9] },
  },
  {
    type: "Feature",
    properties: { name: "Nhóm Lưỡi Liềm", type: "group" },
    geometry: { type: "Point", coordinates: [111.5, 16.2] },
  },
  {
    type: "Feature",
    properties: { name: "Nhóm Song Tử", type: "group" },
    geometry: { type: "Point", coordinates: [114.3, 11.55] },
  },
  {
    type: "Feature",
    properties: { name: "Nhóm Sinh Tồn", type: "group" },
    geometry: { type: "Point", coordinates: [114.4, 9.65] },
  },
  {
    type: "Feature",
    properties: { name: "Nhóm Nam Yết", type: "group" },
    geometry: { type: "Point", coordinates: [114.5, 10.45] },
  },
];

export const islandLabelsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: islandLabels,
};

export const islandGroupLabelsGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: islandGroupLabels,
};

export const hoangSaBoundaryCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [hoangSaBoundary],
};

export const truongSaBoundaryCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [truongSaBoundary],
};
