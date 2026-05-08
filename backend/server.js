const path = require('path');
const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = 3000;
/** 项目根目录（与 server.js 所在 backend 目录相对固定，不依赖你从哪个目录执行 node） */
const PROJECT_ROOT = path.join(__dirname, '..');

// 中间件
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(PROJECT_ROOT));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'mian1-backend', time: new Date().toISOString() });
});

// 初始化数据库
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  merchants: [],
  deliveries: [],
  areas: ['片区A', '片区B', '片区C'],
  snapshots: {}
}).write();

function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function saveSnapshotForDate(dateKey, data) {
  const snapshots = db.get('snapshots').value() || {};
  snapshots[dateKey] = data;
  db.set('snapshots', snapshots).write();
}

function snapshotCurrentMerchants(dateKey = getDateKey()) {
  const merchants = db.get('merchants').value() || [];
  saveSnapshotForDate(dateKey, merchants);
}

function ensureYesterdaySnapshotOnDateChange(previousDateKey, currentDateKey) {
  if (!previousDateKey || previousDateKey === currentDateKey) return;

  const snapshots = db.get('snapshots').value() || {};
  if (!snapshots[previousDateKey]) {
    const merchants = db.get('merchants').value() || [];
    saveSnapshotForDate(previousDateKey, merchants);
  }
}

/** 历史快照保留天数（月度总结依赖每日快照）。环境变量 SNAPSHOT_RETENTION_DAYS，默认 400（约一年多）；可用 DATA_RETENTION_DAYS 兼容旧配置 */
function getSnapshotRetentionDays() {
  const snap = parseInt(process.env.SNAPSHOT_RETENTION_DAYS || '', 10);
  if (!Number.isNaN(snap) && snap > 0) {
    return Math.min(800, Math.max(90, snap));
  }
  const legacy = parseInt(process.env.DATA_RETENTION_DAYS || '', 10);
  if (!Number.isNaN(legacy) && legacy > 0) {
    return Math.min(800, Math.max(90, legacy));
  }
  return 400;
}

/** 送货流水 deliveries 保留天数，默认 90 */
function getDeliveryRetentionDays() {
  const n = parseInt(
    process.env.DELIVERY_RETENTION_DAYS || process.env.DATA_RETENTION_DAYS || '90',
    10
  );
  if (Number.isNaN(n)) return 90;
  return Math.min(400, Math.max(30, n));
}

function cleanupOldSnapshots(retentionDays) {
  const days = retentionDays != null ? retentionDays : getSnapshotRetentionDays();
  const snapshots = db.get('snapshots').value() || {};
  const now = new Date();
  const pruned = {};

  Object.entries(snapshots).forEach(([dateKey, snapshot]) => {
    const snapshotDate = new Date(`${dateKey}T00:00:00`);
    if (Number.isNaN(snapshotDate.getTime())) return;
    const ageDays = Math.floor((now - snapshotDate) / (1000 * 60 * 60 * 24));
    if (ageDays <= days) {
      pruned[dateKey] = snapshot;
    }
  });

  db.set('snapshots', pruned).write();
}

/** 删除早于保留期的送货流水（不动 merchants） */
function cleanupOldDeliveries(retentionDays) {
  const days = retentionDays != null ? retentionDays : getDeliveryRetentionDays();
  const deliveries = db.get('deliveries').value() || [];
  const now = new Date();
  const kept = deliveries.filter((d) => {
    const t = d.createdAt || d.date;
    if (!t) return true;
    const dt = new Date(t);
    if (Number.isNaN(dt.getTime())) return true;
    const ageDays = Math.floor((now - dt) / (1000 * 60 * 60 * 24));
    return ageDays <= days;
  });
  if (kept.length !== deliveries.length) {
    db.set('deliveries', kept).write();
  }
}

function runScheduledCleanup() {
  cleanupOldSnapshots(getSnapshotRetentionDays());
  cleanupOldDeliveries(getDeliveryRetentionDays());
}

// 商家相关API
app.get('/api/merchants', (req, res) => {
  let merchants = db.get('merchants').value() || [];
  const { area, search } = req.query;

  if (area && area !== 'all') {
    merchants = merchants.filter(m => m.area === area);
  }

  if (search) {
    merchants = merchants.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      (m.phone && m.phone.includes(search))
    );
  }

  res.json(merchants);
});

app.get('/api/merchants/:id', (req, res) => {
  const merchant = db.get('merchants').find({ id: parseInt(req.params.id) }).value();
  if (!merchant) {
    res.status(404).json({ error: '商家不存在' });
  } else {
    res.json(merchant);
  }
});

