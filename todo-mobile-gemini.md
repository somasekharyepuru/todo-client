### **Technical Specification: Todo-Client Mobile App (Expo & NativeWind)**

**Version:** 1.0
**Date:** July 5, 2025

### 1. Project Overview

The goal of this project is to create a cross-platform mobile application for the existing "Todo" service. The mobile app will replicate the core functionality of the Next.js web client, providing users with a seamless, native experience on iOS and Android.

The project will be built on the **Expo framework** to streamline development and deployment. Styling will be handled by **NativeWind**, allowing for the reuse of the existing Tailwind CSS design system and utility-first approach.

### 2. Core Technologies

*   **Framework:** Expo (latest SDK)
*   **Language:** TypeScript
*   **UI:** React Native
*   **Styling:** NativeWind v4
*   **Navigation:** Expo Router v3 (File-based)
*   **Data Fetching:** Apollo Client (or existing GraphQL client)
*   **State Management:** Redux Toolkit
*   **Form Handling:** React Hook Form
*   **Secure Storage:** Expo SecureStore (for auth tokens)

### 3. Project Architecture & File Structure

The mobile app's structure will closely mirror the web application's logical separation of concerns to ensure a smooth transition and maintainability.

```
/todo-mobile-app/
├── app/                  # Expo Router for screen-based routing
│   ├── (tabs)/           # Main authenticated app layout
│   │   ├── _layout.tsx   # Tab navigator (Today, Upcoming, All, Projects)
│   │   ├── today.tsx
│   │   ├── upcoming.tsx
│   │   ├── all.tsx
│   │   └── projects.tsx
│   ├── projects/
│   │   └── [id].tsx      # Dynamic route for a single project view
│   ├── login.tsx         # Login screen
│   ├── register.tsx      # Registration screen
│   ├── _layout.tsx       # Root layout (handles auth state, providers)
│   └── index.tsx         # Entry point, redirects based on auth status
├── api/                  # Reusable GraphQL logic
│   ├── documents/        # (Copy from web) .gql files for queries/mutations
│   └── hooks/            # (Copy from web) Generated GraphQL hooks
├── assets/               # Static assets
│   ├── images/
│   └── fonts/
├── components/           # Reusable UI components
│   ├── auth/             # Auth-related components (forms)
│   ├── projects/         # Project-specific components (lists, forms)
│   ├── tasks/            # Task-specific components (cards, forms)
│   └── ui/               # Base UI library (Button, Card, Input, etc.)
├── lib/                  # Utility and helper functions
│   └── utils/            # (Copy from web) General utility functions
├── navigation/           # Custom navigation components/hooks if needed
├── store/                # Redux Toolkit store and slices
│   ├── session-slice.ts  # (Copy from web)
│   └── store.ts          # (Copy from web, configured for mobile)
├── tailwind.config.js    # NativeWind configuration
└── package.json
```

### 4. Component Porting Strategy

The core of the work involves translating the Next.js/React components (using HTML tags) into React Native components.

#### 4.1. Base UI Library (`components/ui`)

This is the highest priority. The components from `components/lib` in the web app must be recreated as native components. NativeWind will handle the styling translation.

**Mapping:**

| Web (`.tsx`)                               | Native (`components/ui`)                                                              |
| :----------------------------------------- | :------------------------------------------------------------------------------------ |
| `div`, `section`, `header`, `footer`       | `<View>`                                                                              |
| `p`, `span`, `h1`, `label`                 | `<Text>`                                                                              |
| `button`                                   | `<TouchableOpacity>` or `<Pressable>`                                                 |
| `input`, `textarea`                        | `<TextInput>`                                                                         |
| `img`                                      | `<Image>` from `expo-image`                                                           |
| `a` (internal)                             | `<Link>` from `expo-router`                                                           |
| `ul`, `li`                                 | `<FlatList>` or `<ScrollView>` with `<View>` and `<Text>` components                  |
| `form`                                     | `<View>` (logic handled by React Hook Form)                                           |
| **Styling**                                | **`className` props via NativeWind (reusing existing Tailwind classes)**              |
| **Icons** (`utils/icons`)                  | Recreate using `react-native-svg` or an icon library like `expo-vector-icons`.        |

