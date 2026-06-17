import { useState, useEffect, useMemo } from 'react'
import InvestorTable from './components/InvestorTable'
import StartupTable from './components/StartupTable'
import GrantTable from './components/GrantTable'
import Stats from './components/Stats'
import './App.css'

const TABS = ['Investors', 'Startups', 'Grants']

export default function App() {
  const [tab, setTab] = useState('Investors')
  const [investors, setInvestors] = useState([])
  const [startups, setStartups] = useState([])
  const [grants, setGrants] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/investors.json').then(r => r.json()),
      fetch('/data/startups.json').then(r => r.json()),
      fetch('/data/grants.json').then(r => r.json()),
      fetch('/data/stats.json').then(r => r.json()),
    ]).then(([inv, start, gr, st]) => {
      setInvestors(inv)
      setStartups(start)
      setGrants(gr)
      setStats(st)
      setLoading(false)
    })
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Investor Explorer</span>
          </div>
          <p className="header-sub">VCs · Angels · Grants · Accelerators</p>
        </div>
      </header>

      {stats && <Stats stats={stats} />}

      <main className="main">
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={'tab' + (tab === t ? ' active' : '')}
              onClick={() => setTab(t)}
            >
              {t}
              <span className="tab-count">
                {t === 'Investors' ? stats?.investors?.toLocaleString()
                  : t === 'Startups' ? stats?.startups?.toLocaleString()
                  : stats?.grants?.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading data…</div>
        ) : (
          <div className="table-wrap">
            {tab === 'Investors' && <InvestorTable data={investors} />}
            {tab === 'Startups' && <StartupTable data={startups} />}
            {tab === 'Grants' && <GrantTable data={grants} />}
          </div>
        )}
      </main>

      <footer className="footer">
        Data sourced from YC, Wikipedia, GitHub, HN, Grants.gov, OpenAlex
      </footer>
    </div>
  )
}
