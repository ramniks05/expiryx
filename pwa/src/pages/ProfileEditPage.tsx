import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { updateProfile } from '../api/auth'
import { ApiError } from '../api/client'
import { useToast } from '../components/Toast'
import { useAuthStore } from '../store/authStore'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const session = useAuthStore((s) => s.session)
  const updateProfileStore = useAuthStore((s) => s.updateProfile)

  const [name, setName] = useState(session?.name ?? '')
  const [email, setEmail] = useState(session?.email ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!session) return
    setSaving(true)
    try {
      await updateProfile(session.id, name, email)
      updateProfileStore({ name, email })
      showToast('Profile updated', 'success')
      navigate(-1)
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page">
      <button type="button" onClick={() => navigate(-1)} className="btn-text mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="app-title">Edit profile</h1>

      <div className="app-card mt-5 space-y-4 p-4">
        <div>
          <label className="app-label">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="app-input mt-1" />
        </div>
        <div>
          <label className="app-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="app-input mt-1" />
        </div>
        <div>
          <label className="app-label">Mobile</label>
          <input
            disabled
            value={`+91 ${session?.mobileNumber ?? ''}`}
            className="app-input mt-1 opacity-70"
            style={{ background: 'var(--color-background-elevated)' }}
          />
        </div>
      </div>

      <button type="button" disabled={saving} onClick={handleSave} className="btn-filled mt-4">
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  )
}
