// Easy way to get EpochTimestamp in integer form for SimpleFin client
export const getDateForSimpleFin = (date: Date): string => {
  const localizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return Math.floor(localizedDate.getTime() / 1000).toString();
};

export const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const startOfMonthUTC = (date: Date): Date => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
};

export const endOfMonthUTC = (date: Date): Date => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
};

export const getMonthNames = (start = new Date(), end = new Date()): string[] => {
  const endDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth()));
  const startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth()));

  const months: string[] = [];
  while (startDate <= endDate) {
    months.push(allMonths[startDate.getUTCMonth()]);
    startDate.setUTCMonth(startDate.getUTCMonth() + 1);
  }

  return months;
}
