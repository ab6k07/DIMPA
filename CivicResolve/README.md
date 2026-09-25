# CivicResolve 🏛️

**Smarter reporting. Faster resolution. Better cities.**

CivicResolve is a modern civic issue management platform connecting citizens, municipal authorities, and field officers for real-time reporting, automated classification, dispatching, and resolution tracking.

Originally delivered as a single-file artifact (`CivicResolve.html`), this project has been converted into a modular, maintainable React + Vite application with clean component architecture, CSS extraction, and a dedicated service layer.

---

## 📁 Directory Structure

```text
CivicResolve/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── Empty.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Timeline.jsx
│   │   │   └── Toast.jsx
│   │   ├── icons/
│   │   │   ├── Icon.jsx
│   │   │   └── paths.js
│   │   ├── incidents/
│   │   │   ├── IncidentDetail.jsx
│   │   │   ├── IncidentRow.jsx
│   │   │   └── IncidentTable.jsx
│   │   ├── layout/
│   │   │   └── Header.jsx
│   │   └── map/
│   │       ├── CityMap.jsx
│   │       └── MapLegend.jsx
│   ├── pages/
│   │   ├── citizen/
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── IncidentMapPage.jsx
│   │   │   ├── MyReports.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── ReportIssue.jsx
│   │   ├── authority/
│   │   │   ├── AuthorityAnalytics.jsx
│   │   │   ├── AuthorityIncidents.jsx
│   │   │   ├── AuthorityOverview.jsx
│   │   │   ├── AuthoritySettings.jsx
│   │   │   └── AuthorityTeams.jsx
│   │   └── officer/
│   │       └── OfficerTasks.jsx
│   ├── data/
│   │   ├── constants.js
│   │   └── mockData.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── index.css
│   │   └── theme.css
│   ├── utils/
│   │   └── formatters.js
│   └── assets/
│       └── logo.svg
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24)
- npm (v9 or higher)

### Installation
Navigate to the `CivicResolve` folder:
```bash
cd CivicResolve
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🎯 Features & Roles

### 1. Citizen Portal
- **Dashboard**: Quick metrics (active reports, in progress, resolved), recent reports, and interactive nearby map.
- **Report Issue**: 5-step guided wizard (Describe → Evidence → Location → Severity → Review) with drag-and-drop media upload and GPS/location picker.
- **My Reports**: Status-filtered list with progress timeline and detailed view.
- **AI Assistant**: Natural language bot that assists in drafting incident reports, tracking status by ID, and answering city service queries.
- **Incident Map**: Visual map with category/priority/status filters and heatmap mode.
- **Notifications**: Real-time status update alerts with "Mark all read".
- **Profile**: Citizen notification preferences and account info.

### 2. Authority Operations
- **Overview**: Operations dashboard with summary metrics, category/status/priority breakdown charts, and recent incidents table.
- **Incidents Management**: Advanced search, multi-filter, date range filter, and sorting.
- **Incident Detail & AI Assessment**: View AI confidence, priority scoring, duplicate risk, edit priority/status/department/officer, and log internal staff notes.
- **Teams & Workloads**: Real-time open vs. closed workload cards for departments and field officers.
- **Analytics**: Incident volume trends, resolution rates, SLA compliance metrics, and geographic heatmaps.
- **Settings**: AI auto-assignment and notification automation controls.

### 3. Field Officer
- **Mobile-optimized Task View**: Nearby tasks sorted with distance indicators.
- **Task Progression Flow**: Accept Task → Start Work → Upload Evidence → Mark Resolved.

---

## 🎨 Design System & Theming
- **Palette**: Slate/Navy civic theme with teal accents (`--navy: #0b2545`, `--acc: #0f766e`, `--accbg: #e6f4f2`).
- **Dark Mode**: Native dark mode toggle stored on `document.documentElement.dataset.theme`.
- **Typography**: IBM Plex Sans via Google Fonts.

---

## 🔌 API Service Layer
All mock data operations are centralized in `src/services/api.js`. The functions (`getIncidents`, `createIncident`, `updateIncident`, `assignDepartment`, etc.) return Promises and simulate network latency, making it seamless to swap in live FastAPI or REST endpoints without touching UI components.

---

## 🛡️ Backup
The original single-file artifact `CivicResolve.html` is kept untouched in the parent directory as a reference backup.
