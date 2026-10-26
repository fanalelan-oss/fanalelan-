import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { works as initialWorks } from './data';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  imgSrc: string;
  imageBase64?: string;
  description: string;
  submitterName?: string;
  submitterPhone?: string;
  location?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  token: string;
}

export interface ActivePin {
  pin: string;
  createdAt: string;
  expiresAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const APPROVED_FILE = path.join(DATA_DIR, 'approved-works.json');
const PENDING_FILE = path.join(DATA_DIR, 'pending-works.json');
const PINS_FILE = path.join(DATA_DIR, 'partner-pins.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPROVED_FILE)) {
    fs.writeFileSync(APPROVED_FILE, JSON.stringify([], null, 2), 'utf8');
  }
  if (!fs.existsSync(PENDING_FILE)) {
    fs.writeFileSync(PENDING_FILE, JSON.stringify([], null, 2), 'utf8');
  }
  if (!fs.existsSync(PINS_FILE)) {
    fs.writeFileSync(PINS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// ---------------- PIN MANAGEMENT (24 Hours Expiry) ----------------

export function getActivePins(): ActivePin[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(PINS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function generatePartnerPin(hours = 24): ActivePin {
  ensureDataFiles();
  const list = getActivePins();

  // Clean up PINs expired more than 24h ago
  const now = Date.now();
  const cleaned = list.filter(p => new Date(p.expiresAt).getTime() > now - 86400000);

  // Generate 6-digit random PIN
  const randomNum = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(now + hours * 3600 * 1000).toISOString();
  const createdAt = new Date(now).toISOString();

  const newPin: ActivePin = {
    pin: randomNum,
    createdAt,
    expiresAt,
  };

  cleaned.unshift(newPin);
  fs.writeFileSync(PINS_FILE, JSON.stringify(cleaned, null, 2), 'utf8');

  return newPin;
}

export function validatePartnerPin(inputPin: string): { valid: boolean; message?: string } {
  if (!inputPin || !inputPin.trim()) {
    return { valid: false, message: 'الرجاء إدخال كلمة المرور المؤقتة.' };
  }

  const cleanInput = inputPin.trim();
  const list = getActivePins();
  const now = new Date();

  // Find pin match
  const found = list.find(p => p.pin === cleanInput);

  if (!found) {
    return {
      valid: false,
      message: 'كلمة المرور غير صحيحة. يرجى الحصول على كلمة مرور صالحة من الإدارة.',
    };
  }

  // Check expiration
  if (new Date(found.expiresAt) <= now) {
    return {
      valid: false,
      message: 'انتهت صلاحية كلمة المرور (صالحة لمدة 24 ساعة فقط). يرجى طلب كلمة مرور جديدة من الإدارة.',
    };
  }

  return { valid: true };
}

// ---------------- GALLERY WORKS MANAGEMENT ----------------

export function getApprovedCustomWorks(): WorkItem[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(APPROVED_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getAllGalleryWorks() {
  const custom = getApprovedCustomWorks();
  // Newest custom approved works first, followed by base works
  const formattedCustom = custom.map(c => ({
    title: c.title,
    category: c.category,
    imgSrc: c.imageBase64 || c.imgSrc || `/api/works/image?id=${c.id}`,
    description: c.description,
  }));

  const formattedInitial = initialWorks.map(w => {
    const filename = w.imgSrc.startsWith('/api/works/image')
      ? w.imgSrc
      : `/api/works/image?file=${encodeURIComponent(w.imgSrc.replace(/^\/works_images\//, ''))}`;
    return {
      ...w,
      imgSrc: filename,
    };
  });

  return [...formattedCustom, ...formattedInitial];
}

export function getPendingWorks(): WorkItem[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(PENDING_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function savePendingWork(work: WorkItem) {
  ensureDataFiles();
  const list = getPendingWorks();
  list.unshift(work);
  fs.writeFileSync(PENDING_FILE, JSON.stringify(list, null, 2), 'utf8');
}

export function approveWorkById(id: string, token: string): { success: boolean; work?: WorkItem; message: string } {
  ensureDataFiles();
  const pending = getPendingWorks();
  const index = pending.findIndex(w => w.id === id && w.token === token);

  if (index === -1) {
    return { success: false, message: 'الطلب غير موجود أو تم اعتماده مسبقاً.' };
  }

  const [work] = pending.splice(index, 1);
  work.status = 'approved';

  const approved = getApprovedCustomWorks();
  approved.unshift(work);

  fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), 'utf8');
  fs.writeFileSync(APPROVED_FILE, JSON.stringify(approved, null, 2), 'utf8');

  return { success: true, work, message: 'تم اعتماد العمل وإضافته للمعرض بنجاح!' };
}

export function rejectWorkById(id: string, token: string): { success: boolean; message: string } {
  ensureDataFiles();
  const pending = getPendingWorks();
  const index = pending.findIndex(w => w.id === id && w.token === token);

  if (index === -1) {
    return { success: false, message: 'الطلب غير موجود أو تم معالجته بالفعل.' };
  }

  pending.splice(index, 1);
  fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), 'utf8');

  return { success: true, message: 'تم رفض العمل وحذفه من قائمة الانتظار.' };
}
