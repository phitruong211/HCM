"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface ValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Shared inline style helpers using CSS variables from globals.css ── */
const s = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 100000,
    background: "var(--bg-primary)",
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    // Add subtle noise/texture to the background
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
  },
  closeBtn: {
    position: "fixed" as const,
    top: 32,
    right: 32,
    zIndex: 100001,
    padding: 12,
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "var(--transition-fast)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative" as const,
    zIndex: 10,
    width: "100%",
    maxWidth: 900, // Narrower, like a book or plaque
    margin: "0 auto",
    padding: "0 24px 120px",
  },
  hero: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    paddingTop: 80,
    paddingBottom: 60,
  },
  ornament: {
    width: 60,
    height: 12,
    margin: "0 auto 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ornamentLine: {
    height: 1,
    width: 40,
    background: "var(--border-ornament)",
  },
  ornamentDiamond: {
    width: 6,
    height: 6,
    background: "var(--accent-gold)",
    transform: "rotate(45deg)",
  },
  heroTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 400,
    textTransform: "uppercase" as const,
    letterSpacing: "4px",
    color: "var(--accent-gold)",
    marginBottom: 24,
    lineHeight: 1.3,
  },
  heroSubTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2rem, 4vw, 3.5rem)",
    fontWeight: 400,
    color: "var(--text-heading)",
    letterSpacing: "2px",
    marginBottom: 40,
  },
  heroDesc: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    fontWeight: 300,
    lineHeight: 1.8,
    maxWidth: 650,
    margin: "0 auto",
    fontStyle: "italic",
  },
  sectionTitleWrapper: {
    textAlign: "center" as const,
    marginBottom: 64,
  },
  sectionRoman: {
    fontFamily: "var(--font-accent)",
    fontSize: "1.5rem",
    color: "var(--accent-gold)",
    marginBottom: 16,
    display: "block",
    letterSpacing: "4px",
  },
  sectionTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
    fontWeight: 400,
    color: "var(--text-heading)",
    textTransform: "uppercase" as const,
    letterSpacing: "2px",
  },
  partContainer: {
    marginBottom: 80,
    background: "var(--bg-surface)",
    border: "1px solid var(--border-light)",
    padding: "48px 40px",
    boxShadow: "var(--shadow-soft)",
  },
  partTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.4rem",
    fontWeight: 500,
    color: "var(--text-heading)",
    marginBottom: 40,
    lineHeight: 1.5,
    textAlign: "center" as const,
    borderBottom: "1px solid var(--border-light)",
    paddingBottom: 24,
  },
  itemList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 32,
  },
  itemBlock: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
  },
  itemBullet: {
    minWidth: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  itemBulletDiamond: {
    width: 6,
    height: 6,
    background: "var(--accent-gold-dark)",
    transform: "rotate(45deg)",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 8,
  },
  itemDesc: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    lineHeight: 1.7,
  },
  footer: {
    marginTop: 120,
    paddingTop: 60,
    borderTop: "1px solid var(--border-light)",
    textAlign: "center" as const,
  },
};

// Custom decorative divider
const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "60px 0" }}>
    <div style={{ height: 1, width: 100, background: "linear-gradient(to right, transparent, var(--border-ornament))" }} />
    <div style={s.ornamentDiamond} />
    <div style={s.ornamentDiamond} />
    <div style={s.ornamentDiamond} />
    <div style={{ height: 1, width: 100, background: "linear-gradient(to left, transparent, var(--border-ornament))" }} />
  </div>
);

