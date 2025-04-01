import {z} from 'zod';

export const debitCardSchemaWithTopUp = z.object({
  cardNumber: z.string().length(19, 'Card number must be 19 digits'),
  cardHolder: z.string().min(1).max(40),
  expiredMonth: z
    .string()
    .min(1, 'Month is required')
    .max(2)
    .refine(month => {
      const intMonth = parseInt(month, 10);
      return intMonth >= 1 && intMonth <= 12;
    }, 'Month must be between 1-12'),
  expiredYear: z
    .string()
    .length(2, 'Year must be 2 digits')
    .refine(year => {
      const intYear = parseInt(year, 10);
      return intYear >= 25 && intYear <= 99;
    }, 'Year must be between 25-99'),
  cvv: z.string().length(3, 'CVV must be 3 digits'),
  topUpAmount: z.string().refine(topUpAmount => {
    const topUpAmountNumber = parseFloat(topUpAmount);
    return topUpAmountNumber >= 0;
  }, 'Top up amount must be greater than 0'),
});

export type DebitCardWithTopUpType = z.infer<typeof debitCardSchemaWithTopUp>;
