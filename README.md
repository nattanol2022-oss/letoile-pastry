# Fi Designer Web Lab

ชุดหน้าเว็บทดลองและงานต้นแบบที่จัดแยกตามโปรเจกต์

## โครงสร้าง

- `index.html` - หน้า La Poire หลัก
- `pages/` - เดโมที่แยกเป็นโปรเจกต์ย่อย แต่ละโฟลเดอร์เก็บไฟล์ที่เกี่ยวข้องกัน
- `assets/images/` - ภาพประกอบและ reference images
- `assets/video/` - วิดีโอที่ใช้โดยหน้าเว็บ
- `tools/blender/` - สคริปต์สำหรับสร้างโมเดล Blender
- `AI_CONTEXT_LOG.md` - บันทึก handoff และสถานะสำคัญสำหรับ AI/ผู้ช่วยที่ทำงานต่อ

## การเปิดใช้งาน

ติดตั้ง dependency และ build CSS ก่อนเปิดหน้าเว็บหลัก:

```powershell
npm install
npm run build:css
```

จากนั้นเปิด `index.html` สำหรับหน้าเว็บหลัก หรือเปิดไฟล์ใน `pages/` เพื่อดูเดโมแต่ละชุด

หน้าแรกใช้โมเดล 3D `gatochan.glb` เป็น mascot หลัก โมเดลจะ sway เบา ๆ ตามเวลา, หันตาม pointer, ลอยขึ้นเมื่อกด และย้ายไปอยู่ในตำแหน่งปลอดภัยระหว่าง scroll โดยรองรับ `prefers-reduced-motion`

โปรเจกต์ที่ใช้ ES modules หรือโหลดทรัพยากรข้ามไฟล์ควรเปิดผ่าน local web server แทน `file://`

## หมายเหตุ

เดโม `gtext` และ `hex` ยังอ้างถึงไฟล์ dependency เดิมที่ไม่ได้อยู่ในชุดไฟล์นี้
ส่วน `race` เก็บ `engine.js` และ `game.js` ไว้ในโฟลเดอร์เดียวกับหน้าเกม
เพื่อให้โหลดด้วยลำดับที่ถูกต้อง

## สร้างโมเดล 3D ด้วย TripoSR

ติดตั้ง dependency ใน PowerShell:

```powershell
cd "C:\Archives\Fi Designer\web"
python -m pip install -r tools\blender\requirements-triposr.txt
```

จากนั้นสร้างไฟล์ OBJ จากภาพอ้างอิง:

```powershell
python tools\blender\tripo_sr_generate.py `
  --input "C:\path\to\reference.png" `
  --output "tools\blender\tripo_sr_output.obj"
```

ใช้ `--device cpu` หากไม่มี NVIDIA CUDA หรือ `--chunk-size 4096` หากหน่วยความจำการ์ดจอไม่พอ แล้วนำไฟล์ OBJ ที่ได้ไปเปิดใน Blender ได้โดยตรง
