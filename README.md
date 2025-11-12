# Task Management Tool with Gantt Chart

A modern task management application with interactive Gantt chart visualization, built with React, TypeScript, and Vite.

## Features

- **Interactive Gantt Chart**: Visualize tasks in a timeline with day/week/month views
- **Drag & Drop**: Move and resize tasks directly on the Gantt chart
- **Task Management**: Create, edit, and delete tasks with detailed information
- **Data Persistence**: Automatic saving to LocalStorage
- **Import/Export**: JSON-based data import and export functionality
- **Keyboard Shortcuts**: Efficient navigation and operations
- **Responsive Design**: Works on desktop and tablet devices
- **Accessibility**: Screen reader support with ARIA labels

## Tech Stack

- React 18 + TypeScript 5 + Vite
- Tailwind CSS + shadcn/ui
- @dnd-kit (Drag and drop)
- date-fns (Date manipulation)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

1. Build: `npm run build`
2. Deploy the `dist` directory via Netlify web interface or CLI

## Keyboard Shortcuts

- **Ctrl/Cmd + N**: Create new task
- **Escape**: Close modal or deselect task
- **Delete/Backspace**: Delete selected task
- **Arrow Up/Down**: Navigate between tasks

## Data Format

Tasks are stored in LocalStorage as JSON:

```typescript
interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  assignee?: string;
  progress: number;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Author

Created by 齊藤翔吾 (@shogosaitobsdaidd-lang)

Developed with assistance from Devin AI: https://app.devin.ai/sessions/65e0aeebeb714cddafcfb5e93cdfe8e6
