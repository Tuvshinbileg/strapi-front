export interface GuestTokenResponse {
  token: string;
  expiresAt: number;
}

export interface SupersetDashboardConfig {
  id: string;
  supersetDomain: string;
  mountPoint: HTMLElement;
  fetchGuestToken: () => Promise<string>;
  dashboardUiConfig?: {
    hideTitle?: boolean;
    hideChartControls?: boolean;
    hideTab?: boolean;
    filters?: {
      expanded?: boolean;
      visible?: boolean;
    };
  };
}
