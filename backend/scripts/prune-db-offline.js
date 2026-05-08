/**
 * 离线精简 db.json（仅删除「历史快照」与「送货流水」中超过保留期的条目）。
 * 不删除、不修改 merchants（商家总数与资料不变）。
 *
 * 重要：运行前请先停止 Node 后端，避免与 server.js 同时写同一文件导致损坏。
 *
 * 用法（在 backend 目录下）：
 *   set SNAPSHOT_RETENTION_DAYS=400
 *   set DELIVERY_RETENTION_DAYS=90
 *   node scripts/prune-db-offline.js
 *
 * 与 server.js 一致：快照默认 400 天、送货流水默认 90 天（可用环境变量覆盖）。
 */
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

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

function getDeliveryRetentionDays() {
  const n = parseInt(
    process.env.DELIVERY_RETENTION_DAYS || process.env.DATA_RETENTION_DAYS || '90',
    10
  );
  if (Number.isNaN(n)) return 90;
  return Math.min(400, Math.max(30, n));
}

const dbPath = path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({
  merchants: [],
  deliveries: [],
  areas: [],
  snapshots: {},
}).write();

const snapDays = getSnapshotRetentionDays();
const delDays = getDeliveryRetentionDays();
const now = new Date();

const snapshots = db.get('snapshots').value() || {};
let snapRemoved = 0;
const prunedSnapshots = {};
Object.entries(snapshots).forEach(([dateKey, snapshot]) => {
  const snapshotDate = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(snapshotDate.getTime())) return;
  const ageDays = Math.floor((now - snapshotDate) / (1000 * 60 * 60 * 24));
  if (ageDays <= snapDays) {
    prunedSnapshots[dateKey] = snapshot;
  } else {
    snapRemoved++;
  }
});
db.set('snapshots', prunedSnapshots);

const deliveries = db.get('deliveries').value() || [];
const beforeDel = deliveries.length;
const kept = deliveries.filter((d) => {
  const t = d.createdAt || d.date;
  if (!t) return true;
  const dt = new Date(t);
  if (Number.isNaN(dt.getTime())) return true;
  const ageDays = Math.floor((now - dt) / (1000 * 60 * 60 * 24));
  return ageDays <= delDays;
});
db.set('deliveries', kept);

db.write();

console.log(
  `[prune-db-offline] 快照保留=${snapDays}天 删除日期 ${snapRemoved} 个 | 送货流水保留=${delDays}天 ${beforeDel} → ${kept.length}`
);
console.log('merchants 未改动。');
