import { useState } from 'react'
import { Sidebar, Header } from './components/Layout'
import { CVEFeedTab } from './components/tabs/CVEFeed'
import { CISAKevTab } from './components/tabs/CISAKev'
import { AIAnalystTab } from './components/tabs/AIAnalyst'
import { ThreatIntelTab, ReportsTab } from './components/tabs/ThreatIntel'
import { ThreatMapTab } from './components/tabs/ThreatMap'
import { useCVEData } from './hooks/useCVEData'

export default function App() {
  const [activeTab, setActiveTab] = useState('cve')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cves, kevData, kevIds, loading, error, lastUpdated, refresh } = useCVEData()

  const renderTab = () => {
    switch (activeTab) {
      case 'cve': return <CVEFeedTab cves={cves} kevIds={kevIds} loading={loading.cves} error={error.cves} onRefresh={refresh.cves} lastUpdated={lastUpdated} onOpenMap={() => setActiveTab('map')} />
      case 'kev': return <CISAKevTab kevData={kevData} loading={loading.kev} error={error.kev} onRefresh={refresh.kev} />
      case 'analyst': return <AIAnalystTab cves={cves} kevIds={kevIds} />
      case 'intel': return <ThreatIntelTab kevIds={kevIds} />
      case 'map': return <ThreatMapTab />
      case 'reports': return <ReportsTab cves={cves} kevData={kevData} kevIds={kevIds} />
      default: return null
    }
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header activeTab={activeTab} lastUpdated={lastUpdated} kevTotal={kevData.total} onOpenMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-hidden">{renderTab()}</main>
      </div>
    </div>
  )
}
