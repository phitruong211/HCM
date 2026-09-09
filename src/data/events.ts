// ═══════════════════════════════════════════
//  Dữ liệu chính thức — 7 Markers / 15 Sự kiện
//  Hành trình tư tưởng Hồ Chí Minh
// ═══════════════════════════════════════════

export interface Marker {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface HistoricalEvent {
  id: string;
  /** Label thời gian hiển thị (hỗ trợ dạng "Trước 1911", "1911-1917", v.v.) */
  yearLabel: string;
  /** Năm chính để sắp xếp theo thời gian */
  sortYear: number;
  title: string;
  description: string;
  markerId: string;
  image: string;
  details?: string;
}

// ─── 7 Markers ───
export const markers: Marker[] = [
  {
    id: "marker-1",
    name: "Nghệ An & Thừa Thiên Huế",
    coordinates: [105.7, 18.0],
  },
  {
    id: "marker-2",
    name: "Sài Gòn",
    coordinates: [106.705, 10.768],
  },
  {
    id: "marker-3",
    name: "Nước Pháp",
    coordinates: [2.35, 48.86],
  },
  {
    id: "marker-4",
    name: "Trung Quốc",
    coordinates: [113.26, 23.13],
  },
  {
    id: "marker-5",
    name: "Liên Xô",
    coordinates: [37.62, 55.76],
  },
  {
    id: "marker-6",
    name: "Cao Bằng",
    coordinates: [106.06, 22.84],
  },
  {
    id: "marker-7",
    name: "Thủ đô Hà Nội",
    coordinates: [105.834, 21.037],
  },
];

// ─── 15 Sự kiện (đã sắp xếp theo thời gian) ───
export const events: HistoricalEvent[] = [
  {
    id: "evt-01",
    yearLabel: "Trước 1911",
    sortYear: 1908,
    title: "Tư tưởng yêu nước và phong trào chống thuế",
    description:
      "Nguyễn Tất Thành sớm có tư tưởng yêu nước, tham gia phong trào chống thuế ở Trung Kỳ năm 1908.",
    markerId: "marker-1",
    image: "/media/event-1.jpg",
    details: "**Nguồn gốc hình thành tư tưởng:**\n- **Quê hương Nghệ An:** Vùng đất giàu truyền thống yêu nước, lắm nhân tài và anh hùng yêu nước nổi tiếng trong lịch sử dân tộc.\n- **Gia đình:** Thuở thiếu niên chịu ảnh hưởng từ tinh thần yêu nước, thương dân và nhân cách của người cha (cụ Nguyễn Sinh Sắc - đỗ phó bảng) và từ tình cảm của người mẹ thông qua tấm lòng nhân hậu, tần tảo, đảm đang, hết mực thương yêu chồng, con và ăn ở nhân đức với mọi người của cụ Hoàng Thị Loan.\n- **Giáo dục và xã hội:** Được theo học các vị túc nho và tiếp xúc với nhiều loại sách báo tiến bộ, ở các trường, lớp tại Vinh, kinh đô Huế; hiểu rõ tình cảnh nước nhà bị giặc ngoại xâm đô hộ.\n\n**Hoạt động thực tiễn tiêu biểu:**\n- Tham gia phong trào chống thuế ở Trung Kỳ (năm 1908).\n- Dạy học tại Trường Dục Thanh, Phan Thiết - truyền thụ cho học sinh lòng yêu nước và những suy nghĩ về vận mệnh nước nhà.\n\n**Bước chuyển lớn trong tư tưởng:**\n- Khâm phục tinh thần yêu nước của các vị tiền bối cách mạng (Phan Bội Châu, Phan Châu Trinh, Hoàng Hoa Thám, v.v.) nhưng không tán thành, không đi theo các phương pháp, khuynh hướng cứu nước của họ."
  },
  {
    id: "evt-02",
    yearLabel: "05/06/1911",
    sortYear: 1911,
    title: "Ra nước ngoài tìm đường cứu nước",
    description:
      "Ngày 5/6/1911: Quyết định đi ra nước ngoài tìm con đường cứu nước, cứu dân.",
    markerId: "marker-2",
    image: "/media/event-2.jpg",
    details: "Ngày 5-6-1911: Hồ Chí Minh đi ra nước ngoài tìm con đường cứu nước, cứu dân, tìm hiểu những gì ẩn giấu sau sức mạnh của kẻ thù và học hỏi kinh nghiệm cách mạng trên thế giới."
  },
  {
    id: "evt-03",
    yearLabel: "1911 – 1917",
    sortYear: 1911,
    title: "Nhận thức bản chất chủ nghĩa đế quốc",
    description:
      "Từ Pháp đi nhiều nước trên thế giới, nhận thức sâu sắc bản chất của chủ nghĩa đế quốc.",
    markerId: "marker-3",
    image: "/media/event-3.jpg",
    details: "Người xác định đúng bản chất, thủ đoạn, tội ác của chủ nghĩa thực dân và tình cảnh nhân dân các nước thuộc địa.\n\nQua cuộc hành trình từ Pháp đến nhiều nước trên thế giới, Người hình thành một nhận thức mới: Nhân dân lao động các nước, trong đó có giai cấp công nhân, đều bị bóc lột có thể là bạn của nhau; còn chủ nghĩa đế quốc, bọn thực dân ở đâu cũng là kẻ bóc lột, là kẻ thù của nhân dân lao động.\n\nNăm 1917: trở lại Pháp, tham gia phong trào công nhân Pháp đấu tranh chống chủ nghĩa thực dân."
  },
  {
    id: "evt-04",
    yearLabel: "18/06/1919",
    sortYear: 1919,
    title: "Bản Yêu sách của nhân dân An Nam",
    description:
      "Gửi Bản Yêu sách của nhân dân An Nam tới Hội nghị Vécxây đòi quyền tự do, dân chủ.",
    markerId: "marker-3",
    image: "/media/event-4.jpg",
    details: "Năm 1919: Gia nhập Đảng Xã hội của giai cấp công nhân Pháp - theo Người, đây là tổ chức theo đuổi lý tưởng cao quý của Đại Cách mạng Pháp: Tự do, bình đẳng, bác ái.\n\n18-6-1919: Bước nhận thức mới về quyền tự do, dân chủ của nhân dân trong tư tưởng Hồ Chí Minh khi Người thay mặt những người Việt Nam yêu nước ở Pháp, gửi Yêu sách của nhân dân An Nam tới Hội nghị Vécxây, đòi quyền tự do, dân chủ cho nhân dân Việt Nam."
  },
  {
    id: "evt-05",
    yearLabel: "Tháng 7/1920",
    sortYear: 1920,
    title: "Đọc Luận cương của V.I. Lênin",
    description:
      "Đọc Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa của V.I. Lênin.",
    markerId: "marker-3",
    image: "/media/event-5.jpg",
    details: "**Xác định con đường cách mạng:**\nTháng 7-1920: Nghiên cứu \"Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa\" của V.I. Lênin và nhiều tài liệu liên quan đến Quốc tế Cộng sản và tích cực tham gia các hoạt động thực tế trong Đảng Xã hội Pháp.\n\n→ Người tìm thấy ở đây con đường cách mạng vô sản."
  },
  {
    id: "evt-06",
    yearLabel: "Tháng 12/1920",
    sortYear: 1920,
    title: "Đại hội Tua – Sáng lập Đảng Cộng sản Pháp",
    description:
      "Dự Đại hội Tua, bỏ phiếu tán thành Quốc tế Cộng sản và tham gia sáng lập Đảng Cộng sản Pháp.",
    markerId: "marker-3",
    image: "/media/event-6.jpg",
    details: "Tháng 12-1920: Hồ Chí Minh cùng những người phái tả trong Đảng Xã hội Pháp tại Đại hội ở thành phố Tua.\n\n→ Bước ngoặt chủ nghĩa yêu nước kết hợp chặt chẽ với lập trường cách mạng vô sản."
  },
  {
    id: "evt-07",
    yearLabel: "1921 – 1922",
    sortYear: 1921,
    title: "Hội Liên hiệp thuộc địa & báo Le Paria",
    description:
      "Sáng lập Hội Liên hiệp thuộc địa, làm Trưởng Tiểu ban Nghiên cứu vấn đề dân tộc thuộc địa và sáng lập báo Le Paria.",
    markerId: "marker-3",
    image: "/media/event-7.jpg",
    details: "**Thời kỳ từ cuối năm 1920 đến đầu năm 1930:** Hình thành những nội dung cơ bản tư tưởng về cách mạng Việt Nam.\n\nNgười tích cực sử dụng báo chí Pháp lên án chủ nghĩa thực dân Pháp để thức tỉnh tinh thần giải phóng dân tộc của nhân dân các nước thuộc địa và của dân tộc Việt Nam."
  },
  {
    id: "evt-08",
    yearLabel: "1925 – 1927",
    sortYear: 1925,
    title: "Hội VN Cách mạng Thanh niên & Đường cách mệnh",
    description:
      "Sáng lập Hội Việt Nam Cách mạng Thanh niên ở Quảng Châu và xuất bản tác phẩm Đường cách mệnh.",
    markerId: "marker-4",
    image: "/media/event-8.jpg",
    details: "Tháng 6-1925: Sáng lập tổ chức tiền thân của Đảng Cộng sản: Hội Việt Nam Thanh niên Cách mạng, ra báo Thanh niên bằng tiếng Việt, truyền bá chủ nghĩa Mác - Lênin và lý luận cách mạng trong những người yêu nước và công nhân.\n\nNăm 1927: Xuất bản tác phẩm lý luận cốt lõi **Đường cách mệnh**, chuẩn bị mọi mặt về chính trị, tư tưởng, tổ chức cho sự ra đời của Đảng Cộng sản Việt Nam."
  },
  {
    id: "evt-09",
    yearLabel: "Đầu năm 1930",
    sortYear: 1930,
    title: "Thành lập Đảng Cộng sản Việt Nam",
    description:
      "Chủ trì Hội nghị hợp nhất, thành lập Đảng Cộng sản Việt Nam và thông qua Cương lĩnh chính trị đầu tiên.",
    markerId: "marker-4",
    image: "/media/event-9.jpg",
    details: "**Dấu mốc thành lập Đảng Cộng sản:**\nĐầu năm 1930: Chủ trì Hội nghị hợp nhất các tổ chức cộng sản Việt Nam thành Đảng Cộng sản Việt Nam, thông qua các văn kiện do Người khởi thảo làm nên Cương lĩnh chính trị đầu tiên của Đảng.\n\n**Tư tưởng cốt lõi của Cương lĩnh:**\n- \"Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản\", \"đánh đổ đế quốc Pháp, phong kiến An Nam và giai cấp tư sản phản cách mạng\", giương cao ngọn cờ độc lập dân tộc và chủ nghĩa xã hội.\n- Khẳng định sự lãnh đạo của Đảng Cộng sản Việt Nam.\n- Liên minh công nông là lực lượng nòng cốt.\n- Cách mạng Việt Nam là một bộ phận cách mạng thế giới.\n\nSự kiện này đã chấm dứt cuộc khủng hoảng về đường lối và tổ chức lãnh đạo cách mạng Việt Nam kéo dài suốt từ cuối thế kỷ XIX sang đầu năm 1930."
  },
  {
    id: "evt-10",
    yearLabel: "1934 – 1938",
    sortYear: 1934,
    title: "Học tại Trường quốc tế Lênin",
    description:
      "Học tại Trường quốc tế Lênin và làm nghiên cứu sinh tại Viện Nghiên cứu các vấn đề dân tộc và thuộc địa.",
    markerId: "marker-5",
    image: "/media/event-10.jpg",
    details: "**Thời kỳ 1930 – đầu 1941:** Vượt qua thử thách, giữ vững đường lối đúng đắn.\n\nThử thách đến từ cả kẻ thù lẫn nội bộ những người cách mạng. Một số người trong Quốc tế Cộng sản và Đảng Cộng sản Việt Nam chịu ảnh hưởng quan điểm \"giáo điều tả khuynh\", không hiểu đúng tình hình thuộc địa/Đông Dương. Tư tưởng của Hồ Chí Minh bị phê phán, quy kết là \"hữu khuynh\", \"dân tộc chủ nghĩa\".\n\n**Mốc sự kiện chính:**\n- 10-1930: Hội nghị Trung ương Đảng ra nghị quyết phê phán Hội nghị hợp nhất.\n- 1934: Thoát ngục Hồng Kông, sang Liên Xô học Trường Quốc tế Lênin.\n- 1934–1938: Vẫn bị hiểu lầm về hoạt động và quan điểm cách mạng.\n- 6-6-1938: Gửi thư xin Quốc tế Cộng sản cho về nước hoạt động.\n- 10-1938: Rời Liên Xô, qua Trung Quốc về nước."
  },
  {
    id: "evt-11",
    yearLabel: "Tháng 5/1941",
    sortYear: 1941,
    title: "Trở về Pác Bó – Mặt trận Việt Minh",
    description:
      "Trở về Pác Bó, chủ trì Hội nghị Trung ương Đảng, nêu chủ trương lập Mặt trận Việt Minh.",
    markerId: "marker-6",
    image: "/media/event-11.jpg",
    details: "**Quá trình về nước và Hội nghị Trung ương 8:**\n- 12-1940: Về gần biên giới Việt–Trung, liên lạc với TW Đảng.\n- 1-1941: Mở lớp huấn luyện cán bộ, viết sách Con đường giải phóng.\n- Cuối 1-1941: Hồ Chí Minh về nước.\n- 5-1941: Chủ trì Hội nghị TW Đảng tại Pác Bó (Cao Bằng).\n\n**Nội dung Hội nghị Trung ương tháng 5-1941 (bước ngoặt quan trọng nhất):**\n- Đặt nhiệm vụ giải phóng dân tộc lên hàng đầu: \"quyền lợi dân tộc giải phóng cao hơn hết thảy\".\n- Tạm gác khẩu hiệu cách mạng ruộng đất.\n- Chủ trương lập Mặt trận Việt Minh, đại đoàn kết dân tộc (nòng cốt công–nông), nêu phương hướng khởi nghĩa vũ trang giành chính quyền.\n\n**Ý nghĩa:** Đây là sự \"trở về\" với quan điểm đúng đắn của Hồ Chí Minh đã nêu từ Cương lĩnh chính trị đầu tiên (1930). Đặt nền móng trực tiếp cho thắng lợi Cách mạng Tháng Tám 1945."
  },
  {
    id: "evt-12",
    yearLabel: "02/09/1945",
    sortYear: 1945,
    title: "Tuyên ngôn Độc lập",
    description:
      "Đọc Tuyên ngôn độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    markerId: "marker-7",
    image: "/media/event-12.jpg",
    details: "**Thời kỳ 1941 – tháng 9-1969:** Tư tưởng HCM tiếp tục phát triển, soi đường cách mạng.\n\n**Giai đoạn giành chính quyền (1941–1945):**\n- 19-5-1941: Sáng lập Mặt trận Việt Minh.\n- 22-12-1944: Sáng lập Việt Nam tuyên truyền giải phóng quân.\n- 18-8-1945: Ra Lời kêu gọi Tổng khởi nghĩa → Cách mạng Tháng Tám 1945 thành công.\n- 2-9-1945: Đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.\n\n**Giai đoạn \"ngàn cân treo sợi tóc\" (2-9-1945 → 19-12-1946):**\n- Phương châm: \"Dĩ bất biến, ứng vạn biến\".\n- Sách lược linh hoạt: hòa Tưởng đánh Pháp, rồi hòa Pháp đuổi Tưởng → tranh thủ thời gian củng cố lực lượng. Mẫu mực về \"thêm bạn bớt thù\"."
  },
  {
    id: "evt-13",
    yearLabel: "19/12/1946",
    sortYear: 1946,
    title: "Lời kêu gọi toàn quốc kháng chiến",
    description:
      "Ra Lời kêu gọi toàn quốc kháng chiến chống thực dân Pháp.",
    markerId: "marker-7",
    image: "/media/event-13.jpg",
    details: "Ngày 19-12-1946: Lời kêu gọi Toàn quốc kháng chiến — vừa là đường lối kháng chiến (lâu dài, toàn dân, toàn diện, tự lực cánh sinh), vừa là lời thề bảo vệ Tổ quốc."
  },
  {
    id: "evt-14",
    yearLabel: "1946 – 1954",
    sortYear: 1946,
    title: "Lãnh đạo kháng chiến chống thực dân Pháp",
    description:
      "Đề ra đường lối và trực tiếp lãnh đạo cuộc kháng chiến chống thực dân Pháp thắng lợi.",
    markerId: "marker-7",
    image: "/media/event-14.jpg",
    details: "**Kháng chiến chống Pháp (1946–1954):**\nHoàn thiện lý luận cách mạng dân tộc dân chủ nhân dân; bắt đầu hình thành tư tưởng xây dựng CNXH.\n\nNăm 1954: Kháng chiến chống Pháp thắng lợi → miền Bắc bước vào thời kỳ quá độ lên CNXH."
  },
  {
    id: "evt-15",
    yearLabel: "1954 – 1969",
    sortYear: 1954,
    title: "Xây dựng CNXH miền Bắc & cách mạng miền Nam",
    description:
      "Lãnh đạo thực hiện đồng thời hai nhiệm vụ chiến lược là xây dựng chủ nghĩa xã hội ở miền Bắc và cách mạng dân tộc dân chủ nhân dân ở miền Nam.",
    markerId: "marker-7",
    image: "/media/event-15.jpg",
    details: "**Hai nhiệm vụ chiến lược song song (1954–1969):**\n- Miền Bắc: xây dựng CNXH.\n- Miền Nam: tiếp tục cách mạng dân tộc dân chủ nhân dân.\n- Mục tiêu chung: hòa bình, độc lập, thống nhất đất nước.\n\nHồ Chí Minh bổ sung hoàn thiện tư tưởng trên mọi lĩnh vực: chính trị, kinh tế, quân sự, văn hóa, đạo đức, đối ngoại…\n\n**Đỉnh cao tư tưởng thời kỳ kháng chiến chống Mỹ:**\n- 17-7-1966: Lời kêu gọi với chân lý thời đại: \"Không có gì quý hơn độc lập, tự do\".\n- Trước lúc đi xa: để lại Di chúc — văn kiện lịch sử vô giá, mong muốn cuối cùng: xây dựng nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ, giàu mạnh, góp phần vào cách mạng thế giới."
  },
];

// ─── Helper: lấy danh sách sự kiện theo marker ───
export function getEventsByMarker(markerId: string): HistoricalEvent[] {
  return events.filter((e) => e.markerId === markerId);
}

// ─── Helper: lấy marker từ event ───
export function getMarkerForEvent(event: HistoricalEvent): Marker | undefined {
  return markers.find((m) => m.id === event.markerId);
}
