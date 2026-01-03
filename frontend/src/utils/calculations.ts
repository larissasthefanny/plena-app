interface Transaction {
  type: "income" | "expense";
  amount: number;
  category: string;
}

export function calculateFinancials(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const available = totalIncome - totalExpenses;

  const needsTarget = totalIncome * 0.5;
  const wantsTarget = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  const needsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Essenciais")
    .reduce((acc, t) => acc + t.amount, 0);

  const wantsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Desejos")
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsActual = transactions
    .filter((t) => t.type === "expense" && t.category === "Investimentos")
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    available,
    needsTarget,
    wantsTarget,
    savingsTarget,
    needsActual,
    wantsActual,
    savingsActual
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function calculateProgress(actual: number, target: number) {
  if (target === 0) return 0;
  const percentage = (actual / target) * 100;
  return Math.min(percentage, 100);
}

export function getChartData(needsActual: number, wantsActual: number, savingsActual: number) {
  return [
    { name: 'Essenciais', value: needsActual, color: '#3b82f6' },
    { name: 'Desejos', value: wantsActual, color: '#a855f7' },
    { name: 'Investimentos', value: savingsActual, color: '#10b981' }
  ].filter(d => d.value > 0);
}
