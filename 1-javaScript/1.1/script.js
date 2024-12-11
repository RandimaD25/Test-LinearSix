Date.prototype.daysTo = function (targetDate) {
  const startDate = new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate()
  );

  const endDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const daysDiff = (endDate - startDate) / 1000 / 60 / 60 / 24;
  return daysDiff;
};

const d1 = new Date(2024, 11, 1);
const d2 = new Date(2024, 11, 11);
const daysDiff = d1.daysTo(d2);
console.log(daysDiff);
