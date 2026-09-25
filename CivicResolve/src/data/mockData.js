import { CATS, SI } from './constants.js';

export const getNowTime = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export const makeIncident = (a) => {
  const [id, title, cat, loc, x, y, pri, status, officer, date, mine, score, conf, dup] = a;
  const dept = CATS[cat][0];
  const hist = [
    ['10:42 AM', 'Incident submitted'],
    ['10:44 AM', 'Automatically classified as ' + cat],
    ['10:45 AM', 'Priority calculated: ' + pri],
  ];

  if (SI[status] > 2) {
    hist.push(
      ['10:46 AM', 'Assigned to ' + dept + ' Department'],
      ['11:20 AM', 'Field officer assigned: ' + officer]
    );
  }
  if (SI[status] > 4) {
    hist.push(['01:05 PM', 'Work in progress']);
  }
  if (SI[status] > 5) {
    hist.push(['04:30 PM', 'Marked resolved']);
  }

  return {
    id,
    title,
    cat,
    loc,
    x,
    y,
    pri,
    status,
    officer: SI[status] > 2 ? officer : '',
    dept,
    date,
    mine,
    score,
    conf,
    dup,
    notes: [],
    hist,
    desc:
      title +
      '. Reported by a resident; affects daily commute and public safety. Requires on-site inspection.',
  };
};

export const initialIncidentsRaw = [
  ['INC-1042', 'Large pothole on Main Road', 'Road Damage', 'BTM Layout, Bengaluru', 34, 22, 'High', 'In Progress', 'Rahul Verma', '2026-09-22', 1, 82, 94, 18],
  ['INC-1043', 'Garbage accumulation near market', 'Waste', 'Koramangala 5th Block', 58, 30, 'Medium', 'Assigned', 'Priya Nair', '2026-09-21', 1, 55, 91, 12],
  ['INC-1044', 'Broken streetlight on 80 Feet Road', 'Streetlight', 'Indiranagar', 70, 14, 'Medium', 'Pending', '', '2026-09-23', 1, 48, 88, 31],
  ['INC-1045', 'Water leakage from main pipeline', 'Water', 'HSR Layout Sector 2', 46, 44, 'High', 'Assigned', 'Imran Sheikh', '2026-09-20', 1, 76, 93, 9],
  ['INC-1046', 'Blocked drainage outside apartment', 'Drainage', 'Electronic City Phase 1', 80, 50, 'High', 'Resolved', 'Anita Rao', '2026-09-15', 1, 71, 90, 22],
  ['INC-1047', 'Waterlogging on service road', 'Flooding', 'Silk Board Junction', 52, 52, 'Critical', 'In Progress', 'Rahul Verma', '2026-09-23', 0, 94, 96, 41],
  ['INC-1048', 'Road surface cracked near school', 'Road Damage', 'Jayanagar 4th Block', 22, 40, 'Low', 'Pending', '', '2026-09-24', 0, 30, 85, 6],
  ['INC-1049', 'Overflowing bins at bus stop', 'Waste', 'Whitefield Main Road', 90, 20, 'Medium', 'Closed', 'Priya Nair', '2026-09-10', 0, 50, 89, 15],
];

export const initialNotifications = [
  {
    id: 1,
    t: 'Incident INC-1042 has been assigned to Roads Department.',
    time: '2 h ago',
    read: false,
  },
  {
    id: 2,
    t: 'Field Officer Rahul has started working on INC-1042.',
    time: '1 h ago',
    read: false,
  },
  {
    id: 3,
    t: 'Your incident INC-1046 has been resolved.',
    time: 'Yesterday',
    read: true,
  },
];
