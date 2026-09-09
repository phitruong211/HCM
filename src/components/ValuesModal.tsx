"use client";

import React, { useEffect } from "react";

interface ValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSS = `
.museum-root {
  position: fixed;
  inset: 0;
  z-index: 100000;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'Times New Roman', Times, serif;
  background: 
    radial-gradient(ellipse at 50% 0%, #2a2215, transparent 50%),
    linear-gradient(to bottom, #15110c, #1c160f);
  color: #ece3d1;
  scroll-behavior: smooth;
}

.museum-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.museum-close {
  position: fixed;
  top: 25px;
  right: 25px;
  z-index: 100002;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(201, 162, 75, 0.3);
  background: rgba(21, 17, 12, 0.8);
  color: #c9a24b;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  line-height: 1;
}

.museum-close:hover {
  background: rgba(201, 162, 75, 0.2);
  color: #e8c97a;
  transform: rotate(90deg);
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 120px;
}

/* Page Scroll Animation */
.section-block {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease-out, transform 1s ease-out;
}
.section-block.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #e8c97a;
  padding: 40px 20px;
}
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 4px 20px rgba(201, 162, 75, 0.2);
}
.hero-quote {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-style: italic;
  max-width: 700px;
  color: #d1c5b4;
  line-height: 1.6;
}

/* Typography & Layout */
.main-heading {
  text-align: center;
  font-size: clamp(2rem, 4vw, 2.8rem);
  color: #e8c97a;
  margin-bottom: 60px;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}
.main-heading::after {
  content: '';
  display: block;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a24b, transparent);
  margin: 20px auto 0;
}

.sub-section {
  margin-bottom: 70px;
}
@media (max-width: 768px) {
  .sub-section {
    margin-bottom: 50px;
  }
}

.sub-content h3 {
  font-size: 1.35rem;
  color: #e8c97a;
  margin-bottom: 35px;
  line-height: 1.6;
  font-weight: normal;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.item-card {
  padding-top: 20px;
  border-top: 1px solid rgba(201, 162, 75, 0.15);
}

.item-title {
  color: #c9a24b;
  font-size: 1.15rem;
  margin-bottom: 12px;
  font-weight: bold;
}

.item-desc {
  color: #cfc4b4;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Goals Grid */
.goals-wrapper {
  margin-top: 40px;
  padding: 30px;
  background: rgba(201, 162, 75, 0.03);
  border-left: 2px solid rgba(201, 162, 75, 0.4);
}
.goals-title {
  color: #c9a24b;
  font-size: 1.15rem;
  margin-bottom: 20px;
  font-weight: bold;
}
.goals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}
@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
.goal-item strong {
  display: block;
  color: #e8c97a;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.goal-item span {
  color: #cfc4b4;
  line-height: 1.5;
  font-size: 1.05rem;
}

/* Quote Emphasis */
.quote-emphasis {
  margin-top: 60px;
  padding: 30px 20px;
  text-align: center;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.6;
  color: #e8c97a;
  position: relative;
}
.quote-emphasis::before,
.quote-emphasis::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 162, 75, 0.5), transparent);
}
.quote-emphasis::before {
  top: 0;
}
.quote-emphasis::after {
  bottom: 0;
}
`;

