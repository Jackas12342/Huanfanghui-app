export type AccountState = "guest" | "phoneVerified" | "assetVerified";
export type VerificationStatus = "unverified" | "pending" | "approved" | "rejected";

export type SessionState = {
  id: string;
  phone?: string;
  accountState: AccountState;
  verificationStatus: VerificationStatus;
  wechatBound: boolean;
  wechatId?: string;
  blocked: boolean;
  otpCooldownUntil?: number;
  otpLockUntil?: number;
  otpAttempts: number;
};

export type PropertyCurrent = {
  city: string;
  district: string;
  compound: string;
  area: number;
  layout: string;
  floorLevel: "High" | "Mid" | "Low";
  buildingYear: number;
  orientation: string;
  estimatedValueWan: number;
  mortgage: "none" | "active";
};

export type PropertyTarget = {
  districts: string[];
  compounds: string[];
  minArea: number;
  maxArea: number;
  cashGapMinWan: number;
  cashGapMaxWan: number;
};

export type Listing = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerIntent: "downsize" | "upsize";
  current: PropertyCurrent;
  target: PropertyTarget;
  photos: string[];
  status: "draft" | "live" | "takedown";
  createdAt: number;
};

export type MatchBreakdown = {
  location: number;
  size: number;
  budget: number;
  total: number;
  strictReciprocal: boolean;
  reasons: string[];
};

export type ChatMessage = {
  id: string;
  from: string;
  body: string;
  at: number;
};

export type ContactShare = {
  requestedBy: string;
  acceptedByPeer: boolean;
  requesterWechatMasked: string;
  requesterWechatRaw?: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  listingId: string;
  peerName: string;
  bothInterested: boolean;
  blockedBy?: string;
  reports: number;
  contactShare?: ContactShare;
  messages: ChatMessage[];
};

export type Notification = {
  id: string;
  message: string;
  score: number;
  createdAt: number;
};

export type VerificationSubmission = {
  id: string;
  userId: string;
  docType: "房产证" | "身份证";
  fileName: string;
  status: VerificationStatus;
  createdAt: number;
};

export type UserReport = {
  id: string;
  threadId: string;
  reason: string;
  createdAt: number;
};

const KEY_SESSION = "hf.session";
const KEY_LISTINGS = "hf.listings";
const KEY_THREADS = "hf.threads";
const KEY_NOTIFICATIONS = "hf.notifications";
const KEY_VERIFICATIONS = "hf.verifications";
const KEY_REPORTS = "hf.reports";
const KEY_OTP = "hf.otp";

const MY_DEFAULT_PROFILE: Listing = {
  id: "my-home",
  ownerId: "me",
  ownerName: "你",
  ownerIntent: "upsize",
  current: {
    city: "深圳",
    district: "南山",
    compound: "阳光花园",
    area: 72,
    layout: "2室1厅1卫",
    floorLevel: "Mid",
    buildingYear: 2016,
    orientation: "南北通透",
    estimatedValueWan: 520,
    mortgage: "active",
  },
  target: {
    districts: ["福田", "南山"],
    compounds: [],
    minArea: 120,
    maxArea: 150,
    cashGapMinWan: -250,
    cashGapMaxWan: -80,
  },
  photos: [],
  status: "live",
  createdAt: Date.now(),
};

const SEEDED_LISTINGS: Listing[] = [
  {
    id: "listing-downsize-1",
    ownerId: "user-a",
    ownerName: "王女士",
    ownerIntent: "downsize",
    current: {
      city: "深圳",
      district: "福田",
      compound: "星河湾",
      area: 142,
      layout: "4室2厅2卫",
      floorLevel: "High",
      buildingYear: 2014,
      orientation: "南北通透",
      estimatedValueWan: 820,
      mortgage: "none",
    },
    target: {
      districts: ["南山", "福田"],
      compounds: [],
      minArea: 60,
      maxArea: 90,
      cashGapMinWan: 200,
      cashGapMaxWan: 350,
    },
    photos: ["客厅", "卧室", "厨房"],
    status: "live",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "listing-upsize-1",
    ownerId: "user-b",
    ownerName: "陈先生",
    ownerIntent: "upsize",
    current: {
      city: "深圳",
      district: "南山",
      compound: "科技园家园",
      area: 78,
      layout: "2室1厅1卫",
      floorLevel: "Low",
      buildingYear: 2018,
      orientation: "东南",
      estimatedValueWan: 560,
      mortgage: "active",
    },
    target: {
      districts: ["福田", "南山"],
      compounds: ["星河湾"],
      minArea: 120,
      maxArea: 160,
      cashGapMinWan: -280,
      cashGapMaxWan: -50,
    },
    photos: ["客厅", "卧室", "阳台"],
    status: "live",
    createdAt: Date.now() - 52000000,
  },
  {
    id: "listing-downsize-2",
    ownerId: "user-c",
    ownerName: "李女士",
    ownerIntent: "downsize",
    current: {
      city: "深圳",
      district: "宝安",
      compound: "壹方城",
      area: 128,
      layout: "3室2厅2卫",
      floorLevel: "Mid",
      buildingYear: 2019,
      orientation: "南向",
      estimatedValueWan: 680,
      mortgage: "active",
    },
    target: {
      districts: ["南山", "宝安"],
      compounds: [],
      minArea: 70,
      maxArea: 95,
      cashGapMinWan: 120,
      cashGapMaxWan: 260,
    },
    photos: ["客厅", "主卧", "景观"],
    status: "live",
    createdAt: Date.now() - 31000000,
  },
];

