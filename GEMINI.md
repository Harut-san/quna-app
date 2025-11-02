
# Project Overview

This is a React Native mobile application built with Expo. It's a bilingual app that provides users with daily wisdom, conversation starters, mantras, and mindfulness prompts. The app uses Supabase for authentication and data storage.

The app has a tab-based navigation with three main tabs: "Home", "About", and "Settings". The "Home" screen displays a list of categories, and users can navigate to a dedicated screen for each category to view the content. The app also includes features like saving favorite quotes and adding new quotes.

# Building and Running

**Prerequisites:**

*   Node.js and npm installed
*   Expo CLI installed (`npm install -g expo-cli`)

**Running the app:**

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npx expo start
    ```

This will open the Expo developer tools in your browser. You can then run the app on a physical device using the Expo Go app or on a simulator (iOS or Android).

**Available Scripts:**

*   `npm start`: Starts the Expo development server.
*   `npm run android`: Starts the app on a connected Android device or emulator.
*   `npm run ios`: Starts the app on an iOS simulator.
*   `npm run web`: Runs the app in a web browser.
*   `npm run lint`: Lints the code using ESLint.

# Development Conventions

*   **File-based routing:** The app uses Expo's file-based routing system.
*   **Styling:** The app uses a combination of inline styles and StyleSheet objects for styling.
*   **State Management:** The app uses React's built-in state management (useState, useReducer) and context API for managing global state like authentication and language.
*   **Data Fetching:** The app uses the Supabase client library to interact with the Supabase backend.
*   **Internationalization:** The app supports English and Polish languages using a custom `LanguageContext`.
*   **Code Style:** The code follows the standard React Native and TypeScript conventions. ESLint is used for linting.
