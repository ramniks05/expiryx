import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/Toast'
import { AddToHomeScreenPrompt } from './components/AddToHomeScreenPrompt'
import { SplashPage } from './pages/SplashPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { AddDocumentPage } from './pages/AddDocumentPage'
import { DocumentDetailPage } from './pages/DocumentDetailPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { AlertsPage } from './pages/AlertsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { ForceUpdatePage } from './pages/ForceUpdatePage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage'
import { AdminGrowthPage } from './pages/admin/AdminGrowthPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage'
import { AdminShell } from './components/admin/AdminShell'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AddToHomeScreenPrompt />
        <BrowserRouter basename="/app">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/force-update" element={<ForceUpdatePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminShell />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="documents" element={<AdminDocumentsPage />} />
                <Route path="growth" element={<AdminGrowthPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:id" element={<AdminUserDetailPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="documents/add" element={<AddDocumentPage />} />
                <Route path="documents/:id" element={<DocumentDetailPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile/edit" element={<ProfileEditPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}