#### 4.2. Feature Components (`components/auth`, `components/projects`, etc.)

Once the base UI library is ready, these components can be ported. The business logic (hooks, state updates) inside them will remain largely the same. The primary task is to replace the JSX with the newly created native UI components.

*   **Example (`project-form.tsx`):** The logic for `useForm`, `onSubmit`, and the GraphQL mutation hook can be copied directly. The `<form>`, `<input>`, and `<button>` tags will be replaced with `<View>`, `<TextInput>`, and `<Button>` from `components/ui`.

### 5. Screen and Navigation (`app/` directory)

Expo Router will manage navigation. The structure of the `pages/` directory from the web app provides a clear blueprint.

*   **Public Routes:** `app/login.tsx`, `app/register.tsx`.
*   **Protected Routes:** A `(tabs)` group will be used for the main application interface, accessible only after login. A root `_layout.tsx` will check for an authentication token and redirect users accordingly.
*   **Tab Navigation:** The `app/(tabs)/_layout.tsx` file will define a `Tabs` navigator from Expo Router, creating the main bottom tab bar for "Today," "Upcoming," "All," and "Projects."
*   **Stack Navigation:** Navigating from the "Projects" list to a specific project (`app/projects/[id].tsx`) will automatically be handled as a stack navigation push.

### 6. Data and State Management

This part of the application can be ported with minimal changes.

*   **GraphQL (`api/`):**
    1.  Copy the entire `api/` directory.
    2.  The GraphQL client (e.g., Apollo Client) will need to be instantiated for the React Native environment.
    3.  The client must be configured to pull the authentication token from **Expo SecureStore** and attach it to the headers of every authenticated request.
*   **Redux (`store/`):**
    1.  Copy the existing Redux slices (`session-slice.ts`) and store configuration.
    2.  The Redux `Provider` will wrap the application at the root, likely in `app/_layout.tsx`.
    3.  The logic within the slices is pure TypeScript and requires no changes.

### 7. Authentication Flow

1.  **UI:** Build the login and registration forms in `app/login.tsx` and `app/register.tsx` using the new native UI components.
2.  **API Call:** On form submission, call the existing GraphQL `useLogin` / `useRegister` hooks.
3.  **Token Storage:** Upon successful authentication, store the received JWT securely using `Expo.SecureStore.setItemAsync('authToken', token)`.
4.  **State Update:** Dispatch the action to update the Redux `session` state with user details.
5.  **Redirect:** Use the Expo router to programmatically navigate the user to the main app screen (e.g., `router.replace('/today')`).
6.  **Logout:** On logout, remove the token from SecureStore, clear the Redux session state, and redirect to the login screen.

### 8. API Integration Specification

This section details how the mobile application will interact with the backend GraphQL API.

#### 8.1. GraphQL Client Setup (Apollo Client)

While the web app uses RTK Query, using **Apollo Client** is recommended for the mobile app due to its robust community support and features like built-in caching and React Native hooks.

1.  **Initialization:** The Apollo Client will be initialized in a central file (e.g., `api/client.ts`).
2.  **GraphQL Endpoint:** The client must be configured to connect to the production GraphQL endpoint. This should be stored in an environment variable.
    *   **URL:** `process.env.EXPO_PUBLIC_GRAPHQL_API_URL`
3.  **Authentication Link:** An Apollo Link middleware must be created to handle authentication. On every request, this link will:
    *   Read the `accessToken` from `Expo.SecureStore`.
    *   If a token exists, attach it to the request headers:
        `Authorization: Bearer <accessToken>`

#### 8.2. Authentication & Token Management

The existing `graphql-api-base.ts` contains the logic for automatic token refresh. This logic must be ported to the Apollo Client setup.

