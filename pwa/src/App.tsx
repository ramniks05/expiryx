import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/Toast'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter basename="/app">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/force-update" element={<ForceUpdatePage />} />
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
