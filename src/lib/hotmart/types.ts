export interface HotmartWebhookPayload {
  id: string;
  event: string;
  version?: string;
  hottok?: string;
  data: {
    product?: { id?: string | number; name?: string };
    buyer?: { email?: string; name?: string };
    purchase?: { transaction?: string; status?: string };
  };
}

export const APPROVED_EVENTS = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
