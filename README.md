# TodoApp - React Native To-Do List Application

A simple and clean To-Do List mobile application built with React Native (Expo) for the Introduction to Mobile Application Development course at Altinbas University.

## Features

- Add tasks with title, description, category, and priority
- Set optional due dates for tasks
- Mark tasks as completed or active
- Filter tasks by status: All, Active, Completed
- Delete tasks with confirmation
- View detailed task information on a separate screen
- Persistent local storage with AsyncStorage (tasks are saved even after closing the app)

## Screens

- **Home Screen** - Lists all tasks with filter tabs and progress summary
- **Add Task Screen** - Form to create a new task
- **Task Detail Screen** - View task details, mark complete, or delete

## Tech Stack

- React Native (Expo)
- React Navigation (Native Stack)
- AsyncStorage (local data persistence)

## Setup & Run

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with Expo Go app on your Android or iOS device.

## Project Structure
TodoApp2/
├── App.js                        # Navigation setup
├── src/
│   ├── storage.js                # AsyncStorage helpers
│   └── screens/
│       ├── HomeScreen.js         # Task list with filters
│       ├── AddTaskScreen.js      # Add new task form
│       └── TaskDetailScreen.js   # Task detail and actions
└── package.json
## Course Info

- **University:** Altinbas University
- **Department:** Software Engineering
- **Course:** Introduction to Mobile Application Development
- **Instructor:** F. Kuzey Edes Huyal
- **Due Date:** April 29, 2026