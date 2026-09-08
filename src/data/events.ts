export interface HistoricalEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  period: number;
  periodName: string;
  periodColor: string;
}

export interface Period {
  id: number;
  name: string;
  timeRange: string;
  color: string;
  description: string;
}

export const periods: Period[] = [
  {
    id: 1,
    name: "Hình thành tư tưởng yêu nước",
    timeRange: "1890 – 1911",
    color: "#d4a847",
    description: "Từ quê hương Nghệ An đến Bến Nhà Rồng – hình thành chí hướng cứu nước",
  },
  {
    id: 2,
    name: "Tìm đường cứu nước",
    timeRange: "1911 – 1920",
    color: "#c05746",
    description: "Bôn ba khắp thế giới, tìm ra con đường cách mạng vô sản",
  },
  {
    id: 3,
    name: "Hình thành tư tưởng cách mạng",
    timeRange: "1921 – 1930",
    color: "#7b6b8a",
    description: "Hoạt động tại Pháp, Liên Xô, Trung Quốc – sáng lập Đảng Cộng sản Việt Nam",
  },
  {
    id: 4,
    name: "Vượt qua thử thách",
    timeRange: "1930 – 1945",
    color: "#5a8a6c",
    description: "Kiên trì con đường cách mạng, lãnh đạo giành độc lập dân tộc",
  },
  {
    id: 5,
    name: "Phát triển & hoàn thiện",
    timeRange: "1945 – 1969",
    color: "#4a7a9b",
    description: "Lãnh đạo kháng chiến, xây dựng chủ nghĩa xã hội, để lại Di chúc bất hủ",
  },
];

