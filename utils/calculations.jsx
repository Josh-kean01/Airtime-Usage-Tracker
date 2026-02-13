export const getWeekTotal = (purchases) => {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);
  return purchases
    .filter((p) => {
      const d = new Date(p.dateISO);
      return d >= weekAgo && d <= now;
    })
    .reduce((sum, p) => sum + p.amount, 0);
};

export const getMonthTotal = (purchases) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return purchases
    .filter((p) => {
      const d = new Date(p.dateISO);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, p) => sum + p.amount, 0);
};

export const getTotalSpend = (purchases) => {
  return purchases.reduce((sum, p) => sum + p.amount, 0);
};

export const getDailyTotals = (purchases) => {
  const totals = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(now.getDate() - i);
    totals.push(
      purchases
        .filter((p) => {
          const d = new Date(p.dateISO);
          return (
            d.getDate() === day.getDate() &&
            d.getMonth() === day.getMonth() &&
            d.getFullYear() === day.getFullYear()
          );
        })
        .reduce((sum, p) => sum + p.amount, 0),
    );
  }
  return totals;
};

export const getProviderTotals = (purchases) => {
  const totals = { MTN: 0, Airtel: 0, Glo: 0, "9mobile": 0, Unknown: 0 };
  purchases.forEach((p) => {
    totals[p.provider] = (totals[p.provider] || 0) + p.amount;
  });
  return totals;
};

export const getHighestProvider = (purchases) => {
  const totals = getProviderTotals(purchases);
  let maxProvider = null;
  let max = 0;
  Object.keys(totals).forEach((k) => {
    if (totals[k] > max) {
      max = totals[k];
      maxProvider = k;
    }
  });
  return { provider: maxProvider, amount: max };
};

export const getLowestProvider = (purchases) => {
  const totals = getProviderTotals(purchases);
  let minProvider = null;
  let min = Infinity;
  Object.keys(totals).forEach((k) => {
    if (totals[k] > 0 && totals[k] < min) {
      min = totals[k];
      minProvider = k;
    }
  });
  if (minProvider === null) return { provider: null, amount: 0 };
  return { provider: minProvider, amount: min };
};

export const getMonthPercentChange = (purchases) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonthDate = new Date();
  prevMonthDate.setMonth(currentMonth - 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();
  const currentTotal = purchases
    .filter((p) => {
      const d = new Date(p.dateISO);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);
  const prevTotal = purchases
    .filter((p) => {
      const d = new Date(p.dateISO);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);
  if (prevTotal === 0) return null;
  return ((currentTotal - prevTotal) / prevTotal) * 100;
};