const SEEDED_THREADS: ChatThread[] = [
  {
    id: "thread-1",
    listingId: "listing-downsize-1",
    peerName: "王女士",
    bothInterested: true,
    reports: 0,
    messages: [
      { id: "m1", from: "peer", body: "你好，我看你房子面积很合适。", at: Date.now() - 3600000 },
      { id: "m2", from: "me", body: "你好，我也在看你这套四居。", at: Date.now() - 3500000 },
    ],
  },
  {
    id: "thread-2",
    listingId: "listing-downsize-2",
    peerName: "李女士",
    bothInterested: false,
    reports: 0,
    messages: [{ id: "m3", from: "peer", body: "如果你有兴趣可先点互相意向。", at: Date.now() - 4200000 }],
  },
];

const defaultSession = (): SessionState => ({
  id: "me",
  accountState: "guest",
  verificationStatus: "unverified",
  wechatBound: false,
  blocked: false,
  otpAttempts: 0,
});

const canUseStorage = () => typeof window !== "undefined";

const read = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const withSeed = <T,>(key: string, seeded: T): T => {
  if (!canUseStorage()) return seeded;
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return read(key, seeded);
  }
  write(key, seeded);
  return seeded;
};

export const maskWechatId = (wechatId: string) => {
  if (wechatId.length <= 4) return "****";
  return `${wechatId.slice(0, 2)}****${wechatId.slice(-2)}`;
};

export const loadSession = () => read(KEY_SESSION, defaultSession());
export const saveSession = (session: SessionState) => write(KEY_SESSION, session);
export const signOut = () => saveSession(defaultSession());

export const loadListings = () => withSeed(KEY_LISTINGS, SEEDED_LISTINGS);
export const saveListings = (listings: Listing[]) => write(KEY_LISTINGS, listings);

export const loadThreads = () => withSeed(KEY_THREADS, SEEDED_THREADS);
export const saveThreads = (threads: ChatThread[]) => write(KEY_THREADS, threads);

export const loadNotifications = () => read<Notification[]>(KEY_NOTIFICATIONS, []);
export const saveNotifications = (notifications: Notification[]) => write(KEY_NOTIFICATIONS, notifications);

export const loadVerificationSubmissions = () => read<VerificationSubmission[]>(KEY_VERIFICATIONS, []);
export const saveVerificationSubmissions = (submissions: VerificationSubmission[]) => write(KEY_VERIFICATIONS, submissions);

export const loadReports = () => read<UserReport[]>(KEY_REPORTS, []);
export const saveReports = (reports: UserReport[]) => write(KEY_REPORTS, reports);

const getOtpState = () => read<{ code: string; phone: string; expiresAt: number } | null>(KEY_OTP, null);

const districtMatch = (district: string, targetDistricts: string[]) => targetDistricts.includes(district);

const sizeInRange = (area: number, min: number, max: number) => area >= min && area <= max;

const financialOutcomeForA = (a: Listing, b: Listing) => a.current.estimatedValueWan - b.current.estimatedValueWan;

const financialRangeMatch = (expected: number, min: number, max: number) => expected >= min && expected <= max;

const computeBudgetScore = (expected: number, min: number, max: number) => {
  if (financialRangeMatch(expected, min, max)) return 15;
  const distance = expected < min ? min - expected : expected - max;
  if (distance <= 40) return 10;
  if (distance <= 80) return 5;
  return 0;
};

