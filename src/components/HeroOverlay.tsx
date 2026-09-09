"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface HeroOverlayProps {
  onStart: () => void;
}

// ============================================================
// GLOSSARY DATA
// ============================================================
const glossary: Record<string, { title: string; desc: string }> = {
  "1858": {
    title: "Mốc Lịch Sử 1858",
    desc: "Ngày 1/9/1858, liên quân thực dân Pháp và Tây Ban Nha nổ súng tấn công bán đảo Sơn Trà (Đà Nẵng), chính thức mở đầu cuộc chiến tranh xâm lược Việt Nam."
  },
  "cần vương": {
    title: "Phong trào Cần Vương",
    desc: "Phong trào phò vua cứu nước (1885 – 1896) do Tôn Thất Thuyết nhân danh vua Hàm Nghi phát động, tập hợp các sĩ phu, văn thân yêu nước đứng lên chống Pháp."
  },
  "cách mạng tháng mười Nga (1917)": {
    title: "Cách mạng Tháng Mười Nga (1917)",
    desc: "Cuộc cách mạng vô sản vĩ đại do V.I. Lênin và Đảng Bolshevik lãnh đạo năm 1917, đập tan ách thống trị của giai cấp tư sản và phong kiến, lập nên nhà nước công nông đầu tiên trên thế giới."
  },
  "thư gửi Hội Phật tử 1947": {
    title: "Thư gửi Hội Phật tử Việt Nam (1947)",
    desc: "Bức thư của Chủ tịch Hồ Chí Minh khẳng định: 'Đức Phật từ bi cứu khổ, cứu nạn, muốn cứu chúng sinh ra khỏi ách khổ thì phải ra sức kháng chiến chống thực dân Pháp bạo tàn'."
  },
  "Tết trồng cây": {
    title: "Phong Trào Tết Trồng Cây",
    desc: "Sáng kiến do Chủ tịch Hồ Chí Minh phát động mùa xuân năm 1960 với lời kêu gọi 'Mùa xuân là Tết trồng cây / Làm cho đất nước càng ngày càng xuân', kết hợp hài hòa giữa môi trường sinh thái và đời sống nhân dân."
  },
  "Tuyên ngôn Độc lập năm 1776 của Mỹ": {
    title: "Tuyên ngôn Độc lập Mỹ (1776)",
    desc: "Áng văn lập quốc kinh điển của Thomas Jefferson, Hồ Chí Minh đã trích dẫn câu bất hủ: 'Tất cả mọi người đều sinh ra có quyền bình đẳng; tạo hóa cho họ những quyền không ai có thể xâm phạm được'."
  },
  "Vonte, Rútxô, Môngtétxkiơ": {
    title: "Các Triết Gia Khai Sáng Pháp",
    desc: "Voltaire, J.J. Rousseau và Montesquieu: những đại diện tiêu biểu của triết học khai sáng Pháp thế kỷ XVIII, đề xướng tư tưởng tự do cá nhân, khế ước xã hội, chủ quyền nhân dân và tam quyền phân lập."
  },
  "khoảng 30 nước": {
    title: "Hành trình bôn ba tìm đường cứu nước",
    desc: "Trong 30 năm (1911 – 1941), Người đã đi qua khoảng 30 quốc gia trên 4 châu lục (Á, Âu, Phi, Mỹ), khảo sát thực tế tình hình các nước tư bản và thuộc địa để tìm con đường giải phóng cho dân tộc."
  }
};

// ============================================================
// ARCHIVE DATA
// ============================================================
interface Dossier {
  id: string;
  tabTitle: string;
  badge: string;
  est: string;
  html: string;
}

interface NodeData {
  roman: string;
  title: string;
  footnote: string;
  nextText: string;
  dossiers: Dossier[];
}

