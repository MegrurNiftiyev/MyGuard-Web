const AZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
];

export const formatUploadDate = (dateInput?: string | Date | number | null): string => {
  if (!dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = AZ_MONTHS[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year} ${month} ${day} ${hours}:${minutes}`;
  }

  const dateObj = typeof dateInput === 'object' && dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(dateObj.getTime())) {
    return String(dateInput);
  }

  const year = dateObj.getFullYear();
  const month = AZ_MONTHS[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${year} ${month} ${day} ${hours}:${minutes}`;
};
