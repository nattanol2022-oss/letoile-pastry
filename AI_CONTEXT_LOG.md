# AI Context Log

ไฟล์นี้เป็นบันทึก handoff สำหรับ AI/ผู้ช่วยที่ทำงานต่อในโปรเจกต์ La Poire
บันทึกเฉพาะข้อมูลที่จำเป็นต่อการพัฒนาและตรวจสอบงาน ไม่เก็บคำสั่งระบบ ข้อมูลลับ
หรือข้อมูลส่วนตัวที่ไม่เกี่ยวข้องกับโปรเจกต์

## วิธีใช้

1. อ่านส่วน `Current state` และ `Open items` ก่อนแก้โค้ด
2. ตรวจไฟล์ที่ระบุว่าเป็น source of truth ก่อนเริ่มงาน
3. หลังทำงาน ให้เพิ่มรายการใหม่ใน `Activity log` พร้อมไฟล์ที่แก้และผลตรวจสอบ
4. ห้ามทำซ้ำงานที่อยู่ใน `Completed decisions` เว้นแต่มีคำขอใหม่ให้เปลี่ยนพฤติกรรม

## Project

- ชื่อ: La Poire / Fi Designer Web Lab
- Root: `C:\Archives\Fi Designer\web`
- เปิด preview ผ่าน local web server เช่น `http://127.0.0.1:8765/`
- หน้าแรก: `index.html`
- Mascot logic: `cat-interaction.js`
- Mascot assets: `background_removed_images\`

## Completed decisions

- จัดโครงสร้างเป็น `pages\`, `assets\images\`, `assets\video\`,
  `tools\blender\`
- หน้า Contact เชื่อมไปยังเดโมใน `pages\`
- แก้การโหลด Plant, City และ Race ให้ทำงานจาก local dependencies
- City ใช้ Babel Standalone เพื่อ transpile JSX/TypeScript ใน browser
- แมว calico แสดงเฉพาะหน้าแรก
- แมวเริ่มที่ด้านขวาของ Hero และมี idle, blink, smile, wave และ jump frames
- Scroll ช่วง Hero ใช้เปลี่ยน frame; เมื่อหยุดจะกลับไป idle loop
- คลิกแมวเล่น jump และ smooth-scroll กลับด้านบน โดยยังไม่ใช้เสียง
- หลังเลื่อนพ้น Hero แมวเลือกตำแหน่งซ้าย/กลาง/ขวาโดยหลบ visible text
- ขนาดแมวต้องคงเดิมขณะ follow ห้ามย่อเมื่อ scroll
- หากไม่มีพื้นที่ว่าง แมวต้องหลบออกนอกขอบจอ เหลือบางส่วนให้แอบมอง

## Current state

- `cat-interaction.js` มี text collision detection ด้วย `TreeWalker` และ
  `Range.getClientRects()`
- collision padding ปัจจุบัน 24px
- fallback peeking ใช้ตำแหน่งนอก viewport แทนการวางทับ content
- `index.html` และ `cat-interaction.js` ตรวจ syntax/Problems ล่าสุดแล้วไม่พบ error
- พบ request วิดีโอ `assets/video/hero-live2d.mp4.mp4` ถูก abort ระหว่าง
  navigation บางครั้ง แต่หน้าเว็บยัง render ได้
- Tailwind CDN มี warning สำหรับ production; ยังไม่ได้เปลี่ยนตามคำขอ

## Open items

- ตรวจ interaction เพิ่มบน viewport มือถือและหลายระดับ scroll
- พิจารณาย้าย inline CSS/สคริปต์ไปไฟล์แยก หากต้องการ production hardening
- แก้หรือยืนยันชื่อ/การมีอยู่ของไฟล์วิดีโอ หากต้องการลด request failure
- `gtext` และ `hex` ยังอ้าง dependency เดิมที่ไม่อยู่ในชุดไฟล์

## Activity log

### 2026-09-05 19:58 (Asia/Bangkok)

- Request: เริ่มเก็บ log ของ prompt/บทสนทนาและข้อมูลจำเป็น เพื่อให้ AI
  ทำงานต่อได้เร็วและไม่ทำงานซ้ำ
- Action: สร้างไฟล์ context แบบย่อที่รวมข้อสรุปทางเทคนิค สถานะปัจจุบัน
  รายการงานค้าง และกติกาการอัปเดต log
- Validation: ตรวจอ่าน `README.md`, `index.html`, `cat-interaction.js`
  และตรวจ schema ของ session inbox แล้ว

### 2026-09-05 20:00 (Asia/Bangkok)

- Request: ให้แมวในหน้า `index` หันกลับด้าน เพื่อไม่บังตัวอักษร
- Action: เพิ่ม `transform: scaleX(-1)` ให้ภาพใน `.hero-cat` โดยไม่เปลี่ยน
  geometry ของปุ่ม ตำแหน่ง collision หรือขนาดระหว่าง scroll
- Validation: ตรวจ Problems ของไฟล์หลังแก้ไขแล้วไม่พบ error

### 2026-09-05 20:01 (Asia/Bangkok)

- Request: เมื่อเลื่อนกลับขึ้นหน้า Hero แมวต้องกลับไปอยู่ตำแหน่งเดิม
- Root cause: โหมด follow ใส่ inline `left`, `top` และ `right: auto` แต่ตอน
  ออกจากโหมด follow ลบเพียง class ทำให้ inline position ค้างและ override CSS Hero
- Action: ล้าง inline position ทั้งสามค่าเมื่อกลับเหนือ threshold และคืน idle frame
  เมื่อไม่ได้อยู่ระหว่าง jump

### 2026-09-06

- Request: เพิ่มสินค้าใน Showcase จาก `renamed-images`, แบ่งหมวดหมู่ และเลื่อนเมนูอัตโนมัติทุก 3 วินาที
- Action: ขยายข้อมูลเป็น 24 รายการใน 6 หมวดหมู่, สร้างรายการการ์ดแบบ grouped จาก JavaScript,
  sync รูป/รายละเอียด/ราคา/สีตามรายการที่เลือก และเพิ่ม autoplay ที่หยุดเมื่อ hover/focus
  พร้อมปิด autoplay เมื่อเปิด reduced motion
- Validation: `node --check product-showcase.js`, Problems ของ `index.html` และ
  `product-showcase.js` ไม่พบ error; browser ตรวจพบการ์ด 24 ใบ, 6 หมวดหมู่,
  asset images โหลดครบ และ autoplay เปลี่ยนรายการได้

### 2026-09-05 20:03 (Asia/Bangkok)

- Request: ให้แมวขยับเปลี่ยนพื้นที่อย่างเป็นธรรมชาติ ไม่กระโดดข้ามตำแหน่ง
- Action: เพิ่มการเริ่มโหมด follow จากตำแหน่ง viewport ปัจจุบันก่อน แล้วค่อย
  transition ไปยังพื้นที่ปลอดภัย พร้อมใช้ easing 1.15 วินาทีและ `will-change`
  สำหรับการเคลื่อนที่ซ้าย/กลาง/ขวา

### 2026-09-05 20:48 (Asia/Bangkok)

- Request: ทดลองใช้ GSAP กับหน้าแรกครบทุก interaction ที่เสนอไว้
- Action: สร้าง `gsap-home.js` สำหรับ Hero intro, section/card reveal,
  video/image parallax, scroll storytelling และ hover micro-interactions
- Safety: เคารพ `prefers-reduced-motion` และแยกจาก logic ของแมว

### 2026-09-06 04:21 (Asia/Bangkok)

- Request: สร้าง Product Showcase / Carousel UI สไตล์ Modern Dynamic
  โดยใช้ภาพเมนูจาก `renamed-images`
- Action: เพิ่ม Showcase ระหว่าง Hero กับเมนูเดิมใน `index.html` พร้อม
  vertical selection cards, สี theme ตามสินค้า, floating accents และ CTA
- Added: `product-showcase.js` สำหรับเปลี่ยนสินค้า, ปุ่มขึ้น/ลง, keyboard
  arrows, image/text transition และ reduced-motion fallback
- Note: โปรเจกต์ปัจจุบันเป็น static HTML + GSAP ไม่ใช่ Next.js App Router
  จึงใช้โครงสร้างที่เข้ากับระบบเดิมแทนการเพิ่ม build pipeline ใหม่
- Validation: ตรวจ syntax, Problems และทดสอบเปลี่ยนสินค้าใน browser แล้ว

### 2026-09-06 05:33 (Asia/Bangkok)

- Request: หน้าเว็บบนมือถืออ่านและใช้งานยากกว่าบนคอมพิวเตอร์
- Action: ปรับ mobile responsive ของ Hero, mascot และ Product Showcase:
  ลดขนาด/opacity แมว, จำกัดความกว้าง headline, ใช้ `100svh`, ลด padding,
  ลดขนาด product image/cards และเพิ่มพื้นที่แตะปุ่ม
- Follow-up: แก้ path ภาพ Showcase ให้ใช้ชื่อไฟล์จริงที่ลงท้ายด้วย
  `_no_background.png` หลังตรวจพบ asset 404 บน mobile preview

### 2026-09-06 05:40 (Asia/Bangkok)

- Request: แบ่ง Showcase เป็น 3 ส่วน ได้แก่ รายละเอียดสินค้า, รูปสินค้า และ
  แผงเมนู; บนมือถือให้รูปกับเมนูอยู่แถวเดียวกัน และรายละเอียดอยู่แถวล่าง
- Action: แยก markup เป็น `showcase-details`, `showcase-stage` และ
  `showcase-menu`; desktop ใช้ 3 columns และ mobile ใช้ grid areas
  `"image menu" "details details"`
- Validation: ตรวจ Problems/syntax และตรวจ browser ที่ viewport 390px แล้ว
  พบภาพโหลดได้ ไม่มี horizontal overflow เกิน viewport และรายละเอียดอยู่แถวล่าง

### 2026-09-06 05:42 (Asia/Bangkok)

- Request: ปรับลำดับ mobile Showcase ใหม่ เพราะการแบ่งสองคอลัมน์ยังไม่สวย
- Action: เปลี่ยน mobile grid เป็นแนวตั้งเต็มความกว้างตามลำดับ
  รูปสินค้า → แผงเมนู → รายละเอียดสินค้า

### 2026-09-06 06:02 (Asia/Bangkok)

- Request: เปลี่ยนหมวดหมู่เป็น tab ใต้ Explore menu, ให้รายการของ tab ที่เลือกแสดง
  และเลื่อนสินค้าที่เลือกขึ้นด้านบน; รวมคำอธิบายกับรูปบนเดสก์ท็อป แต่คงลำดับ
  รูปภาพ → เมนู → รายละเอียดบนมือถือ
- Action: เพิ่ม category tabs แบบ horizontal scroll, filter รายการตามหมวดที่เลือก,
  auto-scroll การ์ด active ขึ้นต้นรายการ และรวม details/stage เป็น product panel
  เดียวบน desktop ด้วย responsive CSS
- Validation: Problems และ `node --check` ผ่าน; browser ตรวจพบ 6 tabs,
  เปลี่ยนไป Brookie แล้วแสดงเฉพาะ 6 รายการของหมวดพร้อมรายการแรกอยู่บนสุด;
  mobile ยังคงลำดับ image/menu/details
