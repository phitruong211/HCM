import hcmData from "./hcm.json";

// ═══════════════════════════════════════════
//  Dữ liệu chính thức
//  Hành trình tư tưởng Hồ Chí Minh
// ═══════════════════════════════════════════

export interface Marker {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  isRegionLevel?: boolean;
}

export interface Period {
  id: number;
  name: string;
  range: string;
  summary: string;
}

export interface HistoricalEvent {
  id: string;
  thoiKy: number;
  ngay: string;
  ngaySort: string;
  tieuDe: string;
  moTa: string | string[];
  diaDiem: string;
  lat: number;
  lng: number;
  isRegionLevel?: boolean;
  yNghia?: string;
  ketQua?: string;

  /** Label thời gian hiển thị (tương thích cũ) */
  yearLabel: string;
  /** Năm chính để sắp xếp (tương thích cũ) */
  sortYear: number;
  /** Tiêu đề (tương thích cũ) */
  title: string;
  /** Mô tả (tương thích cũ) */
  description: string;
  markerId: string;
  image: string;
  details?: string;
}

export const periods: Period[] = hcmData.periods;

// Dynamically generate markers from unique locations in hcm.json
const uniqueLocations = new Map<string, Marker>();
hcmData.events.forEach((e) => {
  const key = `${e.lat},${e.lng}`;
  if (!uniqueLocations.has(key)) {
    uniqueLocations.set(key, {
      id: `marker-${e.lat}-${e.lng}`,
      name: e.diaDiem,
      coordinates: [e.lng, e.lat],
      isRegionLevel: e.isRegionLevel,
    });
  } else if (e.isRegionLevel) {
    uniqueLocations.get(key)!.isRegionLevel = true;
  }
});
export const markers: Marker[] = Array.from(uniqueLocations.values());

// Map new events and provide backwards compatibility
export const events: HistoricalEvent[] = hcmData.events.map((e, index) => {
  const markerId = `marker-${e.lat}-${e.lng}`;
  
  let detailsText = Array.isArray(e.moTa) ? e.moTa.join('\n\n') : e.moTa;

  return {
    id: e.id,
    thoiKy: e.thoiKy,
    ngay: e.ngay,
    ngaySort: e.ngaySort,
    tieuDe: e.tieuDe,
    moTa: e.moTa,
    diaDiem: e.diaDiem,
    lat: e.lat,
    lng: e.lng,
    isRegionLevel: e.isRegionLevel,
    yNghia: e.yNghia,
    ketQua: e.ketQua,

    // Legacy compatibility fields
    yearLabel: e.ngay,
    sortYear: parseInt(e.ngaySort.split("-")[0], 10),
    title: e.tieuDe,
    description: detailsText,
    markerId: markerId,
    image: index < 23 ? `/media/event-${index + 1}.jpg` : `/media/event-${e.thoiKy}.jpg`, // Use specific images for first 23 events, fallback to period
    details: detailsText,
  };
});

// ─── Helper: lấy danh sách sự kiện theo marker ───
export function getEventsByMarker(markerId: string): HistoricalEvent[] {
  return events.filter((e) => e.markerId === markerId);
}

// ─── Helper: lấy marker từ event ───
export function getMarkerForEvent(event: HistoricalEvent): Marker | undefined {
  return markers.find((m) => m.id === event.markerId);
}
