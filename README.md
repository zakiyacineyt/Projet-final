<div align="center">

# ✨ Premium To-Do

### A modern, elegant task management application with a premium interface

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

Premium To-Do is a beautifully crafted task management application designed for productivity enthusiasts who appreciate clean design and smooth interactions. Built with vanilla JavaScript, it offers a premium experience without any framework dependencies.

## ✨ Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| 📝 **Task Creation** | Create tasks with title, category, priority, due date, and custom tags |
| 🎯 **Priority Management** | Organize tasks by High, Medium, or Low priority with visual indicators |
| 📁 **Categories** | Group tasks into Work, Personal, Wellbeing, or Finance categories |
| 🔍 **Smart Search** | Instantly filter tasks by title or tags with highlighted matches |
| 🔄 **Drag & Drop** | Reorder tasks effortlessly with intuitive drag and drop |
| 📊 **Statistics** | Track your progress with real-time stats and weekly charts |

### User Experience
| Feature | Description |
|---------|-------------|
| 🌙 **Dark Mode** | Deep matte black theme for comfortable night usage |
| ⚡ **Animations** | Professional micro-interactions and smooth transitions |
| 💾 **Auto-Save** | Automatic persistence with localStorage |
| ↩️ **Undo Delete** | Recover accidentally deleted tasks instantly |
| 📱 **Responsive** | Fully responsive design for all screen sizes |

## 🎮 Demo

### Light Mode
```
┌─────────────────────────────────────────────────────────────┐
│  Premium To-Do                              [Theme] [Light] │
├─────────────────────────────────────────────────────────────┤
│  Create Task    │    Today's Tasks     │    Insights       │
│  ─────────────  │    ─────────────     │    ─────────────  │
│  [Task name]    │    ☑ Task 1          │    Total: 5       │
│  [Category  ▼]  │    ☐ Task 2          │    Done:  3       │
│  [Priority]     │    ☐ Task 3          │    Streak: 7      │
│  [Add Task]     │                      │    [Chart]        │
└─────────────────────────────────────────────────────────────┘
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:--------:|--------|
| <kbd>Enter</kbd> | Add new task |
| <kbd>Delete</kbd> | Remove selected task |
| <kbd>Ctrl</kbd> + <kbd>Drag</kbd> | Duplicate task |

## 🚀 Installation

### Option 1: Clone Repository
```bash
# Clone the repository
git clone https://github.com/zakiyacineyt/Projet-final.git

# Navigate to project directory
cd Projet-final

# Open in browser
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

### Option 2: Download ZIP
1. Click the green **Code** button above
2. Select **Download ZIP**
3. Extract the archive
4. Open `index.html` in your browser

## 📂 Project Structure

```
Projet-final/
│
├── 📄 index.html      # Main HTML structure
├── 🎨 styles.css      # Styles, themes & animations
├── ⚙️ app.js          # Application logic
└── 📖 README.md       # Documentation
```

## 🎨 Customization

### Adding Custom Categories
Edit the `categories` array in `app.js`:
```javascript
let categories = ["Work", "Personal", "Wellbeing", "Finance", "Your Category"];
```

### Modifying Color Theme
Update CSS variables in `styles.css`:
```css
:root {
  --accent: #1f6feb;      /* Primary accent color */
  --success: #14b8a6;     /* Success/completion color */
  --high: #ff5f56;        /* High priority color */
  --medium: #f59e0b;      /* Medium priority color */
  --low: #3b82f6;         /* Low priority color */
}
```

## 🛠️ Technologies

<table>
  <tr>
    <td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" width="40"/><br/>HTML5</td>
    <td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" width="40"/><br/>CSS3</td>
    <td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40"/><br/>JavaScript</td>
  </tr>
</table>

### Technical Highlights
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Custom Properties** for theming
- **CSS Animations** with cubic-bezier easing
- **ES6+ JavaScript** with modern syntax
- **Web Storage API** for data persistence
- **Drag and Drop API** for task reordering

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas
- [ ] Add task subtasks
- [ ] Implement task reminders
- [ ] Add data export/import
- [ ] Create more themes
- [ ] Add i18n support

## 📝 Changelog

### v1.0.0 (2026)
- ✅ Initial release
- ✅ Task CRUD operations
- ✅ Drag and drop reordering
- ✅ Dark mode support
- ✅ Professional animations
- ✅ Responsive design

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 zakiyacineyt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/zakiyacineyt">
        <img src="https://github.com/zakiyacineyt.png" width="100px;" alt=""/><br />
        <sub><b>zakiyacineyt</b></sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ and ☕

</div>
