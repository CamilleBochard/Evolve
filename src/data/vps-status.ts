// État public du serveur affiché dans la fenêtre « vps.status ».
//
// Uniquement des données sans risque : pourcentages, état des services,
// date du dernier déploiement. Jamais d'IP, de nom d'hôte ni de version.

export type ServiceState = 'up' | 'down' | 'unknown';

export interface VpsService {
  name: string;
  state: ServiceState;
  detail: string;
}

export interface VpsStatus {
  isAvailable: boolean;
  cpuPercent: number | null;
  memoryPercent: number | null;
  diskPercent: number | null;
  // Charge CPU des 30 dernières minutes, une valeur par minute.
  cpuHistory: number[];
  services: VpsService[];
  siteUptime: string | null;
  lastDeployment: string | null;
  commitSha: string | null;
}

// Affiché tant que les données réelles ne sont pas branchées.
export const PENDING_VPS_STATUS: VpsStatus = {
  isAvailable: false,
  cpuPercent: null,
  memoryPercent: null,
  diskPercent: null,
  cpuHistory: [],
  services: [
    { name: 'Site', state: 'unknown', detail: 'En attente' },
    { name: 'Reverse proxy', state: 'unknown', detail: 'En attente' },
    { name: 'Certificat HTTPS', state: 'unknown', detail: 'En attente' },
  ],
  siteUptime: null,
  lastDeployment: null,
  commitSha: null,
};
