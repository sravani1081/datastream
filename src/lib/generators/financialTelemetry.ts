// Banking & Financial Transaction Stream Generator

export interface FinancialTransactionRecord {
  transaction_id: string;
  sender_account: string;
  receiver_account: string;
  amount_usd: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BTC';
  transaction_type: 'Transfer' | 'Withdrawal' | 'Deposit' | 'Wire' | 'CardPurchase';
  merchant_category: string;
  risk_score: number;
  timestamp: string;
  compliance_status: 'CLEARED' | 'FLAGGED_AML' | 'HELD_SANCTION';
}

export class FinancialTelemetryGenerator {
  private static pseudoRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  static generateTransactions(count = 100, seed = 42): FinancialTransactionRecord[] {
    const types = ['Transfer', 'Withdrawal', 'Deposit', 'Wire', 'CardPurchase'] as const;
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'BTC'] as const;
    const categories = ['Retail', 'Travel', 'Gambling', 'Jewelry', 'Cryptocurrency', 'Utility'];

    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 17;
      const typeIdx = Math.floor(this.pseudoRandom(s) * types.length);
      const currIdx = Math.floor(this.pseudoRandom(s + 1) * currencies.length);
      const catIdx = Math.floor(this.pseudoRandom(s + 2) * categories.length);
      const amount = Math.floor(this.pseudoRandom(s + 3) * 9500) + 20;
      const risk = Number(this.pseudoRandom(s + 4).toFixed(3));

      let compliance: FinancialTransactionRecord['compliance_status'] = 'CLEARED';
      if (amount > 9000 || risk > 0.85) compliance = 'FLAGGED_AML';
      if (categories[catIdx] === 'Cryptocurrency' && amount > 8000) compliance = 'HELD_SANCTION';

      return {
        transaction_id: `tx_fin_${50000 + i}`,
        sender_account: `ACC_${1000 + (i % 30)}`,
        receiver_account: `ACC_${9000 + (i % 30)}`,
        amount_usd: amount,
        currency: currencies[currIdx],
        transaction_type: types[typeIdx],
        merchant_category: categories[catIdx],
        risk_score: risk,
        timestamp: new Date(Date.now() - i * 30000).toISOString(),
        compliance_status: compliance,
      };
    });
  }
}