1.  **Error Link:** An Apollo Error Link will inspect every GraphQL response. If a `401 Unauthorized` error is detected, it will trigger the token refresh mechanism.
2.  **Refresh Mutation:** The link will call the `refreshToken` mutation, sending the `refreshToken` currently stored in `Expo.SecureStore`.
3.  **Update Tokens:** Upon a successful response, the new `accessToken` and `refreshToken` will be saved back into `Expo.SecureStore`.
4.  **Retry Request:** The original failed request will be retried with the new `accessToken`.
5.  **Logout on Failure:** If the `refreshToken` mutation fails, the user will be logged out. This involves clearing SecureStore, resetting the Redux state, and navigating to the `login` screen.

#### 8.3. GraphQL Operations Summary

The following queries and mutations are available. The mobile app will reuse the `.gql` files from the web project and generate native hooks using the Apollo Client codegen.

**Authentication (`auth.gql`)**

*   `mutation Login($user: LoginDto!)`: Authenticates a user and returns session data including tokens.
*   `mutation Logout`: Clears the user's session on the server.
*   `mutation Register($user: RegisterUserDto!)`: Creates a new user account.
*   `mutation ResendOtp($email: String!)`: Resends a one-time password for verification.
*   `mutation VerifyOtp($input: VerifyOtpDTO!)`: Verifies a one-time password.
*   `mutation FinishSignUp($user: UpdateProfileDto!)`: Completes the user profile after registration.
*   `mutation ForgotPassword($email: String!)`: Initiates the password reset process.
*   `mutation ResetPassword($input: ResetPasswordDto!)`: Sets a new password.
*   `query Me`: Fetches the profile of the currently authenticated user.

**Projects (`projects.gql`)**

*   `query GetProjects`: Fetches a list of all projects for the user.
*   `query GetProjectById($id: String!)`: Fetches a single project by its ID.
*   `mutation CreateProject($project: CreateProjectDto!)`: Creates a new project.
*   `mutation UpdateProject($project: UpdateProjectDto!)`: Updates an existing project.
*   `mutation DeleteProject($id: String!)`: Deletes a project.

**Tasks (`tasks.gql`)**

*   `query GetTasks($input: GetTaskInput!)`: Fetches tasks based on filters (e.g., `today`, `upcoming`, `project_id`).
*   `query GetTaskById($id: String!)`: Fetches a single task by its ID.
*   `mutation CreateTask($task: CreateTaskDto!)`: Creates a new task.
*   `mutation UpdateTask($task: UpdateTaskDto!)`: Updates an existing task.
*   `mutation DeleteTask($id: String!)`: Deletes a task.
*   `query Priorities`: Fetches the available task priority levels.

### 9. Full GraphQL Schema Definition

This schema provides the complete data structure and available operations from the backend API. Use this as the source of truth for creating types and queries.

