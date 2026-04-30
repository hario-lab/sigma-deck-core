export const FALLBACK_GROUPS = [
  {id:'lockbit', name:'LockBit 3.0', type:'RaaS', subtype:'Double Extortion', victims:1743, threat:97, status:'critical', sectors:['💰','🏥','🏛','🏭'], targets:['Finance','Health','Gov','Mfg'], lastSeen:'Apr 28 2026', founded:2019, ransom:'$91M+', onion:'lockbit3753ng...onion', area:['🇺🇸 US','🇬🇧 UK','🇩🇪 DE','🇫🇷 FR','🇯🇵 JP'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🔑',n:'Mimikatz',c:'Credential'},{ico:'📡',n:'PsExec',c:'Lateral Mvmt'},{ico:'📤',n:'Rclone',c:'Exfiltration'},{ico:'🖥',n:'AnyDesk',c:'Remote Access'},{ico:'🦠',n:'StealBit',c:'Custom Malware'}], radarData:[0.95,0.88,0.92,0.97,0.75], attackData:[42,67,55,89,103,78,134,121,98,145,167,112]},
  {id:'blackcat', name:'BlackCat', type:'RaaS', subtype:'Triple Extortion', victims:528, threat:88, status:'active', sectors:['💰','🏭','🏛'], targets:['Finance','Mfg','Gov'], lastSeen:'Apr 25 2026', founded:2021, ransom:'$40M+', onion:'alphvmmm...onion', area:['🇺🇸 US','🇩🇪 DE','🇦🇺 AU'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🔑',n:'Mimikatz',c:'Credential'},{ico:'📤',n:'ExMatter',c:'Exfiltration'},{ico:'⚙️',n:'ALPHV Encryptor',c:'Custom Malware'}], radarData:[0.88,0.82,0.90,0.85,0.80], attackData:[28,45,38,62,78,55,92,88,72,98,110,85]},
  {id:'akira', name:'Akira', type:'RaaS', subtype:'Double Extortion', victims:389, threat:82, status:'critical', sectors:['🏭','🏥','🎓'], targets:['Mfg','Health','Edu'], lastSeen:'Apr 27 2026', founded:2023, ransom:'$25M+', onion:'akiral7nnlwzld...onion', area:['🇺🇸 US','🇨🇦 CA','🇬🇧 UK'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🔑',n:'LaZagne',c:'Credential'},{ico:'📡',n:'AnyDesk',c:'Remote Access'},{ico:'📤',n:'WinSCP',c:'Exfiltration'}], radarData:[0.82,0.78,0.80,0.88,0.70], attackData:[18,32,28,45,58,42,72,65,55,80,92,68]},
  {id:'ransomhub', name:'RansomHub', type:'RaaS', subtype:'Data Extortion', victims:287, threat:76, status:'critical', sectors:['💰','🏛','⚡'], targets:['Finance','Gov','Energy'], lastSeen:'Apr 26 2026', founded:2024, ransom:'$18M+', onion:'ransomhubxxx...onion', area:['🇺🇸 US','🇫🇷 FR','🇧🇷 BR'], tools:[{ico:'🎯',n:'Metasploit',c:'C2 Framework'},{ico:'🔑',n:'Mimikatz',c:'Credential'},{ico:'📤',n:'Rclone',c:'Exfiltration'},{ico:'🔧',n:'NLBrute',c:'Brute Force'}], radarData:[0.76,0.72,0.74,0.80,0.78], attackData:[10,18,22,35,42,38,55,50,45,62,72,58]},
  {id:'clop', name:'Cl0p', type:'RaaS', subtype:'MOVEit Exploit', victims:471, threat:85, status:'active', sectors:['💰','🏥','🎓'], targets:['Finance','Health','Edu'], lastSeen:'Apr 22 2026', founded:2019, ransom:'$500M+', onion:'ekbgzchl6x6...onion', area:['🇺🇸 US','🇬🇧 UK','🇩🇪 DE','🇯🇵 JP'], tools:[{ico:'⚙️',n:'CLOP Ransomware',c:'Custom Malware'},{ico:'🔑',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🌐',n:'MOVEit Exploit',c:'Initial Access'},{ico:'📤',n:'MEGAsync',c:'Exfiltration'}], radarData:[0.85,0.90,0.88,0.82,0.72], attackData:[35,58,42,75,95,68,110,102,88,125,145,95]},
  {id:'blackbasta', name:'Black Basta', type:'RaaS', subtype:'Double Extortion', victims:329, threat:80, status:'active', sectors:['🏥','🏭','💰'], targets:['Health','Mfg','Finance'], lastSeen:'Apr 18 2026', founded:2022, ransom:'$100M+', onion:'aazsbsgya...onion', area:['🇺🇸 US','🇩🇪 DE','🇨🇦 CA'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🔑',n:'Mimikatz',c:'Credential'},{ico:'📡',n:'Qakbot',c:'Initial Access'},{ico:'📤',n:'Rclone',c:'Exfiltration'}], radarData:[0.80,0.76,0.78,0.82,0.74], attackData:[22,38,30,52,65,48,82,75,62,88,98,72]},
  {id:'play', name:'Play', type:'RaaS', subtype:'No Negotiations', victims:344, threat:78, status:'active', sectors:['🏭','🏛','🎓'], targets:['Mfg','Gov','Edu'], lastSeen:'Apr 20 2026', founded:2022, ransom:'$15M+', onion:'mbrlkbtq...onion', area:['🇺🇸 US','🇦🇺 AU','🇨🇭 CH'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'⚙️',n:'PLAY Ransomware',c:'Custom Malware'},{ico:'🔑',n:'Grixba',c:'Credential'},{ico:'📤',n:'WinRAR',c:'Exfiltration'}], radarData:[0.78,0.74,0.72,0.80,0.76], attackData:[20,32,25,45,55,40,68,62,52,75,85,65]},
  {id:'conti', name:'Conti', type:'RaaS', subtype:'Double Extortion', victims:1000, threat:95, status:'inactive', sectors:['💰','🏥','🏛'], targets:['Finance','Health','Gov'], lastSeen:'May 2022', founded:2020, ransom:'$180M+', onion:'—（消滅）', area:['🇺🇸 US','🇬🇧 UK','🇩🇪 DE'], tools:[{ico:'🎯',n:'Cobalt Strike',c:'C2 Framework'},{ico:'🔑',n:'Mimikatz',c:'Credential'},{ico:'📡',n:'TrickBot',c:'Initial Access'},{ico:'📤',n:'Rclone',c:'Exfiltration'}], radarData:[0.95,0.92,0.90,0.95,0.70], attackData:[80,95,88,110,130,100,145,135,115,150,165,90]},
];

export const FALLBACK_VICTIMS = [
  {co:'Boeing', ico:'✈️', loc:'🇺🇸 Seattle, USA', country:'US', date:'2026-04-18', desc:'財務記録・契約書を含む約40GBのデータを窃取。身代金要求額は未公開。'},
  {co:'TSMC', ico:'💾', loc:'🇹🇼 Hsinchu, Taiwan', country:'TW', date:'2026-04-11', desc:'サプライチェーン情報・設計仕様書が流出。生産ラインへの影響を調査中。'},
  {co:'Royal Bank of Canada', ico:'🏦', loc:'🇨🇦 Toronto, Canada', country:'CA', date:'2026-04-03', desc:'顧客DBへのアクセスを確認。約120万件の口座情報が対象。'},
  {co:'Bayer AG', ico:'💊', loc:'🇩🇪 Leverkusen, Germany', country:'DE', date:'2026-03-27', desc:'研究開発文書・特許情報を含む機密データを暗号化。'},
  {co:'Nippon Steel', ico:'🏗️', loc:'🇯🇵 Tokyo, Japan', country:'JP', date:'2026-03-19', desc:'内部メール・取引先情報が対象。復旧に約2週間を要した。'},
  {co:'NHS Foundation', ico:'🏥', loc:'🇬🇧 London, UK', country:'UK', date:'2026-03-08', desc:'患者記録50万件以上が暗号化。救急外来への影響が発生。'},
];

export const HOME_VICTIMS = [
  {ico:'✈️', name:'Boeing', meta:'🇺🇸 USA · Aerospace', group:'LockBit 3.0', groupId:'lockbit', date:'Apr 28', desc:'財務記録・契約書を含む約40GBのデータを窃取。身代金要求額は未公開。', country:'US', status:'公開済み', damage:'データ窃取・暗号化', size:'40GB'},
  {ico:'🏗️', name:'Nippon Steel', meta:'🇯🇵 Japan · Mfg', group:'Akira', groupId:'akira', date:'Apr 27', desc:'内部メール・取引先情報が対象。復旧に約2週間を要した。', country:'JP', status:'調査中', damage:'データ暗号化', size:'—'},
  {ico:'🏥', name:'NHS Foundation', meta:'🇬🇧 UK · Health', group:'LockBit 3.0', groupId:'lockbit', date:'Apr 26', desc:'患者記録50万件以上が暗号化。救急外来への影響が発生。', country:'UK', status:'復旧済み', damage:'データ暗号化', size:'—'},
  {ico:'💊', name:'Bayer AG', meta:'🇩🇪 Germany · Pharma', group:'RansomHub', groupId:'ransomhub', date:'Apr 25', desc:'研究開発文書・特許情報を含む機密データを暗号化。', country:'DE', status:'交渉中', damage:'データ暗号化・窃取', size:'—'},
];

export const LOGO_FALLBACK = {
  lockbit:'⛓️', blackcat:'👁', akira:'⛓️', ransomhub:'💀',
  clop:'☠️', blackbasta:'💀', play:'🗡️', conti:'👁',
  medusa:'🕷️', hunters:'🗡️', revil:'☠️', alphv:'👁',
  hive:'☠️', vice:'🗡️', grief:'💀', pysa:'⛓️',
  cuba:'☠️', lorenz:'⛓️', ragnar:'🔥', avos:'👁',
  darkside:'☠️', maze:'👁', ryuk:'☠️', netwalker:'👁',
  default:'⛓️'
};

export function getFallbackIco(id, lastSeen, status) {
  const key = (id || '').toLowerCase();
  if (LOGO_FALLBACK[key]) return LOGO_FALLBACK[key];
  if (status === 'inactive') return '👁';
  if (lastSeen) {
    const d = new Date(lastSeen), now = new Date();
    if (!isNaN(d) && (now - d) / 86400000 <= 30) return '💀';
  }
  if (status === 'active' || status === 'critical') return '⛓️';
  return '⛓️';
}

export function calcThreatScore(g) {
  return Math.min(Math.round(
    Math.min((g.victims || 0) / 20, 40) +
    (g.status === 'active' ? 30 : 0) +
    Math.min((2026 - (g.founded || 2020)) * 5, 20) +
    ((g.type || '').toLowerCase().includes('raas') ? 10 : 5)
  ), 100);
}

export function calcRarity(score) {
  return score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : 1;
}

export function calcThreatLevel(g) {
  if (g.threat >= 90 && g.status !== 'inactive') return 5;
  if (g.threat >= 75) return 4;
  if (g.threat >= 60) return 3;
  if (g.threat >= 40) return 2;
  return 1;
}
