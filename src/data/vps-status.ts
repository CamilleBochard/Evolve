// Public server status shown in the "vps.status" window.
//
// Only harmless data: percentages, service states, last deployment date.
// Never an IP address, a host name or a version.

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
  // CPU load over the last 30 minutes, one value per minute.
  cpuHistory: number[];
  services: VpsService[];
  siteUptime: string | null;
  lastDeployment: string | null;
  commitSha: string | null;
}

// Shown until the real data is wired in.
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