```graphql
# ---------------------------------------
# Scalars and Enums
# ---------------------------------------

scalar DateTime

enum Priority {
  LOW
  MEDIUM
  HIGH
}

# ---------------------------------------
# Core Types
# ---------------------------------------

type User {
  id: ID!
  first_name: String!
  last_name: String!
  email: String!
  phone: String
  is_active: Boolean!
  is_verified: Boolean!
  is_profile_updated: Boolean!
  role: Role!
  avatarUrl: String
  created_at: DateTime!
  updated_at: DateTime!
}

type Role {
  id: ID!
  name: String!
  code: String!
  description: String
}

type Project {
  id: ID!
  name: String!
  description: String
  tasks: [Task!]
}

type Task {
  id: ID!
  title: String!
  description: String
  due_date: DateTime
  priority: Priority!
  is_completed: Boolean!
  is_deleted: Boolean!
  project: Project
  created_at: DateTime!
  updated_at: DateTime!
}

type PriorityType {
  id: ID!
  name: String!
}

# ---------------------------------------
# Response Types
# ---------------------------------------

type AuthPayload {
  id: ID!
  accessToken: String!
  refreshToken: String!
  first_name: String!
  last_name: String!
  email: String!
  phone: String
  is_active: Boolean!
  is_verified: Boolean!
  is_profile_updated: Boolean!
  role: Role!
  created_at: DateTime!
  updated_at: DateTime!
  expires_at: Float!
}

type RefreshTokenPayload {
  accessToken: String!
  refreshToken: String!
}

type RegisterPayload {
  message: String!
  success: Boolean!
  is_verified: Boolean!
  is_profile_updated: Boolean!
  accessToken: String
  refreshToken: String
}

type VerifyOtpPayload {
  success: Boolean!
  message: String!
  token: String
  expires_at: Float
}

type FinishSignUpPayload {
  id: ID!
  first_name: String!
  last_name: String!
  email: String!
  phone: String
  is_active: Boolean!
  is_verified: Boolean!
  is_profile_updated: Boolean!
  role: Role!
  created_at: DateTime!
  updated_at: DateTime!
  accessToken: String!
  refreshToken: String!
}

type GenericMessage {
  success: Boolean!
  message: String!
}

# ---------------------------------------
# Input DTOs (Data Transfer Objects)
# ---------------------------------------

input LoginDto {
  email: String!
  pass: String!
}

input RegisterUserDto {
  email: String!
  pass: String!
}

input VerifyOtpDTO {
  email: String!
  otp: String!
}

input UpdateProfileDto {
  first_name: String!
  last_name: String!
  phone: String
}

input ResetPasswordDto {
  token: String!
  pass: String!
}

input CreateProjectDto {
  name: String!
  description: String
}

input UpdateProjectDto {
  id: ID!
  name: String
  description: String
}

input CreateTaskDto {
  title: String!
  description: String
  due_date: DateTime
  priority: Priority
  project_id: ID
}

input UpdateTaskDto {
  id: ID!
  title: String
  description: String
  due_date: DateTime
  priority: Priority
  is_completed: Boolean
  project_id: ID
}

input GetTaskInput {
  filter: String! # e.g., "today", "upcoming", "all"
  project_id: ID
}

# ---------------------------------------
# Root Query and Mutation
# ---------------------------------------

type Query {
  # User
  me: User

  # Projects
  getProjects: [Project!]
  getProjectById(id: String!): Project

  # Tasks
  getTasks(input: GetTaskInput!): [Task!]
  getTaskById(id: String!): Task
  priorities: [PriorityType!]
}

type Mutation {
  # Auth
  login(user: LoginDto!): AuthPayload!
  logout: GenericMessage!
  register(user: RegisterUserDto!): RegisterPayload!
  resendOtp(email: String!): GenericMessage!
  verifyOtp(input: VerifyOtpDTO!): VerifyOtpPayload!
  finishSignUp(user: UpdateProfileDto!): FinishSignUpPayload!
  forgotPassword(email: String!): GenericMessage!
  resetPassword(input: ResetPasswordDto!): GenericMessage!
  refreshToken(refresh: String!): RefreshTokenPayload!

  # Projects
  createProject(project: CreateProjectDto!): Project!
  updateProject(project: UpdateProjectDto!): Project!
  deleteProject(id: String!): GenericMessage!

  # Tasks
  createTask(task: CreateTaskDto!): Task!
  updateTask(task: UpdateTaskDto!): Task!
  deleteTask(id: String!): GenericMessage!
}

```

### 10. Production-Grade Enhancements

To elevate the application from a prototype to a production-ready product, the following considerations are crucial.

#### 10.1. Error Handling & Reporting

*   **Global Error Boundary:** Implement a root-level React Error Boundary to catch rendering errors in the component tree. This component should display a user-friendly fallback screen and log the error to a reporting service.
*   **API Error Toasts:** For failed GraphQL mutations (e.g., creating a task), display a non-intrusive toast or notification to the user with a clear message (e.g., "Failed to create task. Please try again."). Avoid using disruptive alerts.
*   **Crashlytics:** Integrate a remote logging and crash reporting service like **Sentry**, **Datadog**, or **Firebase Crashlytics**. This is essential for monitoring application health, tracking bugs in production, and understanding the user impact of errors.

#### 10.2. Offline Support & Caching

Users expect mobile apps to function with intermittent connectivity. A robust offline strategy is non-negotiable.