app.post('/api/merchants', (req, res) => {
  const { name, contact, phone, remark, area } = req.body;
  
  const newMerchant = {
    id: Date.now(),
    name: req.body.name || '',
    contact: req.body.contact || '',
    phone: req.body.phone || '',
    remark: req.body.remark || '',
    area: area || '',
    delivered: 0,
    deliveryDate: '',
    amount: 0,
    isOwing: 0,
    shopPhoto: '',
    billPhoto: '',
    paymentMethods: '[]',
    receivedAmount: 0,
    paymentDate: '',
    wechatAmount: 0,
    alipayAmount: 0,
    cardAmount: 0,
    cashAmount: 0,
    needDelivery: req.body.needDelivery || false,
    isTemp: req.body.isTemp || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.get('merchants').push(newMerchant).write();
  snapshotCurrentMerchants();
  res.status(201).json(newMerchant);
});

app.put('/api/merchants/:id', (req, res) => {
  const merchant = db.get('merchants').find({ id: parseInt(req.params.id) }).value();
  
  if (!merchant) {
    res.status(404).json({ error: '商家不存在' });
    return;
  }

  const updated = {
    ...merchant,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  db.get('merchants').find({ id: parseInt(req.params.id) }).assign(updated).write();
  snapshotCurrentMerchants();
  res.json(updated);
});

app.delete('/api/merchants/:id', (req, res) => {
  const count = db.get('merchants').value().length;
  db.get('merchants').remove({ id: parseInt(req.params.id) }).write();
  
  if (db.get('merchants').value().length === count) {
    res.status(404).json({ error: '商家不存在' });
  } else {
    snapshotCurrentMerchants();
    res.json({ success: true });
  }
});

// 片区相关API
app.get('/api/areas', (req, res) => {
  res.json(db.get('areas').value() || []);
});

app.post('/api/areas', (req, res) => {
  const { name } = req.body;
  
  if ((db.get('areas').value() || []).includes(name)) {
    res.status(400).json({ error: '片区已存在' });
    return;
  }

  db.get('areas').push(name).write();
  res.status(201).json({ name });
});

app.delete('/api/areas/:name', (req, res) => {
  const name = req.params.name;
  const count = db.get('areas').value().length;
  db.get('areas').remove(item => item === name).write();
  
  if (db.get('areas').value().length === count) {
    res.status(404).json({ error: '片区不存在' });
  } else {
    res.json({ success: true });
  }
});

// 送货记录API
app.get('/api/deliveries', (req, res) => {
  let deliveries = db.get('deliveries').value() || [];
  const { area, date } = req.query;

  if (area) {
    deliveries = deliveries.filter(d => d.area === area);
  }

  if (date) {
    deliveries = deliveries.filter(d => d.date === date);
  }

  res.json(deliveries);
});

app.post('/api/deliveries', (req, res) => {
  const { merchantId, amount, payment, paymentType, debt, area } = req.body;
  
  const newDelivery = {
    id: Date.now(),
    merchantId,
    amount: amount || 0,
    payment: payment || 0,
    paymentType: paymentType || '',
    debt: debt || 0,
    area: area || '',
    createdAt: new Date().toISOString()
  };

  db.get('deliveries').push(newDelivery).write();
  res.status(201).json(newDelivery);
});

// 历史快照API（按日期保存整日数据）
app.get('/api/snapshots/:date', (req, res) => {
  const date = req.params.date;
  const snapshots = db.get('snapshots').value() || {};
  res.json({ date, data: snapshots[date] || [] });
});

app.put('/api/snapshots/:date', (req, res) => {
  const date = req.params.date;
  const data = Array.isArray(req.body.data) ? req.body.data : [];
  const snapshots = db.get('snapshots').value() || {};
  snapshots[date] = data;
  db.set('snapshots', snapshots).write();
  res.json({ success: true, date, count: data.length });
});

// JSON 解析错误等
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '请求体不是合法 JSON' });
  }
  console.error('未处理错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  // 启动时保存一次当天快照，并持续自动保存，避免依赖前端手动导出
  let lastSnapshotDateKey = getDateKey();
  snapshotCurrentMerchants(lastSnapshotDateKey);
  runScheduledCleanup();
  setInterval(() => {
    const currentDateKey = getDateKey();
    ensureYesterdaySnapshotOnDateChange(lastSnapshotDateKey, currentDateKey);
    snapshotCurrentMerchants(currentDateKey);
    runScheduledCleanup();
    lastSnapshotDateKey = currentDateKey;
  }, 5 * 60 * 1000);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`静态文件目录: ${PROJECT_ROOT}`);
  console.log(`本机请用浏览器打开: http://localhost:${PORT}/ （不要双击本地 HTML 用 file:// 打开）`);
});