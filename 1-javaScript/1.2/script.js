const orderByTotal = function (inputArr) {
  const newArr = [];
  for (let i = 0; i < inputArr.length; i++) {
    const total = inputArr[i].amount * inputArr[i].quantity;
    const outputElement = { ...inputArr[i], Total: total };
    newArr.push(outputElement);
  }
  const orderedArr = newArr.sort((a, b) => a.Total - b.Total);
  return orderedArr;
};

const arr = [
  { amount: 10000, quantity: 2 },
  { amount: 5000, quantity: 10 },
  { amount: 1000, quantity: 8 },
  { amount: 6000, quantity: 11 },
  { amount: 1500, quantity: 2 },
  { amount: 600, quantity: 4 },
];

const outputArr = orderByTotal(arr);

console.log("Input Array", arr);
console.log("Output Array", outputArr);
