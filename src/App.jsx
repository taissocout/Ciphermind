import { useState } from 'react'
import { Sidebar, Header }                    from './components/Layout'
import { CVEFeedTab }                         from './components/tabs/CVEFeed'
import { CISAKevTab }                         from './components/tabs/CISAKev'
import { AIAnalystTab }                       from './components/tabs/AIAnalyst'
import { ThreatIntelTab, ReportsTab }         from './components/tabs/ThreatIntel'
import { useCVEData }                         from './hooks/useCVEData'

export default function App() {
  const [activeTab, setActiveTab] = useState('cve')
  const { cves, kevData, kevIds, loading, error, lastUpdated, refresh } = useCVEData()

  const renderTab = () => {
    switch (activeTab) {
      case 'cve':     return <CVEFeedTab    cves={cves} kevIds={kevIds} loading={loading.cves} error={error.cves} onRefresh={refresh.cves} lastUpdated={lastUpdated} />
      case 'kev':     return <CISAKevTab    kevData={kevData} loading={loading.kev} error={error.kev} onRefresh={refresh.kev} />
      case 'analyst': return <AIAnalystTab  cves={cves} kevIds={kevIds} />
      case 'intel':   return <ThreatIntelTab kevIds={kevIds} />
      case 'reports': return <ReportsTab    cves={cves} kevData={kevData} kevIds={kevIds} />
      default:        return null
    }
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} lastUpdated={lastUpdated} kevTotal={kevData.total} />
        <main className="flex-1 overflow-hidden">{renderTab()}</main>
      </div>
    </div>
  )
}
