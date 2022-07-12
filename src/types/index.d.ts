interface ICampaign {
  campaign: string;
  campaign_id: string;
  ad: string;
  ad_id: string;
  day: string;
  spent: number;
  impressions: number;
  clicks: number;
  reach: number;
  'views_25%': number;
  'views_50%': number;
  'views_75%': number;
  'views_100%': number;
  sessions: number;
  bounce_rate: number;
  average_session_duration: number;
  pages_per_session: number;
}