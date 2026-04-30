const BASE = '/v2';

export const api = {
  groups: () => fetch(`${BASE}/groups`).then(r => r.json()),
  group: (id) => fetch(`${BASE}/group/${id}`).then(r => r.json()),
  victims: (id) => fetch(`${BASE}/groupvictims/${id}`).then(r => r.json()),
  recent: () => fetch(`${BASE}/recentvictims`).then(r => r.json()),
};