const archiveData: Record<number, NodeData> = {
  1: {
    roman: "NỀN TẢNG I",
    title: "Cơ sở Thực tiễn",
    footnote: "Nền tảng 1 / 3: Khảo cứu bối cảnh thực tiễn trong nước và quốc tế",
    nextText: "HOÀN THÀNH CƠ SỞ THỰC TIỄN → NỀN TẢNG TIẾP THEO",
    dossiers: [
      {
        id: "sec-1-1",
        tabTitle: "THỰC TIỄN VIỆT NAM CUỐI THẾ KỶ XIX – ĐẦU THẾ KỶ XX",
        badge: "Phần 1",
        est: "3 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">CƠ SỞ THỰC TIỄN • PHẦN 1/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Thực tiễn Việt Nam cuối thế kỷ XIX – đầu thế kỷ XX</h3>
          <div class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3" style="font-family:inherit;font-size:16px;line-height:1.7;color:rgba(236,224,217,0.95)">
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Từ năm <span class="gls-term" data-term="1858" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">1858</span>, thực dân Pháp xâm lược, từng bước biến nước ta từ một nước phong kiến độc lập thành nước thuộc địa nửa phong kiến.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Các phong trào đấu tranh vũ trang chống Pháp dưới ngọn cờ phong kiến ("<span class="gls-term" data-term="cần vương" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">Cần Vương</span>") đều thất bại, chứng tỏ hệ tư tưởng phong kiến đã tỏ ra lỗi thời trước các nhiệm vụ lịch sử.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Đầu thế kỷ XX, các phong trào yêu nước theo khuynh hướng dân chủ tư sản (Đông Du, Duy Tân, Đông Kinh Nghĩa Thục) cũng gặp thất bại do giai cấp tư sản còn non yếu và chưa có đường lối, phương pháp cách mạng đúng đắn.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Quá trình khai thác thuộc địa làm xã hội Việt Nam biến đổi sâu sắc, xuất hiện mâu thuẫn mới giữa giai cấp công nhân với giai cấp tư sản, và giữa toàn thể nhân dân Việt Nam với thực dân Pháp xâm lược.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Giai cấp công nhân Việt Nam ra đời, chịu ba tầng áp bức bóc lột (thực dân, tư bản, phong kiến) đã sớm vươn lên đấu tranh, tạo điều kiện thuận lợi để chủ nghĩa Mác – Lênin truyền bá vào Việt Nam.</span>
            </div>
          </div>
          <div class="relative mt-5 p-4 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border-l-4 border-[#f2ca50] rounded-r border border-[#f2ca50]/30 shadow-md flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm">
              §
            </div>
            <div>
              <div style="font-family:inherit" class="text-xs uppercase tracking-wider text-[#ffe088] font-bold mb-1">KẾT LUẬN</div>
              <p style="font-family:inherit" class="text-sm text-[#ece0d9] font-medium leading-relaxed">Sự bế tắc của các phong trào cứu nước cũ và sự lớn mạnh của giai cấp công nhân đặt ra yêu cầu bức thiết phải tìm ra một con đường cách mạng mới.</p>
            </div>
          </div>
        </div>`
      },
      {
        id: "sec-1-2",
        tabTitle: "THỰC TIỄN THẾ GIỚI CUỐI THẾ KỶ XIX – ĐẦU THẾ KỶ XX",
        badge: "Phần 2",
        est: "3 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">CƠ SỞ THỰC TIỄN • PHẦN 2/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Thực tiễn thế giới cuối thế kỷ XIX – đầu thế kỷ XX</h3>
          <div class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3" style="font-family:inherit;font-size:16px;line-height:1.7;color:rgba(236,224,217,0.95)">
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Giai đoạn này, chủ nghĩa tư bản đã phát triển từ giai đoạn tự do cạnh tranh sang giai đoạn đế quốc chủ nghĩa, chi phối toàn bộ đời sống kinh tế – chính trị thế giới.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Phần lớn các nước châu Á, châu Phi và Mỹ Latinh trở thành thuộc địa, làm gay gắt thêm mâu thuẫn giữa các dân tộc thuộc địa, phụ thuộc với chủ nghĩa đế quốc.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span><span class="gls-term" data-term="cách mạng tháng mười Nga (1917)" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">Cách mạng Tháng Mười Nga (1917)</span> thành công là thắng lợi đầu tiên của chủ nghĩa Mác – Lênin ở một nước lớn, mở ra thời đại quá độ từ chủ nghĩa tư bản lên chủ nghĩa xã hội trên phạm vi toàn thế giới.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Thắng lợi này cùng sự ra đời của Quốc tế Cộng sản (tháng 3/1919) đã mở ra con đường giải phóng cho các dân tộc bị áp bức và thúc đẩy phong trào giải phóng dân tộc phát triển mạnh mẽ.</span>
            </div>
          </div>
          <div class="relative mt-5 p-4 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border-l-4 border-[#f2ca50] rounded-r border border-[#f2ca50]/30 shadow-md flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm">
              §
            </div>
            <div>
              <div style="font-family:inherit" class="text-xs uppercase tracking-wider text-[#ffe088] font-bold mb-1">KẾT LUẬN</div>
              <p style="font-family:inherit" class="text-sm text-[#ece0d9] font-medium leading-relaxed">Sự chuyển biến của chủ nghĩa tư bản cùng thắng lợi của Cách mạng Tháng Mười Nga đã chỉ ra thời cơ và phương hướng giải phóng tất yếu cho các dân tộc thuộc địa.</p>
            </div>
          </div>
        </div>`
      },
      {
        id: "sec-1-3",
        tabTitle: "GIÁ TRỊ TRUYỀN THỐNG TỐT ĐẸP CỦA DÂN TỘC",
        badge: "Phần 3",
        est: "3 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">CƠ SỞ THỰC TIỄN • PHẦN 3/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Giá trị truyền thống tốt đẹp của dân tộc Việt Nam</h3>
          <div class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3" style="font-family:inherit;font-size:16px;line-height:1.7;color:rgba(236,224,217,0.95)">
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Chủ nghĩa yêu nước là giá trị xuyên suốt lịch sử dân tộc, đồng thời là nền tảng tư tưởng, điểm xuất phát và động lực thúc đẩy Hồ Chí Minh ra đi tìm đường cứu nước.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Kế thừa và phát triển tinh thần đấu tranh anh dũng, bất khuất vì độc lập, tự do của Tổ quốc nhằm bảo vệ chủ quyền quốc gia và toàn vẹn lãnh thổ.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Hồ Chí Minh hết sức chú trọng kế thừa các giá trị nhân ái, khoan dung trong cộng đồng, hòa hiếu với lân bang, cùng tinh thần cần cù, dũng cảm, sáng tạo, lạc quan của dân tộc.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="font-family:inherit;color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Phát triển tư tưởng "dân là gốc của nước", coi con người là nhân tố quyết định thành công của cách mạng và xác định đoàn kết dân tộc gắn liền với đoàn kết quốc tế là nguyên tắc chiến lược quyết định thắng lợi.</span>
            </div>
          </div>
          <div class="relative mt-5 p-4 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border-l-4 border-[#f2ca50] rounded-r border border-[#f2ca50]/30 shadow-md flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm">
              §
            </div>
            <div>
              <div style="font-family:inherit" class="text-xs uppercase tracking-wider text-[#ffe088] font-bold mb-1">KẾT LUẬN</div>
              <p style="font-family:inherit" class="text-sm text-[#ece0d9] font-medium leading-relaxed">Chủ nghĩa yêu nước và tinh thần đoàn kết, nhân ái chính là cội nguồn sức mạnh, là động lực tinh thần to lớn nhất thôi thúc Nguyễn Tất Thành ra đi tìm đường cứu nước.</p>
            </div>
          </div>
        </div>`
      }
    ]
  },
  2: {
    roman: "NỀN TẢNG II",
    title: "Tinh hoa Văn hóa Nhân loại",
    footnote: "Nền tảng 2 / 3: Giá trị tư tưởng Đông và Tây",
    nextText: "HOÀN THÀNH NỀN TẢNG II → TIẾP TỤC",
    dossiers: [
      {
        id: "sec-2-1",
        tabTitle: "VĂN HÓA PHƯƠNG ĐÔNG: NHO GIÁO & PHẬT GIÁO",
        badge: "Phần 1",
        est: "4 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">TINH HOA VĂN HÓA NHÂN LOẠI • PHẦN 1/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Tinh hoa văn hóa nhân loại</h3>
          <h4 style="font-family:inherit" class="text-lg text-[#ffe088] font-bold">Tinh hoa văn hóa phương Đông</h4>
          <p style="font-family:inherit" class="text-[#ece0d9]/90 p-3 bg-[#f2ca50]/10 border-l-4 border-[#f2ca50] rounded-r leading-relaxed">Tinh hoa văn hóa, tư tưởng phương Đông kết tinh trong ba học thuyết lớn Nho giáo, Phật giáo, Lão giáo, có ảnh hưởng sâu rộng ở phương Đông và Việt Nam trước đây.</p>
          <div class="p-4 bg-[#1e1711] border border-[#f2ca50]/20 rounded space-y-2">
            <p style="font-family:inherit" class="text-[#f2ca50] font-bold text-base">Về Nho giáo,</p>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95)" class="space-y-2 pl-3">
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Hồ Chí Minh kế thừa và đổi mới tư tưởng dùng nhân trị, đức trị để quản lý xã hội.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa và phát triển quan niệm của Nho giáo về việc xây dựng một xã hội lý tưởng trong đó công bằng, bác ái, nhân, nghĩa, trí, dũng, tín, liêm được coi trọng để có thể đi đến một thế giới đại đồng với hòa bình, không có chiến tranh, các dân tộc có quan hệ hữu nghị và hợp tác.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa, đổi mới, phát triển tinh thần trọng đạo đức của Nho giáo trong việc tu dưỡng, rèn luyện đạo đức con người.</span></li>
            </ul>
          </div>
          <div class="p-4 bg-[#1e1711] border border-[#f2ca50]/20 rounded space-y-3">
            <p style="font-family:inherit" class="text-[#f2ca50] font-bold text-base">Về Phật giáo,</p>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95)" class="space-y-2 pl-3">
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa, phát triển tư tưởng từ bi, vị tha, yêu thương con người, khuyến khích làm việc thiện, chống lại điều ác; đề cao quyền bình đẳng của con người và chân lý; khuyên con người sống hòa đồng, gắn bó với đất nước.</span></li>
            </ul>
            <div style="font-family:inherit" class="p-3 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border border-[#f2ca50]/30 rounded text-[#ece0d9] text-sm space-y-1">
              <div style="font-family:inherit" class="flex items-center gap-2 text-[#f2ca50] text-xs font-bold uppercase tracking-wider"><span>✦</span> <span>VẬN DỤNG ĐOÀN KẾT TOÀN DÂN:</span></div>
              <p>Được Hồ Chí Minh vận dụng sáng tạo để đoàn kết đồng bào theo đạo Phật, đoàn kết toàn dân vì nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ và giàu mạnh.</p>
              <p class="text-[#ffe088]">Dẫn chứng: trong <span class="gls-term" data-term="thư gửi Hội Phật tử 1947" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">thư gửi Hội Phật tử 1947</span>.</p>
            </div>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95)" class="space-y-2 pl-3 mt-2">
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa, phát triển những tư tưởng nhân bản, đạo đức tích cực trong Phật giáo vào việc xây dựng xã hội mới, con người mới Việt Nam.</span></li>
            </ul>
          </div>
        </div>`
      },
      {
        id: "sec-2-2",
        tabTitle: "LÃO GIÁO & CÁC TRÀO LƯU PHƯƠNG ĐÔNG KHÁC",
        badge: "Phần 2",
        est: "4 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">TINH HOA VĂN HÓA NHÂN LOẠI • PHẦN 2/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <div class="p-4 bg-[#1e1711] border border-[#f2ca50]/20 rounded space-y-3">
            <p style="font-family:inherit" class="text-[#f2ca50] font-bold text-base">Về Lão giáo (hoặc Đạo giáo),</p>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95)" class="space-y-2 pl-3">
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa, phát triển tư tưởng của Lão Tử, khuyên con người nên sống gắn bó với thiên nhiên, hòa đồng với thiên nhiên, hơn nữa phải biết bảo vệ môi trường sống.</span></li>
            </ul>
            <div style="font-family:inherit" class="p-3 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border border-[#f2ca50]/30 rounded text-[#ece0d9] text-sm">
              <p>Biểu hiện: Người kêu gọi nhân dân ta trồng cây, tổ chức phong trào "<span class="gls-term" data-term="Tết trồng cây" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">Tết trồng cây</span>" để bảo vệ môi trường sinh thái.</p>
            </div>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95)" class="space-y-2 pl-3 mt-2">
              <li class="flex items-start gap-2"><span style="color:#f2ca50">•</span><span>Kế thừa, phát triển tư tưởng thoát mọi ràng buộc của vòng danh lợi trong Lão giáo.</span></li>
            </ul>
            <div style="font-family:inherit" class="p-3 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border border-[#f2ca50]/30 rounded text-[#ece0d9] text-sm">
              <p>Biểu hiện: Người khuyên cán bộ, đảng viên ít lòng tham muốn về vật chất; thực hiện cần, kiệm, liêm, chính, chí công vô tư; hành động theo đạo lý với ý nghĩa là hành động đúng với quy luật tự nhiên, xã hội.</p>
            </div>
          </div>
          <div style="font-family:inherit;font-size:16px;line-height:1.7" class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3 text-[#ece0d9]/95">
            <div class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700">•</span><span>Kế thừa, phát triển nhiều ý tưởng của các trường phái khác nhau trong các nhà tư tưởng phương Đông cổ đại như Mặc Tử, Hàn Phi Tử, Quản Tử...</span></div>
            <div class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700">•</span><span>Tìm hiểu những trào lưu tư tưởng tiến bộ thời cận hiện đại ở Ấn Độ, Trung Quốc như chủ nghĩa Gandhi, chủ nghĩa Tam dân của Tôn Trung Sơn.</span></div>
            <div class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700">•</span><span>Đã phát triển sáng tạo các quan điểm về dân tộc, dân quyền, dân sinh của Tôn Trung Sơn trong cách mạng dân chủ tư sản thành tư tưởng đấu tranh cho Độc lập – Tự do – Hạnh phúc của con người và dân tộc Việt Nam theo con đường cách mạng vô sản.</span></div>
            <div class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700">•</span><span>Kế thừa và phát triển những tinh hoa trong tư tưởng, văn hóa phương Đông để giải quyết những vấn đề thực tiễn của cách mạng Việt Nam thời hiện đại.</span></div>
          </div>
        </div>`
      },
      {
        id: "sec-2-3",
        tabTitle: "TINH HOA VĂN HÓA PHƯƠNG TÂY",
        badge: "Phần 3",
        est: "3 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">TINH HOA VĂN HÓA NHÂN LOẠI • PHẦN 3/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h4 style="font-family:inherit" class="text-lg text-[#f2ca50] font-bold">Tinh hoa văn hóa phương Tây</h4>
          <div style="font-family:inherit;font-size:16px;line-height:1.7" class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3 text-[#ece0d9]/95">
            <div class="flex items-start gap-2">
              <span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Kế thừa, phát triển những quan điểm nhân quyền, dân quyền trong bản <span class="gls-term" data-term="Tuyên ngôn Độc lập năm 1776 của Mỹ" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">Tuyên ngôn Độc lập năm 1776 của Mỹ</span>, bản Tuyên ngôn Nhân quyền và Dân quyền năm 1791 của Pháp và đề xuất quan điểm về quyền mưu cầu độc lập, tự do, hạnh phúc của các dân tộc.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Hồ Chí Minh đã sống, hoạt động thực tiễn, nghiên cứu lý luận, tình hình chính trị, kinh tế, văn hóa nhân loại tại những trung tâm chính trị, kinh tế, văn hóa lớn ở các cường quốc trên thế giới bằng chính ngôn ngữ của các nước đó.</span>
            </div>
            <div class="flex items-start gap-2">
              <span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span>
              <span>Nghiên cứu tư tưởng nhân văn, dân chủ và nhà nước pháp quyền của các nhà khai sáng phương Tây như <span class="gls-term" data-term="Vonte, Rútxô, Môngtétxkiơ" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">Vonte, Rútxô, Môngtétxkiơ</span>...; đọc các tác phẩm văn học của William Shakespeare bằng tiếng Anh, Lỗ Tấn bằng tiếng Trung Hoa, Victor Hugo, Émile Zola bằng tiếng Pháp.</span>
            </div>
          </div>
        </div>`
      }
    ]
  },
  3: {
    roman: "NỀN TẢNG III",
    title: "Chủ nghĩa Mác – Lênin & Nhân tố chủ quan",
    footnote: "Nền tảng 3 / 3: Cơ sở lý luận quyết định & nhân tố chủ quan",
    nextText: "HOÀN THÀNH CƠ SỞ HÌNH THÀNH → BẮT ĐẦU HÀNH TRÌNH",
    dossiers: [
      {
        id: "sec-3-1",
        tabTitle: "CHỦ NGHĨA MÁC – LÊNIN",
        badge: "Phần 1",
        est: "4 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">CƠ SỞ LÝ LUẬN • PHẦN 1/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Chủ nghĩa Mác – Lênin và sự hình thành tư tưởng Hồ Chí Minh</h3>
          <div class="p-4 bg-gradient-to-b from-[#2b2016] to-[#1e1711] border border-[#f2ca50]/30 rounded space-y-3">
            <p style="font-family:inherit" class="text-[#f2ca50] font-bold text-base leading-snug">Chủ nghĩa Mác – Lênin là cơ sở lý luận, tiền đề lý luận quan trọng nhất, có vai trò quyết định trong quá trình hình thành tư tưởng Hồ Chí Minh:</p>
            <div class="h-px bg-[#f2ca50]/20"></div>
            <ul style="font-family:inherit;font-size:16px;color:rgba(236,224,217,0.95);line-height:1.7" class="space-y-3 pl-3">
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span><span>Chủ nghĩa Mác – Lênin là thế giới quan và phương pháp luận trong nhận thức và hoạt động cách mạng của Hồ Chí Minh.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span><span>Giải quyết khủng hoảng đường lối cứu nước và người lãnh đạo cách mạng: tiếp thu lý luận từ Cách mạng Tháng Mười Nga và chủ nghĩa Mác – Lênin, Hồ Chí Minh đã tìm thấy con đường cứu nước đúng đắn cho dân tộc Việt Nam.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;font-size:18px;line-height:1">✦</span><span>Hồ Chí Minh vận dụng sáng tạo, đồng thời bổ sung, phát triển và làm phong phú chủ nghĩa Mác – Lênin trong điều kiện lịch sử mới của một nước thuộc địa nửa phong kiến.</span></li>
            </ul>
          </div>
          <div class="relative mt-5 p-4 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border-l-4 border-[#f2ca50] rounded-r border border-[#f2ca50]/30 shadow-md flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm">
              §
            </div>
            <div>
              <div style="font-family:inherit" class="text-xs uppercase tracking-wider text-[#ffe088] font-bold mb-1">KẾT LUẬN</div>
              <p style="font-family:inherit" class="text-sm text-[#ece0d9] font-medium leading-relaxed">Chủ nghĩa Mác – Lênin là nền tảng kim chỉ nam, đưa cách mạng giải phóng dân tộc Việt Nam đi theo quỹ đạo của cách mạng vô sản thời đại mới.</p>
            </div>
          </div>
        </div>`
      },
      {
        id: "sec-3-2",
        tabTitle: "NHÂN TỐ CHỦ QUAN HỒ CHÍ MINH",
        badge: "Phần 2",
        est: "4 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">NHÂN TỐ CHỦ QUAN • PHẦN 2/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <h3 style="font-family:inherit" class="text-xl text-[#f2ca50] font-bold leading-snug">Nhân tố chủ quan Hồ Chí Minh</h3>
          <div style="font-family:inherit;font-size:16px;line-height:1.7" class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-3">
            <p style="font-family:inherit" class="text-[#ffe088] font-bold text-lg">Phẩm chất cá nhân của Hồ Chí Minh:</p>
            <ul class="space-y-3 pl-3 text-[#ece0d9]/95">
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Người có lý tưởng cao cả và hoài bão lớn: cứu dân, cứu nước thoát khỏi cảnh lầm than để đuổi kịp các nước tiên tiến trên thế giới. Có ý chí, nghị lực phi thường và tinh thần tự học hỏi không ngừng.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Người có bản lĩnh tư duy độc lập, tự chủ, sáng tạo và năng lực tổ chức: giàu tinh thần phê phán khoa học, đổi mới, không giáo điều, vận dụng đúng quy luật chung vào hoàn cảnh cụ thể của Việt Nam.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Người có tầm nhìn chiến lược, bao quát thời đại, đưa cách mạng Việt Nam hòa vào dòng chảy chung của cách mạng thế giới; có năng lực tổng kết thực tiễn và dự báo khoa học tương lai.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Người suốt đời tận trung với nước, tận hiếu với dân, kiên trì đấu tranh cho sự nghiệp cách mạng của Đảng và dân tộc.</span></li>
            </ul>
          </div>
        </div>`
      },
      {
        id: "sec-3-3",
        tabTitle: "TÀI NĂNG HOẠT ĐỘNG VÀ TỔNG KẾT THỰC TIỄN",
        badge: "Phần 3",
        est: "4 phút đọc",
        html: `<div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#f2ca50]/20">
            <span style="font-family:inherit" class="text-xs text-[#f2ca50] tracking-wider uppercase font-semibold">HOẠT ĐỘNG THỰC TIỄN • PHẦN 3/3</span>
            <span style="font-family:inherit" class="text-xs text-[#ece0d9]/60">TƯ TƯỞNG HỒ CHÍ MINH</span>
          </div>
          <div style="font-family:inherit;font-size:16px;line-height:1.7" class="p-4 bg-[#1e1711] border-l-4 border-[#f2ca50] rounded-r space-y-4">
            <p style="font-family:inherit" class="text-[#ffe088] font-bold text-lg">Tài năng hoạt động và tổng kết thực tiễn phát triển lý luận:</p>
            <ul class="space-y-3 pl-3 text-[#ece0d9]/95">
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Người có vốn sống và thực tiễn cách mạng phong phú, sâu rộng: sống, lao động, học tập và hoạt động ở <span class="gls-term" data-term="khoảng 30 nước" style="border-bottom:1.5px dotted #f2ca50;color:#ffe088;cursor:help;font-weight:600">khoảng 30 nước</span>; hiểu sâu sắc bản chất của chủ nghĩa đế quốc, chủ nghĩa thực dân và tình cảnh của nhân dân thuộc địa.</span></li>
              <li class="flex items-start gap-2"><span style="color:#f2ca50;font-weight:700;line-height:1.4">•</span><span>Là nhà tổ chức vĩ đại của cách mạng Việt Nam: hiện thực hóa tư tưởng cách mạng thành phong trào sinh động; tham gia sáng lập Đảng Cộng sản Pháp; chuẩn bị chu đáo cho sự ra đời của Đảng Cộng sản Việt Nam; sáng lập Mặt trận Dân tộc Thống nhất, Quân đội Nhân dân Việt Nam và khai sinh Nhà nước kiểu mới.</span></li>
            </ul>
          </div>
          <div class="relative mt-5 p-4 bg-gradient-to-r from-[#2a1e16] to-[#1c130d] border-l-4 border-[#f2ca50] rounded-r border border-[#f2ca50]/30 shadow-md flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm">
              §
            </div>
            <div>
              <div style="font-family:inherit" class="text-xs uppercase tracking-wider text-[#ffe088] font-bold mb-1">KẾT LUẬN CHUNG</div>
              <p style="font-family:inherit" class="text-sm text-[#ece0d9] font-medium leading-relaxed">Sự kết hợp giữa lý luận Mác – Lênin với thực tiễn phong phú và phẩm chất cá nhân kiệt xuất của Hồ Chí Minh đã định hình ngọn cờ dẫn lối cho độc lập dân tộc gắn liền với chủ nghĩa xã hội.</p>
            </div>
          </div>
        </div>`
      }
    ]
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function HeroOverlay({ onStart }: HeroOverlayProps) {
  const [activeNodeId, setActiveNodeId] = useState(1);
  const [completedNodes, setCompletedNodes] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelNodeId, setPanelNodeId] = useState(1);
  const [activeDossierIdx, setActiveDossierIdx] = useState(0);
  const [isFinalUnlocked, setIsFinalUnlocked] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{ title: string; desc: string; x: number; y: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Inject fonts & tailwind CDN once
  useEffect(() => {
    if (!document.getElementById("tailwind-hero-cdn")) {
      const s = document.createElement("script");
      s.id = "tailwind-hero-cdn";
      s.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
      s.onload = () => {
        // @ts-ignore
        if (window.tailwind) {
          // @ts-ignore
          window.tailwind.config = {
            theme: {
              extend: {
                colors: {
                  gold: "#f2ca50",
                  goldLight: "#ffe088",
                  parchment: "#ece0d9",
                  cinnabar: "#8c1d18",
                  cinnabarBorder: "#c43d32",
                }
              }
            }
          };
        }
      };
      document.head.appendChild(s);
    }
  }, []);

  // Attach tooltip events to .gls-term elements in the viewport
  useEffect(() => {
    if (!viewportRef.current) return;
    const terms = viewportRef.current.querySelectorAll<HTMLElement>(".gls-term");
    const handlers: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];

    terms.forEach((el) => {
      const key = el.getAttribute("data-term") || "";
      const data = glossary[key];
      if (!data) return;

      const enter = () => {
        const rect = el.getBoundingClientRect();
        let x = rect.left;
        let y = rect.bottom + 8;
        if (x + 320 > window.innerWidth) x = window.innerWidth - 340;
        if (y + 160 > window.innerHeight) y = rect.top - 150;
        setTooltip({ title: data.title, desc: data.desc, x, y });
      };
      const leave = () => setTooltip(null);

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      handlers.push({ el, enter, leave });
    });

    return () => {
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [panelOpen, activeDossierIdx, panelNodeId]);

  // ESC key closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanelOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openNode = (nodeId: number) => {
    if (nodeId > 1 && !completedNodes[nodeId - 1] && activeNodeId !== nodeId) return;
    setPanelNodeId(nodeId);
    setActiveDossierIdx(0);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTooltip(null);
  };

  const completeCurrentNode = () => {
    const nodeId = panelNodeId;
    setCompletedNodes(prev => ({ ...prev, [nodeId]: true }));
    closePanel();

    if (nodeId < 3) {
      setTimeout(() => setActiveNodeId(nodeId + 1), 600);
    } else {
      setTimeout(() => setIsFinalUnlocked(true), 400);
    }
  };

  const resetFlow = () => {
    setActiveNodeId(1);
    setCompletedNodes({ 1: false, 2: false, 3: false });
    setIsFinalUnlocked(false);
    setPanelOpen(false);
  };

  const handleStart = () => {
    setIsClosing(true);
    setTimeout(() => onStart(), 700);
  };

  const currentNode = archiveData[panelNodeId];
  const currentDossier = currentNode?.dossiers[activeDossierIdx];

  const progressLabel = completedNodes[3]
    ? "ĐÃ HOÀN THÀNH 3 NỀN TẢNG"
    : activeNodeId === 3
    ? "NỀN TẢNG 3 / 3 : CHỦ NGHĨA MÁC – LÊNIN"
    : activeNodeId === 2
    ? "NỀN TẢNG 2 / 3 : TINH HOA VĂN HÓA NHÂN LOẠI"
    : "NỀN TẢNG 1 / 3 : CƠ SỞ THỰC TIỄN";

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col justify-between transition-opacity duration-700 ${isClosing ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#17120e", color: "#ece0d9" }}
    >
      {/* No custom fonts — uses default system font */}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(242,202,80,0.5), 0 0 25px rgba(242,202,80,0.35); }
          50% { box-shadow: 0 0 0 14px rgba(242,202,80,0), 0 0 45px rgba(242,202,80,0.65); }
        }
        .node-pulse { animation: pulse-gold 2.6s infinite ease-in-out; }
        .custom-gold-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-gold-scrollbar::-webkit-scrollbar-track { background: rgba(23,18,14,0.9); border-radius: 9999px; }
        .custom-gold-scrollbar::-webkit-scrollbar-thumb { background: #c9a66b; border-radius: 9999px; }
        .custom-gold-scrollbar::-webkit-scrollbar-thumb:hover { background: #f2ca50; }
        .compass-spin { transition: transform 0.6s cubic-bezier(0.2,0.8,0.2,1); }
        .node-btn:hover .compass-spin { transform: rotate(45deg); }
        .bg-vignette { background: radial-gradient(circle at 50% 45%, rgba(47,41,36,0.45) 0%, rgba(18,13,9,0.95) 75%, #100b07 100%); }
        .vintage-texture { background-image: radial-gradient(rgba(242,202,80,0.04) 1px, transparent 0); background-size: 24px 24px; }
      ` }} />

      {/* Background layers */}
      <div className="fixed inset-0 bg-vignette pointer-events-none z-0" />
      <div className="fixed inset-0 vintage-texture opacity-60 pointer-events-none z-0" />
      {/* Compass watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-[0.035] pointer-events-none z-0">
        <svg className="w-full h-full" fill="none" stroke="#f2ca50" strokeWidth="0.7" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" /><circle cx="50" cy="50" r="42" strokeDasharray="1.5 1.5" />
          <circle cx="50" cy="50" r="28" /><line x1="50" x2="50" y1="2" y2="98" /><line x1="2" x2="98" y1="50" y2="50" />
          <polygon fill="#f2ca50" fillOpacity="0.2" points="50,6 54,46 94,50 54,54 50,94 46,54 6,50 46,46" />
        </svg>
      </div>

      {/* ========== HEADER ========== */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-7 pb-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(242,202,80,0.15)" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "inherit", color: "#f2ca50", fontSize: "18px", letterSpacing: "0.15em" }} className="flex items-center gap-2">
            <span style={{ color: "rgba(242,202,80,0.6)", fontSize: "12px" }}>✦</span> THEO DẤU CHÂN BÁC
          </span>
          <span style={{ color: "rgba(242,202,80,0.4)" }} className="hidden md:inline">/</span>
          <span style={{ fontFamily: "inherit", color: "rgba(242,202,80,0.6)", fontSize: "11px", letterSpacing: "0.2em" }} className="hidden md:inline uppercase">HÀNH TRÌNH HÌNH THÀNH TƯ TƯỞNG</span>
        </div>
        <div className="flex items-center gap-4" style={{ fontFamily: "inherit", fontSize: "12px", color: "rgba(242,202,80,0.7)" }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ background: "rgba(35,27,20,0.7)", border: "1px solid rgba(242,202,80,0.2)" }}>
            <span className="inline-block w-2 h-2 rounded-full animate-ping" style={{ background: "#f2ca50" }} />
            <span>{progressLabel}</span>
          </div>
          <button onClick={resetFlow} style={{ textDecoration: "underline", color: "rgba(242,202,80,0.7)" }} className="hover:text-yellow-300 transition-colors cursor-pointer">Tải lại ↺</button>
        </div>
      </header>

      {/* ========== MAIN ========== */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col items-center justify-center">
        {/* Title block */}
        <div className="text-center max-w-3xl mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-2" style={{ fontFamily: "inherit", color: "#f2ca50", fontSize: "11px", letterSpacing: "0.2em" }}>
            <span className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(242,202,80,0.7))" }} />
            <span className="font-semibold uppercase tracking-wider">KHÁM PHÁ NHỮNG NỀN TẢNG HÌNH THÀNH TƯ TƯỞNG HỒ CHÍ MINH</span>
            <span className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(242,202,80,0.7))" }} />
          </div>
          <h1 style={{ fontFamily: "inherit", color: "#f2ca50", fontSize: "clamp(26px,4.5vw,46px)", fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.25 }} className="mb-3 text-center">
            <span className="whitespace-nowrap inline-block">CƠ SỞ HÌNH THÀNH TƯ TƯỞNG</span>
            <br />
            <span className="whitespace-nowrap inline-block">HỒ CHÍ MINH</span>
          </h1>
          <p style={{ fontFamily: "inherit", color: "rgba(236,224,217,0.85)", fontSize: "16px", fontStyle: "italic", lineHeight: 1.7 }} className="max-w-2xl mx-auto">
            Tìm hiểu những yếu tố thực tiễn, văn hóa và lý luận<br />góp phần hình thành tư tưởng Hồ Chí Minh.
          </p>
        </div>

        {/* SKILL TREE */}
        <div className="relative w-full max-w-5xl py-6 px-4 flex flex-col items-center">
          {/* Top row: circles only */}
          <div className="relative w-full flex items-center justify-between max-w-4xl px-4 md:px-12 mt-6">

            {/* Connecting lines — top=50% aligns with the center of the circle-only row */}
            {/* Line 1->2 */}
            <div className="absolute pointer-events-none" style={{ left: "20%", right: "52%", top: "50%", transform: "translateY(-50%)", height: 6, zIndex: 0 }}>
              <div className="w-full h-full relative" style={{ borderBottom: "1px dashed rgba(242,202,80,0.25)" }}>
                <span className="absolute right-0 -top-2" style={{ fontFamily: "inherit", color: "rgba(242,202,80,0.3)", fontSize: 10 }}>▸</span>
              </div>
              <div className="absolute inset-0 origin-left transition-all duration-1000" style={{
                background: "linear-gradient(to right, #f2ca50, #ffe088, #f2ca50)",
                boxShadow: "0 0 15px rgba(242,202,80,0.8)",
                opacity: completedNodes[1] ? 1 : 0,
                transform: completedNodes[1] ? "scaleX(1)" : "scaleX(0)"
              }}>
                <div className="w-full h-full animate-pulse" style={{ borderBottom: "2px solid #ffe088" }} />
              </div>
            </div>
            {/* Line 2->3 */}
            <div className="absolute pointer-events-none" style={{ left: "52%", right: "20%", top: "50%", transform: "translateY(-50%)", height: 6, zIndex: 0 }}>
              <div className="w-full h-full relative" style={{ borderBottom: "1px dashed rgba(242,202,80,0.25)" }}>
                <span className="absolute right-0 -top-2" style={{ fontFamily: "inherit", color: "rgba(242,202,80,0.3)", fontSize: 10 }}>▸</span>
              </div>
              <div className="absolute inset-0 origin-left transition-all duration-1000" style={{
                background: "linear-gradient(to right, #f2ca50, #ffe088, #f2ca50)",
                boxShadow: "0 0 15px rgba(242,202,80,0.8)",
                opacity: completedNodes[2] ? 1 : 0,
                transform: completedNodes[2] ? "scaleX(1)" : "scaleX(0)"
              }}>
                <div className="w-full h-full animate-pulse" style={{ borderBottom: "2px solid #ffe088" }} />
              </div>
            </div>

            {/* CIRCLE BUTTONS ONLY */}
            {[1, 2, 3].map((nodeId) => {
              const isCompleted = completedNodes[nodeId];
              const isActive = activeNodeId === nodeId;
              const isLocked = !isCompleted && !isActive;
              const romans = ["NỀN TẢNG I", "NỀN TẢNG II", "NỀN TẢNG III"];

              return (
                <div key={nodeId} className="relative flex items-center justify-center z-10 group">
                  <button
                    onClick={() => openNode(nodeId)}
                    disabled={isLocked}
                    className={`node-btn relative rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-center focus:outline-none ${isCompleted || isActive ? "node-pulse cursor-pointer hover:scale-105 active:scale-95" : "cursor-not-allowed"}`}
                    style={{
                      width: "clamp(96px, 10vw, 128px)",
                      height: "clamp(96px, 10vw, 128px)",
                      background: isLocked ? "#1b140f" : "#201912",
                      borderColor: isLocked ? "rgba(242,202,80,0.3)" : "#f2ca50",
                      opacity: isLocked ? 0.4 : 1,
                      boxShadow: isLocked ? "none" : "0 0 25px rgba(242,202,80,0.45)"
                    }}
                  >
                    <div className="absolute inset-[6px] rounded-full pointer-events-none" style={{ border: isLocked ? "1px solid rgba(242,202,80,0.2)" : "1px solid rgba(242,202,80,0.4)" }} />
                    <div className="absolute inset-[12px] rounded-full pointer-events-none" style={{ border: isLocked ? "1px dashed rgba(242,202,80,0.15)" : "1px dashed rgba(242,202,80,0.25)" }} />

                    {isLocked ? (
                      <div style={{ color: "rgba(242,202,80,0.6)", marginBottom: 4 }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        </svg>
                      </div>
                    ) : (
                      <span className="compass-spin" style={{ fontFamily: "inherit", color: "#f2ca50", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, marginBottom: 2 }}>✦</span>
                    )}

                    <span style={{ fontFamily: "inherit", color: isLocked ? "rgba(242,202,80,0.4)" : "rgba(242,202,80,0.7)", fontSize: 10, letterSpacing: "0.15em", marginBottom: 2 }}>{romans[nodeId - 1]}</span>

                    {isCompleted ? (
                      <span style={{ fontFamily: "inherit", fontSize: 9, color: "#86efac", background: "rgba(5,46,22,0.4)", border: "1px solid rgba(74,222,128,0.4)", padding: "2px 8px", borderRadius: 9999 }}>Hoàn thành ✓</span>
                    ) : isActive ? (
                      <span style={{ fontFamily: "inherit", fontSize: 9, color: "#f2ca50", background: "rgba(242,202,80,0.1)", border: "1px solid rgba(242,202,80,0.3)", padding: "2px 8px", borderRadius: 9999 }}>Đang mở</span>
                    ) : (
                      <span style={{ fontFamily: "inherit", fontSize: 9, color: "rgba(236,224,217,0.4)", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(242,202,80,0.1)", padding: "2px 8px", borderRadius: 9999 }}>Khóa</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom row: labels aligned under each circle */}
          <div className="w-full flex justify-between max-w-4xl px-4 md:px-12 mt-4">
            {[1, 2, 3].map((nodeId) => {
              const isCompleted = completedNodes[nodeId];
              const isActive = activeNodeId === nodeId;
              const isLocked = !isCompleted && !isActive;

              return (
                <div key={nodeId} className="flex flex-col items-center text-center" style={{ width: "clamp(96px, 10vw, 128px)" }}>
                  <div className="w-[180px] sm:w-[210px] md:w-[230px] shrink-0 flex flex-col items-center text-center">
                    <h3
                      style={{
                        fontFamily: "inherit",
                        color: isLocked ? "rgba(236,224,217,0.5)" : "#f2ca50",
                        fontWeight: 700,
                        fontSize: "clamp(13px,1.4vw,15px)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.35,
                      }}
                    >
                      {nodeId === 1 && <span className="whitespace-nowrap inline-block">CƠ SỞ THỰC TIỄN</span>}
                      {nodeId === 2 && (
                        <>
                          <span className="whitespace-nowrap inline-block">TINH HOA VĂN HÓA</span>
                          <br />
                          <span className="whitespace-nowrap inline-block">NHÂN LOẠI</span>
                        </>
                      )}
                      {nodeId === 3 && (
                        <span className="whitespace-nowrap inline-block">CHỦ NGHĨA MÁC – LÊNIN</span>
                      )}
                    </h3>
                    <p
                      style={{
                        fontFamily: "inherit",
                        color: isLocked ? "rgba(236,224,217,0.4)" : "rgba(236,224,217,0.75)",
                        fontSize: "clamp(11px,1.1vw,12px)",
                        marginTop: 4,
                        lineHeight: 1.45,
                      }}
                    >
                      {nodeId === 1 && (
                        <>
                          <span className="whitespace-nowrap inline-block">Bối cảnh lịch sử &amp;</span>
                          <br />
                          <span className="whitespace-nowrap inline-block">phong trào</span>
                        </>
                      )}
                      {nodeId === 2 && (
                        <>
                          <span className="whitespace-nowrap inline-block">Giá trị tư tưởng</span>
                          <br />
                          <span className="whitespace-nowrap inline-block">Đông và Tây</span>
                        </>
                      )}
                      {nodeId === 3 && (
                        <>
                          <span className="whitespace-nowrap inline-block">Cơ sở lý luận &amp;</span>
                          <br />
                          <span className="whitespace-nowrap inline-block">nhân tố chủ quan</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <div className={`transition-opacity duration-500 ${isFinalUnlocked ? "opacity-0" : "opacity-100"}`}
            style={{ fontFamily: "inherit", color: "rgba(242,202,80,0.75)", fontSize: 11, letterSpacing: "0.18em", display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span className="animate-bounce" style={{ color: "#f2ca50" }}>↓</span> Nhấn vào vòng tròn sáng để khám phá nền tảng
          </div>
        </div>

        {/* FINAL CTA */}
        <div className={`mt-6 transition-all duration-1000 transform ${isFinalUnlocked ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <div className="flex flex-col items-center gap-3">
            <div style={{ fontFamily: "inherit", color: "#f2ca50", fontSize: 11, letterSpacing: "0.28em" }} className="flex items-center gap-3">
              <span>✦</span> ĐÃ HOÀN THÀNH TÌM HIỂU CÁC NỀN TẢNG TƯ TƯỞNG <span>✦</span>
            </div>
            <button onClick={handleStart} className="group relative inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{ padding: "14px 48px", background: "linear-gradient(to bottom, #3a2c1a, #2a1e12, #1a120b)", border: "2px solid #f2ca50", color: "#ffe088", fontFamily: "inherit", letterSpacing: "0.25em", fontWeight: 700, fontSize: 16, boxShadow: "0 0 35px rgba(242,202,80,0.6)" }}>
              <span className="relative z-10 flex items-center gap-3">
                BẮT ĐẦU HÀNH TRÌNH
                <span className="transform group-hover:translate-x-2 transition-transform duration-300" style={{ color: "#f2ca50" }}>→</span>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(242,202,80,0.2)" }} />
            </button>
          </div>
        </div>
      </main>

      {/* ========== DUAL-PANE CODEX MODAL ========== */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-3 md:p-6 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", opacity: panelOpen ? 1 : 0, pointerEvents: panelOpen ? "auto" : "none" }}
        onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
      >
        <div className="relative flex flex-col rounded-sm overflow-hidden transition-all duration-300"
          style={{
            width: "95vw", maxWidth: 1152, height: "82vh",
            background: "#1a140f", border: "2px solid rgba(242,202,80,0.6)",
            boxShadow: "0 20px 70px rgba(0,0,0,0.95), 0 0 40px rgba(242,202,80,0.2)",
            transform: panelOpen ? "scale(1)" : "scale(0.95)",
            opacity: panelOpen ? 1 : 0
          }}>

          {/* Corner Accents */}
          {["-top-0.5 -left-0.5 border-t-2 border-l-2", "-top-0.5 -right-0.5 border-t-2 border-r-2", "-bottom-0.5 -left-0.5 border-b-2 border-l-2", "-bottom-0.5 -right-0.5 border-b-2 border-r-2"].map((cls, i) => (
            <div key={i} className={`absolute ${cls} w-4 h-4 z-30 pointer-events-none`} style={{ borderColor: "#f2ca50" }} />
          ))}

          {/* Header */}
          <div className="px-6 py-3.5 flex items-center justify-between z-20" style={{ background: "#201812", borderBottom: "1px solid rgba(242,202,80,0.25)" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "inherit", fontSize: 11, letterSpacing: "0.2em", color: "rgba(242,202,80,0.8)", background: "rgba(242,202,80,0.1)", padding: "4px 10px", border: "1px solid rgba(242,202,80,0.3)" }}>{currentNode?.roman}</span>
              <div className="h-4 w-px hidden sm:block" style={{ background: "rgba(242,202,80,0.3)" }} />
              <h2 style={{ fontFamily: "inherit", color: "#f2ca50", fontWeight: 700, fontSize: "clamp(15px,2vw,20px)", letterSpacing: "0.03em" }}>{currentNode?.title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1" style={{ fontFamily: "inherit", fontSize: 11, color: "rgba(242,202,80,0.7)", background: "#16100b", border: "1px solid rgba(242,202,80,0.15)" }}>
                <span>NỘI DUNG:</span>
                <span style={{ color: "#f2ca50", fontWeight: 700 }}>{activeDossierIdx + 1}/{currentNode?.dossiers.length}</span>
              </div>
              <button onClick={closePanel} style={{ color: "rgba(242,202,80,0.7)", padding: 6 }} className="hover:text-yellow-300 hover:bg-yellow-400/10 rounded-sm transition-colors cursor-pointer" title="Đóng">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </button>
            </div>
          </div>

          {/* Dual-Pane Body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT: Index Ledger */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0" style={{ background: "#1e1711", borderRight: "1px solid rgba(242,202,80,0.2)", borderBottom: "1px solid rgba(242,202,80,0.2)" }}>
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ fontFamily: "inherit", fontSize: 11, letterSpacing: "0.18em", color: "rgba(242,202,80,0.8)", background: "rgba(23,16,11,0.8)", borderBottom: "1px solid rgba(242,202,80,0.15)" }}>
                <span className="font-bold">NỘI DUNG CHÍNH</span>
                <span style={{ fontSize: 10, color: "rgba(236,224,217,0.5)" }}>3 PHẦN</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-gold-scrollbar p-3 space-y-2">
                {currentNode?.dossiers.map((d, idx) => {
                  const isActive = idx === activeDossierIdx;
                  return (
                    <button key={d.id} onClick={() => setActiveDossierIdx(idx)}
                      className="w-full text-left p-3 rounded-sm flex flex-col gap-1.5 transition-all cursor-pointer"
                      style={{
                        background: isActive ? "#2b2016" : "#18120d",
                        border: isActive ? "1px solid #f2ca50" : "1px solid rgba(242,202,80,0.15)",
                        color: isActive ? "#ffe088" : "rgba(236,224,217,0.7)",
                        boxShadow: isActive ? "0 0 15px rgba(242,202,80,0.25)" : "none"
                      }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: "inherit", fontSize: 10, color: "rgba(236,224,217,0.5)" }}>{d.est}</span>
                      </div>
                      <div style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 13, letterSpacing: "0.02em", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.tabTitle}</div>
                      <div style={{ fontFamily: "inherit", fontSize: 10, color: isActive ? "#f2ca50" : idx < activeDossierIdx ? "#4ade80" : "rgba(236,224,217,0.4)", display: "flex", gap: 4, alignItems: "center" }}>
                        <span>✦</span><span>{isActive ? "Đang xem" : idx < activeDossierIdx ? "Đã xem ✓" : "Chưa xem"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="p-3 flex items-center justify-between" style={{ fontFamily: "inherit", fontSize: 11, color: "rgba(242,202,80,0.6)", background: "#17100b", borderTop: "1px solid rgba(242,202,80,0.15)" }}>
                <span>MÔN HỌC TƯ TƯỞNG HỒ CHÍ MINH</span>
                <span style={{ color: "rgba(236,224,217,0.4)" }}>CHƯƠNG II</span>
              </div>
            </div>

            {/* RIGHT: Reading Codex */}
            <div className="flex-1 relative flex flex-col overflow-hidden" style={{ background: "#241c15" }}>
              <div
                ref={viewportRef}
                className="h-full overflow-y-auto custom-gold-scrollbar p-5 md:p-8"
                dangerouslySetInnerHTML={currentDossier ? { __html: currentDossier.html } : undefined}
              />
            </div>
          </div>

          {/* Footer action bar */}
          <div className="px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 z-20" style={{ background: "#1e1711", borderTop: "1px solid rgba(242,202,80,0.25)" }}>
            <div style={{ fontFamily: "inherit", fontSize: 12, color: "rgba(236,224,217,0.7)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#f2ca50" }}>✦</span>
              <span>{currentNode?.footnote}</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button onClick={closePanel} className="px-5 py-2 transition-colors cursor-pointer"
                style={{ fontFamily: "inherit", fontSize: 11, letterSpacing: "0.1em", color: "rgba(242,202,80,0.7)", border: "1px solid rgba(242,202,80,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f2ca50")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,202,80,0.7)")}>
                ĐÓNG
              </button>
              <button onClick={completeCurrentNode}
                className="inline-flex items-center gap-2 px-6 py-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", background: "linear-gradient(to right, #f2ca50, #ffe088, #f2ca50)", color: "#17120e", boxShadow: "0 0 20px rgba(242,202,80,0.45)" }}>
                <span>{currentNode?.nextText}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== KEYWORD TOOLTIP ========== */}
      {tooltip && (
        <div className="fixed z-50 max-w-sm pointer-events-none"
          style={{ top: tooltip.y, left: tooltip.x, padding: "14px", background: "#201710", border: "1px solid #f2ca50", boxShadow: "0 8px 30px rgba(0,0,0,0.9), 0 0 15px rgba(242,202,80,0.3)", backdropFilter: "blur(4px)" }}>
          <div style={{ fontFamily: "inherit", fontSize: 11, fontWeight: 700, color: "#f2ca50", letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: "1px solid rgba(242,202,80,0.3)", paddingBottom: 6, marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
            <span>✦</span><span>CHÚ GIẢI THUẬT NGỮ — {tooltip.title}</span>
          </div>
          <p style={{ fontFamily: "inherit", fontSize: 14, color: "rgba(236,224,217,0.9)", lineHeight: 1.6 }}>{tooltip.desc}</p>
        </div>
      )}

      {/* ========== FOOTER ========== */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(242,202,80,0.15)", fontFamily: "inherit", fontSize: 11, color: "rgba(242,202,80,0.5)" }}>
        <div>DỰ ÁN HỌC TẬP · MÔN TƯ TƯỞNG HỒ CHÍ MINH</div>
        <div className="flex items-center gap-4" style={{ color: "rgba(236,224,217,0.5)" }}>
          <span>NỘI DUNG HỌC TẬP · TƯ TƯỞNG HỒ CHÍ MINH</span>
          <span>•</span>
          <span>BẬC ĐẠI HỌC</span>
        </div>
      </footer>
    </div>
  );
}