export default function ValuesModal({ isOpen, onClose }: ValuesModalProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    // Particle Canvas Animation
    const canvas = document.getElementById("museum-particles") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; opacity: number; sinOffset: number; sinSpeed: number; sinAmp: number };
    const particles: Particle[] = [];
    const numParticles = 40;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        vx: 0,
        vy: -(Math.random() * 0.3 + 0.1),
        opacity: Math.random() * 0.35 + 0.15,
        sinOffset: Math.random() * Math.PI * 2,
        sinSpeed: Math.random() * 0.02 + 0.005,
        sinAmp: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(p.sinOffset) * p.sinAmp;
        p.sinOffset += p.sinSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 75, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(201, 162, 75, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Scroll Observer
    const rootEl = document.querySelector(".museum-root");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: rootEl, threshold: 0.1 }
    );

    const blocks = document.querySelectorAll(".section-block");
    blocks.forEach((b) => observer.observe(b));

    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="museum-root">
      <style>{CSS}</style>
      <canvas id="museum-particles" className="museum-canvas" />

      <button className="museum-close" onClick={onClose} aria-label="Đóng">
        &times;
      </button>

      <div className="content-wrapper">
        <div className="hero-section section-block">
          <h1 className="hero-title">GIÁ TRỊ TƯ TƯỞNG HỒ CHÍ MINH</h1>
          <div className="hero-quote">
            &quot;Di sản tinh thần vô giá, kim chỉ nam cho sự nghiệp cách mạng Việt Nam và cống hiến to lớn cho sự phát triển tiến bộ của nhân loại.&quot;
          </div>
        </div>

        <div className="section-block">
          <h2 className="main-heading">Đối với cách mạng Việt Nam</h2>

          <div className="sub-section">
            <div className="sub-content">
              <h3>Tư tưởng Hồ Chí Minh đưa cách mạng giải phóng dân tộc Việt Nam đến thắng lợi và bắt đầu xây dựng một xã hội mới trên đất nước ta</h3>
              
              <div className="item-grid">
                <div className="item-card">
                  <div className="item-title">Thắng lợi thực tiễn</div>
                  <div className="item-desc">Tìm đường cứu nước, lập Đảng, lãnh đạo thành công Cách mạng Tháng Tám (1945).</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Kỷ nguyên mới</div>
                  <div className="item-desc">Độc lập dân tộc gắn liền với chủ nghĩa xã hội.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Ngọn cờ xuyên suốt</div>
                  <div className="item-desc">Kháng chiến chống Pháp &rarr; Xây dựng miền Bắc &rarr; Cách mạng miền Nam &rarr; Thống nhất, đi lên CNXH (1975).</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Hệ thống lý luận bảo đảm thắng lợi</div>
                  <div className="item-desc">Xây dựng Đảng cầm quyền trong sạch; Nhà nước của dân, do dân, vì dân; Mặt trận dân tộc thống nhất; Khối đại đoàn kết.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Hệ thống lý luận mở</div>
                  <div className="item-desc">Tiếp tục được Đảng vận dụng, phát triển trong công cuộc đổi mới.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sub-section">
            <div className="sub-content">
              <h3>Tư tưởng Hồ Chí Minh là nền tảng tư tưởng và kim chỉ nam cho cách mạng Việt Nam</h3>
              
              <div className="item-grid">
                <div className="item-card">
                  <div className="item-title">Tư tưởng bản địa</div>
                  <div className="item-desc">Lần đầu tiên cách mạng soi đường bởi tư tưởng của chính người Việt Nam.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Nhận thức đúng đắn</div>
                  <div className="item-desc">Bảo vệ độc lập, phát triển kinh tế - xã hội, bảo đảm tự do/hạnh phúc, tiến lên CNXH.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Chỗ dựa vững chắc cho Đảng</div>
                  <div className="item-desc">Vạch đường lối, thực hiện mục tiêu &quot;dân giàu, nước mạnh...&quot;; mang giá trị trường tồn.</div>
                </div>
              </div>

              <div className="goals-wrapper">
                <div className="goals-title">Hệ mục tiêu cơ bản</div>
                <div className="goals-grid">
                  <div className="goal-item">
                    <strong>Tổ quốc</strong>
                    <span>Độc lập, thống nhất.</span>
                  </div>
                  <div className="goal-item">
                    <strong>Nhân dân</strong>
                    <span>Tự do, dân chủ, công bằng, hạnh phúc.</span>
                  </div>
                  <div className="goal-item">
                    <strong>Quốc tế</strong>
                    <span>Hòa bình, hữu nghị, phát triển quan hệ văn hóa, nhân văn.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          <h2 className="main-heading">Đối với sự phát triển tiến bộ của nhân loại</h2>

          <div className="sub-section">
            <div className="sub-content">
              <h3>Tư tưởng Hồ Chí Minh góp phần mở ra cho các dân tộc thuộc địa con đường giải phóng dân tộc gắn với sự tiến bộ xã hội</h3>
              
              <div className="item-grid">
                <div className="item-card">
                  <div className="item-title">Biểu tượng thời đại</div>
                  <div className="item-desc">Anh hùng giải phóng dân tộc thế kỷ XX, đáp ứng yêu cầu của thời đại mới.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Cống hiến lý luận cốt lõi</div>
                  <div className="item-desc">Cách mạng giải phóng dân tộc đi theo con đường vô sản (toàn dân tiến hành, nòng cốt công - nông, Đảng lãnh đạo).</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Tính chủ động, sáng tạo</div>
                  <div className="item-desc">Có thể thắng lợi trước cách mạng chính quốc bằng bạo lực (kết hợp chính trị và vũ trang).</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Bổ sung lý luận Mác - Lênin</div>
                  <div className="item-desc">Giải quyết mối quan hệ dân tộc - thuộc địa, dân tộc - giai cấp, độc lập dân tộc - CNXH; gắn giải phóng dân tộc với giải phóng con người.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Vai trò tiên phong</div>
                  <div className="item-desc">Góp phần to lớn làm sụp đổ hệ thống thuộc địa của chủ nghĩa thực dân.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sub-section">
            <div className="sub-content">
              <h3>Tư tưởng Hồ Chí Minh góp phần tích cực vào cuộc đấu tranh vì độc lập dân tộc, dân chủ, hòa bình, hợp tác và phát triển trên thế giới</h3>
              
              <div className="item-grid">
                <div className="item-card">
                  <div className="item-title">Xu thế hợp tác quốc tế</div>
                  <div className="item-desc">Phá bỏ biệt lập, liên kết dân tộc nhỏ yếu để chống lại chính sách &quot;chia để trị&quot;.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Gắn kết các phong trào</div>
                  <div className="item-desc">Kết nối cách mạng Việt Nam với phong trào giải phóng dân tộc, công nhân tư bản, cộng sản quốc tế và phong trào hòa bình thế giới.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Mục tiêu hợp tác toàn diện</div>
                  <div className="item-desc">Không chỉ giành độc lập mà còn xóa nghèo nàn, lạc hậu, phát triển lực lượng sản xuất, tiến kịp nước tiên tiến.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Chủ trương đối ngoại</div>
                  <div className="item-desc">&quot;Làm bạn với tất cả mọi nước dân chủ&quot;, không gây thù oán; thúc đẩy hội nhập, hòa bình, hữu nghị.</div>
                </div>
                <div className="item-card">
                  <div className="item-title">Nguyên tắc hợp tác</div>
                  <div className="item-desc">Giữ vững độc lập chủ quyền, bình đẳng cùng có lợi; kết hợp sức mạnh dân tộc và thời đại; làm tròn nghĩa vụ quốc tế.</div>
                </div>
              </div>

              <div className="quote-emphasis">
                Sự ghi nhận của Đảng (Đại hội XII): Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới, Người chiến sĩ cộng sản quốc tế mẫu mực.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