*   **Apollo Client Cache:** Configure the `InMemoryCache` as the primary layer of caching. For `get` queries, use a `cache-first` or `cache-and-network` fetch policy to immediately show cached data while fetching fresh data in the background.
*   **Offline Persistence:** Use **`@apollo/client/storage`** with **`AsyncStorage`** to persist the Apollo Client cache to the device's storage. This ensures that previously fetched data is available on subsequent app loads, even without a network connection.
*   **Optimistic UI:** For mutations (create, update, delete), implement optimistic responses. When a user performs an action, update the UI *immediately* as if the server call was successful. If the server call fails, roll back the change and notify the user. This creates a fast, responsive user experience.
*   **Mutation Queue:** For a more advanced implementation, consider a library like **`@apollo/client/link/retry`** or a custom link to queue mutations that fail due to network errors. Once connectivity is restored, the queued mutations can be retried automatically.

#### 10.3. State Management & Performance

*   **Redux Persist:** While `session-slice` is a good start, consider using **`redux-persist`** to save the entire Redux store (or specific slices) to `AsyncStorage`. This can help restore the app's state across sessions, but be selective about what you persist to avoid storing large, unnecessary data.
*   **Selector Memoization:** Use **`reselect`** or the built-in memoization in `createSelector` from Redux Toolkit to prevent unnecessary re-renders when deriving data from the Redux store.
*   **UI Performance:**
    *   Use `React.memo` for list items and other components that re-render frequently with the same props.
    *   Leverage `useCallback` for functions passed as props to memoized child components.
    *   For long lists, use **`FlashList`** from Shopify instead of `FlatList` for significantly better performance and memory usage.

#### 10.4. Build & Deployment (CI/CD)

*   **Environment Variables:** Use a library like **`react-native-config`** or Expo's built-in system to manage environment-specific variables (e.g., API endpoints for `development`, `staging`, `production`). Do not hardcode them.
*   **EAS Build:** Use **Expo Application Services (EAS)** to build and sign the application for both iOS and Android. EAS simplifies the process of creating production-ready binaries.
*   **Automated Deployments:** Set up a CI/CD pipeline using services like **GitHub Actions**, **GitLab CI**, or **Bitrise**. The pipeline should automatically:
    1.  Install dependencies.
    2.  Run the linter and unit tests.
    3.  Trigger an EAS build.
    4.  (Optional) Submit the build to TestFlight (iOS) or Google Play Console (Android) for internal testing or production release.

#### 10.5. Security

*   **Certificate Pinning:** To prevent man-in-the-middle (MITM) attacks, implement SSL/TLS certificate pinning to ensure the app communicates only with the authentic backend server.
*   **Data Encryption:** While `Expo.SecureStore` is encrypted, be mindful of any sensitive data stored outside of it (e.g., in `AsyncStorage` or Redux Persist) and consider encrypting it if necessary.

### 11. Step-by-Step Implementation Plan

1.  **Initialize Project:** Run `npx create-expo-app -t tabs` to create a new Expo project with TypeScript and Expo Router.
2.  **Install Dependencies:** Add `nativewind`, `tailwindcss`, `@reduxjs/toolkit`, `react-redux`, `@apollo/client`, `graphql`, `react-hook-form`, `react-native-svg`.
3.  **Configure NativeWind:** Follow the NativeWind v4 setup instructions for Expo. Copy the theme and content configuration from the web app's `tailwind.config.ts`.
4.  **Port Core Logic:** Copy the `api/`, `redux/` (to `store/`), and `utils/` (to `lib/utils`) directories into the new project.
5.  **Build Base UI Library:** Create the `components/ui` directory and implement the native versions of all base components (`Button`, `Card`, `Input`, etc.).
6.  **Implement Auth:** Build the login/register screens and implement the full authentication flow with SecureStore and Redux.
7.  **Build Main Layout:** Configure the `(tabs)` layout with the bottom tab bar.
8.  **Port Feature Components & Screens:** Systematically work through each feature (Projects, Tasks), porting the components and assembling them into the screens defined in the `app/` directory.
9.  **Handle Assets:** Move all images from `public/` to `assets/images/` and update references.
10. **Test & Refine:** Thoroughly test on both iOS and Android simulators, refining styles and interactions for a native feel.
