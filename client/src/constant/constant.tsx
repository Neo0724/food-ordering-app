export const STATUS = [
  'ACTIVE',
  'ORDERED',
  'CANCELLED',
  'DELIVERED',
  'COMPLETED',
] as const;

export type PAYMENT_METHOD = 'CREDIT' | 'EWALLET' | 'COUNTER';