export const reciprocalMatch = (a: Listing, b: Listing): MatchBreakdown => {
  const locationA = districtMatch(a.current.district, b.target.districts);
  const locationB = districtMatch(b.current.district, a.target.districts);
  const sizeA = sizeInRange(a.current.area, b.target.minArea, b.target.maxArea);
  const sizeB = sizeInRange(b.current.area, a.target.minArea, a.target.maxArea);

  const aOutcome = financialOutcomeForA(a, b);
  const bOutcome = -aOutcome;
  const budgetA = financialRangeMatch(aOutcome, a.target.cashGapMinWan, a.target.cashGapMaxWan);
  const budgetB = financialRangeMatch(bOutcome, b.target.cashGapMinWan, b.target.cashGapMaxWan);

  const strictReciprocal = locationA && locationB && sizeA && sizeB && budgetA && budgetB;

  const locationScore = (locationA ? 20 : 0) + (locationB ? 20 : 0);
  const sizeScore = (sizeA ? 15 : 0) + (sizeB ? 15 : 0);
  const budgetScore = computeBudgetScore(aOutcome, a.target.cashGapMinWan, a.target.cashGapMaxWan) + computeBudgetScore(bOutcome, b.target.cashGapMinWan, b.target.cashGapMaxWan);

  const reasons: string[] = [];
  reasons.push(locationA && locationB ? "双方目标区域互相覆盖" : "区域目标仅部分重合");
  reasons.push(sizeA && sizeB ? "双方面积需求互相满足" : "面积需求存在偏差");
  reasons.push(budgetA && budgetB ? "现金差额可接受" : "现金差额需协商");

  return {
    location: locationScore,
    size: sizeScore,
    budget: budgetScore,
    total: Math.min(100, locationScore + sizeScore + budgetScore),
    strictReciprocal,
    reasons,
  };
};

export const getViewerBaseListing = () => MY_DEFAULT_PROFILE;

export const requestOtp = (phone: string) => {
  const now = Date.now();
  const session = loadSession();
  if (session.otpLockUntil && now < session.otpLockUntil) {
    return { ok: false, message: "尝试次数过多，请稍后再试。" };
  }
  if (session.otpCooldownUntil && now < session.otpCooldownUntil) {
    const seconds = Math.ceil((session.otpCooldownUntil - now) / 1000);
    return { ok: false, message: `请在 ${seconds}s 后重试发送验证码` };
  }

  const expiresAt = now + 5 * 60 * 1000;
  write(KEY_OTP, { code: "123456", phone, expiresAt });
  saveSession({ ...session, otpCooldownUntil: now + 60 * 1000 });
  return { ok: true, message: "验证码已发送（演示码：123456）" };
};

export const verifyOtp = (phone: string, code: string) => {
  const now = Date.now();
  const session = loadSession();
  if (session.otpLockUntil && now < session.otpLockUntil) {
    return { ok: false, message: "账号临时锁定，请10分钟后再试。" };
  }

  const otp = getOtpState();
  const valid = !!otp && otp.phone === phone && otp.expiresAt > now && otp.code === code;
  if (!valid) {
    const attempts = session.otpAttempts + 1;
    const shouldLock = attempts >= 5;
    saveSession({
      ...session,
      otpAttempts: shouldLock ? 0 : attempts,
      otpLockUntil: shouldLock ? now + 10 * 60 * 1000 : session.otpLockUntil,
    });
    return { ok: false, message: shouldLock ? "错误过多，已锁定10分钟。" : `验证码错误，还可尝试 ${5 - attempts} 次` };
  }

  const next: SessionState = {
    ...session,
    phone,
    accountState: session.verificationStatus === "approved" ? "assetVerified" : "phoneVerified",
    otpAttempts: 0,
    otpLockUntil: undefined,
  };
  saveSession(next);
  return { ok: true, message: "登录成功" };
};

export const bindWechat = (wechatId: string) => {
  const session = loadSession();
  saveSession({ ...session, wechatBound: true, wechatId });
};

export const submitVerification = (docType: "房产证" | "身份证", fileName: string) => {
  const session = loadSession();
  const submission: VerificationSubmission = {
    id: `v-${Date.now()}`,
    userId: session.id,
    docType,
    fileName,
    status: "pending",
    createdAt: Date.now(),
  };

  const submissions = [submission, ...loadVerificationSubmissions()];
  saveVerificationSubmissions(submissions);
  saveSession({ ...session, verificationStatus: "pending", accountState: "phoneVerified" });
};

export const adminUpdateVerification = (submissionId: string, status: "approved" | "rejected") => {
  const submissions = loadVerificationSubmissions().map((item) => (item.id === submissionId ? { ...item, status } : item));
  saveVerificationSubmissions(submissions);
  const mySubmission = submissions.find((item) => item.userId === "me" && item.id === submissionId);
  if (mySubmission) {
    const session = loadSession();
    saveSession({
      ...session,
      verificationStatus: status,
      accountState: status === "approved" ? "assetVerified" : "phoneVerified",
    });
  }
};

