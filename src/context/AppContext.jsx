import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FALLBACK_GROUPS, FALLBACK_VICTIMS, HOME_VICTIMS } from '../data/groups';
import { api } from '../api/ransomwareLive';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [groups, setGroups] = useState(FALLBACK_GROUPS);
  const [recentVictims, setRecentVictims] = useState(HOME_VICTIMS);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [prevFilters, setPrevFilters] = useState([]);
  const [currentSort, setCurrentSort] = useState('recent');
  const [soundTheme, setSoundTheme] = useState(
    () => localStorage.getItem('soundTheme') || 'digital'
  );
  const [currentGroup, setCurrentGroup] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      const data = await api.groups();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(g => ({
          id: g.name?.toLowerCase().replace(/\s+/g, '') || g.id || '',
          name: g.name || '',
          type: g.type || 'RaaS',
          subtype: g.subtype || 'Ransomware',
          victims: g.victims || 0,
          threat: g.meta?.score || g.threat || 50,
          status: (() => {
            const raw = (g.status || '').toLowerCase();
            if (raw === 'inactive' || raw === 'defunct' || raw === 'dismantled') return 'inactive';
            const score = g.meta?.score || g.threat || 0;
            if (score >= 90) return 'critical';
            return 'active';
          })(),
          sectors: g.sectors || ['💰','🏥'],
          targets: g.targets || ['Finance','Health'],
          lastSeen: g.meta?.last_activity || g.lastSeen || '',
          founded: g.meta?.year || g.founded || 2020,
          ransom: g.ransom || '—',
          onion: g.links?.leak_site || g.onion || '—',
          area: g.area || [],
          tools: g.tools || [],
          radarData: g.radarData || [0.5,0.5,0.5,0.5,0.5],
          attackData: g.attackData || [10,15,12,18,20,16,22,19,17,24,26,21],
        }));
        setGroups(mapped);
      }
    } catch {
      /* keep fallback */
    }
  }, []);

  const fetchRecent = useCallback(async () => {
    try {
      const data = await api.recent();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.slice(0, 4).map(v => ({
          ico: '🏢',
          name: v.victim || v.name || '—',
          meta: `${v.country || ''}  · ${v.activity || '—'}`,
          group: v.group_name || v.group || '—',
          groupId: (v.group_name || v.group) ? (v.group_name || v.group).toLowerCase().replace(/\s+/g,'') : null,
          date: v.published?.slice(5,10) || '—',
          desc: v.description || '詳細情報はransomware.liveで確認できます。',
          country: v.country || '',
          status: '公開済み',
          damage: 'データ窃取・暗号化',
          size: '—',
        }));
        setRecentVictims(mapped);
      }
    } catch {
      /* keep fallback */
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchRecent();
    const timer = setInterval(() => {
      fetchGroups();
      fetchRecent();
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchGroups, fetchRecent]);

  const changeSoundTheme = (theme) => {
    setSoundTheme(theme);
    localStorage.setItem('soundTheme', theme);
  };

  const execSearch = (filters) => {
    setPrevFilters(selectedFilters);
    setSelectedFilters(filters);
  };

  return (
    <AppContext.Provider value={{
      groups,
      recentVictims,
      selectedFilters,
      setSelectedFilters,
      prevFilters,
      setPrevFilters,
      currentSort,
      setCurrentSort,
      soundTheme,
      changeSoundTheme,
      currentGroup,
      setCurrentGroup,
      execSearch,
      FALLBACK_VICTIMS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
