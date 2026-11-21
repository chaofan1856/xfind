/** 样本日是固定的。接上真实数据后，改这里或让接口返回同一形状。 */
export const boardMeta = {
  timezone: 'Asia/Shanghai',
  cutoff: '08:00',
  sampleDay: '2026-11-21',
  windowLabel: '11月20日 08:00 — 11月21日 08:00',
  weekLabel: '11月15日 — 11月21日',
  weekDates: ['11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21'],
  editionYear: '二〇二六',
  editionDay: '21',
  editionMonth: '十一月',
  editionName: '晨间版',
} as const