export const addListing = (listing: Omit<Listing, "id" | "createdAt" | "status">) => {
  const nextListing: Listing = {
    ...listing,
    id: `listing-${Date.now()}`,
    createdAt: Date.now(),
    status: "live",
  };

  const all = [nextListing, ...loadListings()];
  saveListings(all);

  const base = getViewerBaseListing();
  const scored = reciprocalMatch(base, nextListing);
  if (scored.total >= 80) {
    const note: Notification = {
      id: `n-${Date.now()}`,
      score: scored.total,
      message: `新上架房源 ${nextListing.current.area}㎡ ${nextListing.current.compound} 与你的需求匹配度 ${scored.total}%`,
      createdAt: Date.now(),
    };
    saveNotifications([note, ...loadNotifications()]);
  }

  return nextListing;
};

export const setListingTakedown = (listingId: string) => {
  const listings = loadListings().map((item) => (item.id === listingId ? { ...item, status: item.status === "takedown" ? "live" : "takedown" } : item));
  saveListings(listings);
};

export const createIntent = (listingId: string) => {
  const threads = loadThreads();
  const idx = threads.findIndex((t) => t.listingId === listingId);
  if (idx >= 0) {
    threads[idx] = { ...threads[idx], bothInterested: true };
    saveThreads(threads);
    return;
  }
  const listing = loadListings().find((l) => l.id === listingId);
  const newThread: ChatThread = {
    id: `thread-${Date.now()}`,
    listingId,
    peerName: listing?.ownerName ?? "对方用户",
    bothInterested: true,
    reports: 0,
    messages: [{ id: `m-${Date.now()}`, from: "system", body: "双方已互相表达意向，可开始沟通。", at: Date.now() }],
  };
  saveThreads([newThread, ...threads]);
};

export const sendMessage = (threadId: string, body: string) => {
  const threads = loadThreads().map((thread) => {
    if (thread.id !== threadId) return thread;
    return {
      ...thread,
      messages: [...thread.messages, { id: `m-${Date.now()}`, from: "me", body, at: Date.now() }],
    };
  });
  saveThreads(threads);
};

export const requestContactShare = (threadId: string, wechatId: string) => {
  const masked = maskWechatId(wechatId);
  const threads = loadThreads().map((thread) => {
    if (thread.id !== threadId) return thread;
    return {
      ...thread,
      contactShare: {
        requestedBy: "me",
        acceptedByPeer: false,
        requesterWechatMasked: masked,
        requesterWechatRaw: wechatId,
        createdAt: Date.now(),
      },
    };
  });
  saveThreads(threads);
};

export const approveContactShareByPeer = (threadId: string) => {
  const threads = loadThreads().map((thread) => {
    if (thread.id !== threadId || !thread.contactShare) return thread;
    return {
      ...thread,
      contactShare: {
        ...thread.contactShare,
        acceptedByPeer: true,
      },
    };
  });
  saveThreads(threads);
};

export const revokeContactShare = (threadId: string) => {
  const threads = loadThreads().map((thread) => (thread.id === threadId ? { ...thread, contactShare: undefined } : thread));
  saveThreads(threads);
};

export const reportThread = (threadId: string, reason: string) => {
  const reports = [{ id: `r-${Date.now()}`, threadId, reason, createdAt: Date.now() }, ...loadReports()];
  saveReports(reports);

  const threads = loadThreads().map((thread) => (thread.id === threadId ? { ...thread, reports: thread.reports + 1 } : thread));
  saveThreads(threads);
};

export const blockThread = (threadId: string) => {
  const threads = loadThreads().map((thread) => (thread.id === threadId ? { ...thread, blockedBy: "me" } : thread));
  saveThreads(threads);
};

export const clearDemoData = () => {
  if (!canUseStorage()) return;
  [KEY_SESSION, KEY_LISTINGS, KEY_THREADS, KEY_NOTIFICATIONS, KEY_VERIFICATIONS, KEY_REPORTS, KEY_OTP].forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

export const accountStateLabel = (state: AccountState) => {
  if (state === "guest") return "游客";
  if (state === "phoneVerified") return "手机号已认证";
  return "资产已认证";
};

export const verificationLabel = (status: VerificationStatus) => {
  if (status === "pending") return "审核中";
  if (status === "approved") return "已通过";
  if (status === "rejected") return "未通过";
  return "未提交";
};
