import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // ดึง IP Address
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || "Direct Visit";
    const timestamp = new Date().toISOString();

    // สร้าง Object สำหรับบันทึกข้อมูล
    const logData = { ip, userAgent, referrer, timestamp };

    // กำหนด Path ของ Log File (ใน Vercel จะเป็นแบบชั่วคราว)
    const logFilePath = path.join(process.cwd(), 'public', 'logs.json');

    // โหลดข้อมูลเก่า แล้วเพิ่มข้อมูลใหม่
    let logs = [];
    if (fs.existsSync(logFilePath)) {
        logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
    }
    logs.push(logData);

    // บันทึกข้อมูลกลับไปที่ไฟล์
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

    // ส่งค่ากลับไปที่ Client
    res.status(200).json({ success: true, message: "IP Logged", data: logData });
}
