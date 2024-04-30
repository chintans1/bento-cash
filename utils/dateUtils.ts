// Easy way to get EpochTimestamp in integer form for SimpleFin client
const getDateForSimpleFin = (date: Date): string => {
  const localizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return Math.floor(localizedDate.getTime() / 1000).toString();
};

export default getDateForSimpleFin;