export const events: HistoricalEvent[] = [
  // ═══ GIAI ĐOẠN 1: Trước 1911 ═══
  {
    id: "evt-01",
    year: 1890,
    month: 5,
    title: "Nguyễn Sinh Cung chào đời",
    description:
      "Nguyễn Sinh Cung (sau này là Hồ Chí Minh) sinh ngày 19/5/1890 tại làng Hoàng Trù, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An, trong một gia đình nhà Nho yêu nước. Cha là cụ Phó bảng Nguyễn Sinh Sắc, mẹ là bà Hoàng Thị Loan.",
    location: "Kim Liên, Nam Đàn, Nghệ An",
    coordinates: [105.56, 18.66],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },
  {
    id: "evt-02",
    year: 1895,
    title: "Lần đầu vào Huế",
    description:
      "Nguyễn Sinh Cung theo cha vào Huế lần đầu tiên. Tại đây, cậu bé sớm tiếp xúc với văn hóa kinh kỳ và chứng kiến cuộc sống cơ cực của nhân dân dưới ách thống trị thực dân Pháp.",
    location: "Huế, Thừa Thiên Huế",
    coordinates: [107.59, 16.46],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },
  {
    id: "evt-03",
    year: 1907,
    title: "Học tại trường Quốc học Huế",
    description:
      "Nguyễn Tất Thành (tên mới) theo học tại trường Quốc học Huế (1907–1908). Tại đây, Người tiếp thu tư tưởng dân chủ phương Tây qua các thầy giáo tiến bộ và bắt đầu nuôi dưỡng tinh thần yêu nước.",
    location: "Trường Quốc học Huế",
    coordinates: [107.588, 16.466],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },
  {
    id: "evt-04",
    year: 1908,
    month: 4,
    title: "Tham gia phong trào chống thuế",
    description:
      "Tháng 4/1908, Nguyễn Tất Thành tham gia phong trào chống thuế của nông dân Trung Kỳ. Sự kiện này đánh dấu bước đầu tiên Người tham gia vào phong trào đấu tranh chống thực dân, dẫn đến bị đuổi khỏi trường Quốc học Huế.",
    location: "Trung Kỳ (Huế)",
    coordinates: [107.59, 16.45],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },
  {
    id: "evt-05",
    year: 1910,
    title: "Dạy học tại trường Dục Thanh",
    description:
      "Từ tháng 9/1910 đến tháng 2/1911, Nguyễn Tất Thành dạy học tại trường Dục Thanh ở Phan Thiết. Đây là thời gian Người vừa dạy học vừa nung nấu ý chí ra đi tìm đường cứu nước.",
    location: "Trường Dục Thanh, Phan Thiết",
    coordinates: [108.1, 10.93],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },
  {
    id: "evt-06",
    year: 1911,
    month: 6,
    title: "Ra đi tìm đường cứu nước",
    description:
      "Ngày 5/6/1911, tại Bến Nhà Rồng (Sài Gòn), Nguyễn Tất Thành với tên Văn Ba lên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước. Đây là bước ngoặt lịch sử, mở đầu hành trình 30 năm bôn ba khắp năm châu bốn biển.",
    location: "Bến Nhà Rồng, Sài Gòn",
    coordinates: [106.705, 10.768],
    period: 1,
    periodName: "Hình thành tư tưởng yêu nước",
    periodColor: "#d4a847",
  },

  // ═══ GIAI ĐOẠN 2: 1911–1920 ═══
  {
    id: "evt-07",
    year: 1912,
    title: "Đến nước Mỹ",
    description:
      "Nguyễn Tất Thành đến nước Mỹ, sống và làm việc tại nhiều thành phố. Tại đây, Người chứng kiến sự phân biệt chủng tộc đối với người da đen và tìm hiểu về Tuyên ngôn Độc lập của nước Mỹ năm 1776.",
    location: "New York, Hoa Kỳ",
    coordinates: [-74.006, 40.7128],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },
  {
    id: "evt-08",
    year: 1913,
    title: "Đến nước Anh",
    description:
      "Nguyễn Tất Thành đến London, làm nhiều nghề để kiếm sống như cào tuyết, đốt lò, phụ bếp. Người nghiên cứu về chủ nghĩa tư bản Anh và tham gia sinh hoạt trong phong trào công nhân Anh.",
    location: "London, Anh",
    coordinates: [-0.1276, 51.5074],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },
  {
    id: "evt-09",
    year: 1917,
    title: "Trở lại Pháp hoạt động",
    description:
      "Nguyễn Tất Thành trở lại Pháp, bắt đầu tham gia tích cực vào phong trào công nhân và những người yêu nước Pháp. Người gia nhập Đảng Xã hội Pháp – chính đảng duy nhất lúc đó ủng hộ quyền của các dân tộc thuộc địa.",
    location: "Paris, Pháp",
    coordinates: [2.3522, 48.8566],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },
  {
    id: "evt-10",
    year: 1919,
    month: 6,
    title: "Yêu sách của nhân dân An Nam",
    description:
      "Tháng 6/1919, với tên Nguyễn Ái Quốc, Người gửi bản \"Yêu sách của nhân dân An Nam\" (Revendications du peuple annamite) tới Hội nghị Versailles, đòi quyền tự do, dân chủ cho nhân dân Việt Nam. Sự kiện gây tiếng vang lớn trong dư luận quốc tế.",
    location: "Versailles, Pháp",
    coordinates: [2.1204, 48.8049],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },
  {
    id: "evt-11",
    year: 1920,
    month: 7,
    title: "Đọc Luận cương của Lenin",
    description:
      "Tháng 7/1920, Nguyễn Ái Quốc đọc \"Sơ thảo lần thứ nhất Luận cương về vấn đề dân tộc và vấn đề thuộc địa\" của V.I. Lenin trên báo L'Humanité. Người đã vui mừng đến phát khóc và nhận ra: \"Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!\"",
    location: "Paris, Pháp",
    coordinates: [2.34, 48.86],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },
  {
    id: "evt-12",
    year: 1920,
    month: 12,
    title: "Sáng lập Đảng Cộng sản Pháp",
    description:
      "Tại Đại hội lần thứ XVIII Đảng Xã hội Pháp (Đại hội Tours, 25-30/12/1920), Nguyễn Ái Quốc bỏ phiếu tán thành gia nhập Quốc tế Cộng sản (Quốc tế III), tham gia sáng lập Đảng Cộng sản Pháp. Đây là bước ngoặt quyết định: từ chủ nghĩa yêu nước sang chủ nghĩa cộng sản.",
    location: "Tours, Pháp",
    coordinates: [0.6848, 47.3941],
    period: 2,
    periodName: "Tìm đường cứu nước",
    periodColor: "#c05746",
  },

  // ═══ GIAI ĐOẠN 3: 1921–1930 ═══
  {
    id: "evt-13",
    year: 1921,
    title: "Sáng lập Hội Liên hiệp thuộc địa",
    description:
      "Năm 1921, tại Paris, Nguyễn Ái Quốc cùng các nhà cách mạng từ các nước thuộc địa sáng lập Hội Liên hiệp thuộc địa và xuất bản báo \"Le Paria\" (Người cùng khổ), tố cáo chế độ thực dân trước dư luận quốc tế.",
    location: "Paris, Pháp",
    coordinates: [2.36, 48.87],
    period: 3,
    periodName: "Hình thành tư tưởng cách mạng",
    periodColor: "#7b6b8a",
  },
  {
    id: "evt-14",
    year: 1923,
    title: "Đến Liên Xô",
    description:
      "Tháng 6/1923, Nguyễn Ái Quốc đến Moscow (Liên Xô), học tập tại Đại học Phương Đông. Tại đây, Người nghiên cứu sâu về chủ nghĩa Marx-Lenin và dự Đại hội Quốc tế Nông dân (10/1923), Đại hội V Quốc tế Cộng sản (6-7/1924).",
    location: "Moscow, Liên Xô",
    coordinates: [37.6173, 55.7558],
    period: 3,
    periodName: "Hình thành tư tưởng cách mạng",
    periodColor: "#7b6b8a",
  },
  {
    id: "evt-15",
    year: 1925,
    title: "Thành lập Hội VN Cách mạng Thanh niên",
    description:
      "Tháng 6/1925, tại Quảng Châu (Trung Quốc), Nguyễn Ái Quốc thành lập Hội Việt Nam Cách mạng Thanh niên – tổ chức tiền thân của Đảng Cộng sản Việt Nam. Cùng thời gian, Người xuất bản tác phẩm \"Bản án chế độ thực dân Pháp\" tại Paris.",
    location: "Quảng Châu, Trung Quốc",
    coordinates: [113.2644, 23.1291],
    period: 3,
    periodName: "Hình thành tư tưởng cách mạng",
    periodColor: "#7b6b8a",
  },
  {
    id: "evt-16",
    year: 1927,
    title: "Xuất bản \"Đường Cách mệnh\"",
    description:
      "Năm 1927, tác phẩm \"Đường Cách mệnh\" được xuất bản, tập hợp các bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện chính trị ở Quảng Châu. Đây là tác phẩm lý luận quan trọng, vạch ra con đường cách mạng Việt Nam.",
    location: "Quảng Châu, Trung Quốc",
    coordinates: [113.27, 23.13],
    period: 3,
    periodName: "Hình thành tư tưởng cách mạng",
    periodColor: "#7b6b8a",
  },
  {
    id: "evt-17",
    year: 1930,
    month: 2,
    title: "Thành lập Đảng Cộng sản Việt Nam",
    description:
      "Ngày 3/2/1930, tại Cửu Long (Hồng Kông), Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất ba tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam. Người soạn thảo Cương lĩnh chính trị đầu tiên của Đảng – văn kiện lịch sử mang tầm vóc thời đại.",
    location: "Cửu Long, Hồng Kông",
    coordinates: [114.1694, 22.3193],
    period: 3,
    periodName: "Hình thành tư tưởng cách mạng",
    periodColor: "#7b6b8a",
  },

  // ═══ GIAI ĐOẠN 4: 1930–1945 ═══
  {
    id: "evt-18",
    year: 1931,
    month: 6,
    title: "Bị bắt tại Hồng Kông",
    description:
      "Ngày 6/6/1931, Nguyễn Ái Quốc bị cảnh sát Anh bắt tại Hồng Kông. Nhờ sự giúp đỡ của luật sư Frank Loseby và Quốc tế Cộng sản, Người được trả tự do sau hơn một năm bị giam giữ.",
    location: "Hồng Kông",
    coordinates: [114.17, 22.32],
    period: 4,
    periodName: "Vượt qua thử thách",
    periodColor: "#5a8a6c",
  },
  {
    id: "evt-19",
    year: 1941,
    month: 1,
    title: "Về nước lãnh đạo cách mạng",
    description:
      "Ngày 28/1/1941, sau 30 năm bôn ba ở nước ngoài, Nguyễn Ái Quốc trở về Tổ quốc tại Pác Bó (Cao Bằng). Tháng 5/1941, Người triệu tập Hội nghị Trung ương lần thứ 8, thành lập Mặt trận Việt Minh, chuẩn bị lực lượng cho cuộc Tổng khởi nghĩa.",
    location: "Pác Bó, Cao Bằng",
    coordinates: [106.06, 22.84],
    period: 4,
    periodName: "Vượt qua thử thách",
    periodColor: "#5a8a6c",
  },
  {
    id: "evt-20",
    year: 1945,
    month: 8,
    title: "Cách mạng Tháng Tám thành công",
    description:
      "Tháng 8/1945, dưới sự lãnh đạo của Hồ Chí Minh và Đảng Cộng sản, nhân dân Việt Nam tiến hành cuộc Tổng khởi nghĩa Cách mạng Tháng Tám thành công trên cả nước, lật đổ chế độ phong kiến và ách thực dân.",
    location: "Tân Trào, Tuyên Quang",
    coordinates: [105.54, 21.77],
    period: 4,
    periodName: "Vượt qua thử thách",
    periodColor: "#5a8a6c",
  },
  {
    id: "evt-21",
    year: 1945,
    month: 9,
    title: "Tuyên ngôn Độc lập",
    description:
      "Ngày 2/9/1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa. Bản Tuyên ngôn khẳng định: \"Tất cả mọi người đều sinh ra có quyền bình đẳng...\"",
    location: "Quảng trường Ba Đình, Hà Nội",
    coordinates: [105.834, 21.0368],
    period: 4,
    periodName: "Vượt qua thử thách",
    periodColor: "#5a8a6c",
  },

  // ═══ GIAI ĐOẠN 5: 1945–1969 ═══
  {
    id: "evt-22",
    year: 1946,
    month: 12,
    title: "Lời kêu gọi toàn quốc kháng chiến",
    description:
      "Ngày 19/12/1946, Chủ tịch Hồ Chí Minh ra \"Lời kêu gọi toàn quốc kháng chiến\", mở đầu cuộc kháng chiến chống thực dân Pháp: \"...Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ!\"",
    location: "Hà Nội",
    coordinates: [105.84, 21.03],
    period: 5,
    periodName: "Phát triển & hoàn thiện",
    periodColor: "#4a7a9b",
  },
  {
    id: "evt-23",
    year: 1954,
    month: 5,
    title: "Chiến thắng Điện Biên Phủ",
    description:
      "Ngày 7/5/1954, chiến thắng Điện Biên Phủ \"lừng lẫy năm châu, chấn động địa cầu\" kết thúc 9 năm kháng chiến chống Pháp. Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, quân dân ta đã làm nên chiến thắng lịch sử vĩ đại.",
    location: "Điện Biên Phủ",
    coordinates: [103.0189, 21.3891],
    period: 5,
    periodName: "Phát triển & hoàn thiện",
    periodColor: "#4a7a9b",
  },
  {
    id: "evt-24",
    year: 1969,
    month: 9,
    title: "Chủ tịch Hồ Chí Minh từ trần & Di chúc",
    description:
      "Ngày 2/9/1969, Chủ tịch Hồ Chí Minh từ trần tại Hà Nội, để lại bản Di chúc lịch sử – đỉnh cao của tư tưởng Hồ Chí Minh. Di chúc thể hiện tình yêu thương vô hạn đối với nhân dân, niềm tin vào thắng lợi cuối cùng: \"Không có gì quý hơn độc lập, tự do.\"",
    location: "Hà Nội",
    coordinates: [105.836, 21.038],
    period: 5,
    periodName: "Phát triển & hoàn thiện",
    periodColor: "#4a7a9b",
  },
];
