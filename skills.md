# Frontend Development Guidelines & Best Practices

This document outlines the core principles for maintaining a clean, scalable, and performant codebase.

---

## 1. Component Structure & Clean Code
* **Keep Components Small:** Break down complex components into smaller, reusable sub-components. Each file should focus on a single responsibility (Single Responsibility Principle).
* **Separate Logic from View:** Move business logic, data calculations, and state management into custom hooks. The component should primarily handle rendering.
* **Optimize Performance:** Use `useMemo` for heavy calculations to prevent unnecessary re-renders and maintain UI responsiveness.
* **Early Returns:** Avoid deep nesting of conditional operators. Use early returns to simplify the code structure and improve readability.

## 2. State Management (Zustand)
* **Modularize the Store:** Do not keep all state in one place. Divide your store into logical domains:
    * **Data Store:** For core business entities (e.g., habits, user data).
    * **UI/Global Store:** For UI states (e.g., loading, modals, theme).
    * **Domain-Specific Stores:** For complex modules (e.g., calendar navigation).
* **Keep Stores "Thin":** The store should only manage data state. Move heavy API calls and complex business logic to a separate Service layer.

## 3. Data Handling & API
* **Centralize Utilities:** Create a `utils/` folder for common tasks like date formatting, validation, or string manipulation to avoid repeating logic.
* **Strong Typing:** Always define types or interfaces for your data. Keep them in a dedicated `types/` folder to prevent duplication and ensure type safety.
* **API Standardization:** Use explicit types for API responses. Ensure error handling is consistent across the entire application by implementing a unified service layer.

## 4. Best Practices & Maintainability
* **Avoid Magic Values:** Never use hardcoded strings or numbers. Use constants or enums for status types, configuration keys, or recurring values.
* **Styling Consistency:** If using Tailwind CSS, avoid repeating long class strings. Group them into constants or create reusable base components to keep the markup clean.
* **File Organization:** Maintain a clear folder structure. Group related files logically to ensure the project remains easy to navigate as it grows.