function ValuesModalContent({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={s.overlay}
    >
      {/* Close Button */}
      <button 
        onClick={onClose} 
        style={s.closeBtn}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-gold)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div style={s.content}>
        {/* HERO SECTION */}
        <motion.section 
          style={{ ...s.hero, opacity }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>
            <div style={s.ornament}>
              <div style={s.ornamentLine} />
              <div style={s.ornamentDiamond} />
              <div style={s.ornamentLine} />
            </div>
            
            <h1 style={s.heroTitle}>Giá Trị Tư Tưởng</h1>
            <h2 style={s.heroSubTitle}>Hồ Chí Minh</h2>
            
            <p style={s.heroDesc}>
              "Di sản tinh thần vô giá, kim chỉ nam cho sự nghiệp cách mạng Việt Nam 
              và cống hiến to lớn cho sự phát triển tiến bộ của nhân loại."
            </p>
          </motion.div>
        </motion.section>

        {/* SECTION I */}
        <section style={{ paddingTop: 40, paddingBottom: 40 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.sectionTitleWrapper}>
            <span style={s.sectionRoman}>I</span>
            <h2 style={s.sectionTitle}>Đối với cách mạng Việt Nam</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.partContainer}>
            <h3 style={s.partTitle}>
              Đưa cách mạng giải phóng dân tộc Việt Nam đến thắng lợi và bắt đầu xây dựng một xã hội mới trên đất nước ta
            </h3>
            <div style={s.itemList}>
              {[
                { title: "Thắng lợi thực tiễn", desc: "Tìm đường cứu nước, lập Đảng, lãnh đạo thành công Cách mạng Tháng Tám (1945)." },
                { title: "Kỷ nguyên mới", desc: "Mở ra kỷ nguyên độc lập dân tộc gắn liền với chủ nghĩa xã hội." },
                { title: "Ngọn cờ xuyên suốt", desc: "Soi đường cho kháng chiến chống Pháp, xây dựng miền Bắc, cách mạng miền Nam, đi đến Thống nhất đất nước (1975)." },
                { title: "Hệ thống lý luận", desc: "Xây dựng nền tảng: Đảng cầm quyền trong sạch; Nhà nước của dân, do dân, vì dân; Mặt trận dân tộc thống nhất; Khối đại đoàn kết." },
                { title: "Lý luận mở", desc: "Không ngừng được Đảng vận dụng, bổ sung và phát triển trong công cuộc Đổi mới." },
              ].map((item, i) => (
                <div key={i} style={s.itemBlock}>
                  <div style={s.itemBullet}><div style={s.itemBulletDiamond} /></div>
                  <div style={s.itemContent}>
                    <h4 style={s.itemTitle}>{item.title}</h4>
                    <p style={s.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <Divider />

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.partContainer}>
            <h3 style={s.partTitle}>
              Nền tảng tư tưởng và kim chỉ nam cho cách mạng Việt Nam
            </h3>
            
            <div style={{ marginBottom: 40 }}>
              <div style={s.itemList}>
                {[
                  { title: "Tư tưởng bản địa", desc: "Lần đầu tiên phong trào cách mạng soi đường bởi tư tưởng của chính người Việt Nam, bắt rễ từ truyền thống văn hóa dân tộc." },
                  { title: "Nhận thức đúng đắn", desc: "Xác định rõ ràng mục tiêu: Bảo vệ độc lập, phát triển kinh tế - xã hội, bảo đảm tự do và hạnh phúc cho nhân dân, vững bước tiến lên CNXH." },
                  { title: "Chỗ dựa vững chắc", desc: 'Vạch ra đường lối chiến lược, thực hiện mục tiêu "dân giàu, nước mạnh, dân chủ, công bằng, văn minh", mang giá trị trường tồn cùng dân tộc.' },
                ].map((item, i) => (
                  <div key={i} style={s.itemBlock}>
                    <div style={s.itemBullet}><div style={s.itemBulletDiamond} /></div>
                    <div style={s.itemContent}>
                      <h4 style={s.itemTitle}>{item.title}</h4>
                      <p style={s.itemDesc}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-box for core goals */}
            <div style={{ background: "var(--bg-secondary)", padding: 32, border: "1px solid var(--border-primary)", borderTop: "3px solid var(--accent-gold)" }}>
              <h4 style={{ fontFamily: "var(--font-accent)", fontSize: "1rem", color: "var(--accent-gold)", marginBottom: 24, textTransform: "uppercase", letterSpacing: "2px", textAlign: "center" }}>Hệ Mục Tiêu Cơ Bản</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {[
                  { label: "Tổ quốc", sub: "Độc lập, thống nhất toàn vẹn" },
                  { label: "Nhân dân", sub: "Tự do, dân chủ, công bằng, hạnh phúc" },
                  { label: "Quốc tế", sub: "Hòa bình, hữu nghị, nhân văn" },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: 8 }}>{item.label}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <Divider />

        {/* SECTION II */}
        <section style={{ paddingTop: 40, paddingBottom: 40 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.sectionTitleWrapper}>
            <span style={s.sectionRoman}>II</span>
            <h2 style={s.sectionTitle}>Đối với sự phát triển tiến bộ<br/>của nhân loại</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.partContainer}>
            <h3 style={s.partTitle}>
              Góp phần mở ra cho các dân tộc thuộc địa con đường giải phóng dân tộc gắn với sự tiến bộ xã hội
            </h3>
            <div style={s.itemList}>
              {[
                { title: "Biểu tượng thời đại", desc: "Trở thành Anh hùng giải phóng dân tộc vĩ đại của thế kỷ XX, đáp ứng trọn vẹn yêu cầu và khát vọng của thời đại mới." },
                { title: "Cống hiến lý luận", desc: "Đề xướng cách mạng giải phóng dân tộc đi theo con đường vô sản: toàn dân tiến hành, nòng cốt công - nông, do Đảng tiên phong lãnh đạo." },
                { title: "Chủ động & sáng tạo", desc: "Khẳng định cách mạng thuộc địa có thể giành thắng lợi trước cách mạng chính quốc bằng con đường bạo lực (kết hợp đấu tranh chính trị và vũ trang)." },
                { title: "Bổ sung lý luận Mác-Lênin", desc: "Giải quyết xuất sắc mối quan hệ: dân tộc - thuộc địa, dân tộc - giai cấp, độc lập dân tộc - CNXH; luôn gắn giải phóng dân tộc với giải phóng con người." },
                { title: "Vai trò tiên phong", desc: "Phong trào do Người lãnh đạo đã góp phần to lớn, trực tiếp làm sụp đổ hệ thống thuộc địa của chủ nghĩa thực dân trên toàn thế giới." },
              ].map((item, i) => (
                <div key={i} style={s.itemBlock}>
                  <div style={s.itemBullet}><div style={s.itemBulletDiamond} /></div>
                  <div style={s.itemContent}>
                    <h4 style={s.itemTitle}>{item.title}</h4>
                    <p style={s.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <Divider />

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={s.partContainer}>
            <h3 style={s.partTitle}>
              Góp phần tích cực vào cuộc đấu tranh vì độc lập dân tộc, dân chủ, hòa bình, hợp tác và phát triển trên thế giới
            </h3>
            <div style={s.itemList}>
              {[
                { title: "Xu thế hợp tác quốc tế", desc: "Phá bỏ sự biệt lập, chủ trương liên kết các dân tộc nhỏ yếu để chống lại chính sách 'chia để trị' thâm độc của chủ nghĩa đế quốc." },
                { title: "Gắn kết các phong trào", desc: "Kết nối chặt chẽ cách mạng Việt Nam với phong trào giải phóng dân tộc, phong trào công nhân ở các nước tư bản, phong trào cộng sản quốc tế và phong trào bảo vệ hòa bình thế giới." },
                { title: "Mục tiêu hợp tác toàn diện", desc: "Không chỉ dừng lại ở giành độc lập, mà còn hướng tới xóa bỏ nghèo nàn, lạc hậu, phát triển mạnh mẽ lực lượng sản xuất, đưa đất nước tiến kịp các quốc gia tiên tiến." },
                { title: "Chủ trương đối ngoại", desc: "Với tinh thần 'Làm bạn với tất cả mọi nước dân chủ', không gây thù oán với một ai; luôn nỗ lực thúc đẩy hội nhập, duy trì hòa bình và tình hữu nghị giữa các dân tộc." },
                { title: "Nguyên tắc hợp tác", desc: "Luôn kiên định giữ vững độc lập, chủ quyền; hợp tác bình đẳng, cùng có lợi; kết hợp nhuần nhuyễn sức mạnh dân tộc và sức mạnh thời đại; làm tròn nghĩa vụ quốc tế cao cả." },
                { title: "Sự ghi nhận của Đảng & Thế giới", desc: "Tại Đại hội XII, Đảng ta khẳng định Người là: Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới, Người chiến sĩ cộng sản quốc tế mẫu mực." },
              ].map((item, i) => (
                <div key={i} style={s.itemBlock}>
                  <div style={s.itemBullet}><div style={s.itemBulletDiamond} /></div>
                  <div style={s.itemContent}>
                    <h4 style={s.itemTitle}>{item.title}</h4>
                    <p style={s.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={s.footer}>
          <div style={s.ornament}>
            <div style={s.ornamentLine} />
            <div style={s.ornamentDiamond} />
            <div style={s.ornamentLine} />
          </div>
          <p style={{ 
            color: "var(--text-secondary)", 
            letterSpacing: "4px", 
            textTransform: "uppercase", 
            fontSize: "0.9rem",
            fontFamily: "var(--font-accent)"
          }}>
            Di sản tư tưởng Hồ Chí Minh sống mãi
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default function ValuesModal({ isOpen, onClose }: ValuesModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && <ValuesModalContent onClose={onClose} />}
    </AnimatePresence>
  );
}
