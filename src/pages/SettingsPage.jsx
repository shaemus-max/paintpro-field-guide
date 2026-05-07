import { useRef } from 'react'

export default function SettingsPage({ totalOverrideCount, exportData, importData, clearAllOverrides, editMode }) {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paintpro-overrides-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const ok = importData(ev.target.result)
      alert(ok ? 'Data imported successfully!' : 'Import failed — file must be a valid JSON export from this app')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (window.confirm(`Clear all ${totalOverrideCount} product override${totalOverrideCount !== 1 ? 's' : ''}? This cannot be undone.`)) {
      clearAllOverrides()
    }
  }

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-6 max-w-2xl">
        <h1 className="font-serif text-2xl text-gray-900 mb-6">Settings</h1>

        {/* Edit mode info */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">Admin Edit Mode</h2>
          <p className="text-sm text-gray-500">
            Triple-click the PaintPro logo in the header to reveal the edit toggle.
            When active, pencil icons appear next to editable fields on product pages.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              editMode ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {editMode ? '🔓 Edit Mode: ON' : '🔒 Edit Mode: OFF'}
            </span>
          </div>
        </div>

        {/* Override status */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">Override Status</h2>
          <p className="text-sm text-gray-500">
            {totalOverrideCount === 0
              ? 'No product overrides saved. All data comes from the built-in product database.'
              : `${totalOverrideCount} product${totalOverrideCount !== 1 ? 's' : ''} have custom data overrides stored locally.`
            }
          </p>
        </div>

        {/* Export */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">Export My Data</h2>
          <p className="text-sm text-gray-500 mb-3">
            Download all your product edits and pricing as a JSON backup. Use this to transfer your data to another device.
          </p>
          <button
            onClick={handleExport}
            disabled={totalOverrideCount === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ↓ Download Backup
          </button>
        </div>

        {/* Import */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-1">Import Data</h2>
          <p className="text-sm text-gray-500 mb-3">
            Restore overrides from a previously exported JSON file. All existing overrides will be replaced.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
            ↑ Upload JSON File
          </button>
        </div>

        {/* Danger zone */}
        {totalOverrideCount > 0 && (
          <div className="card p-5 border border-red-200">
            <h2 className="font-semibold text-red-700 mb-1">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-3">
              Permanently delete all product overrides and revert to the built-in data. This cannot be undone.
            </p>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
            >
              🗑 Clear All Overrides
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
