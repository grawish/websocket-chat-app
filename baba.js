const getEven = (arr) => {
  let evenArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 == 0) {
      evenArr.push(arr[i]);
    }
  }
  return evenArr;
};

const getA = (b, c, d) => {
  return (d - c) / b;
};

const getB = (a, c, d) => {
  return (d - c) / a;
};

const getC = (a, b, d) => {
  return d / (a * b);
};

const getD = (a, b, c) => {
  return a * b + c;
};

class FixEquation {
  findMissingDigit(equation) {
    let missing = "";
    let unprocessedNumbers = getEven(equation.split(" "));
    let numbers = [];
    unprocessedNumbers.map((item) => {
      if (item.includes("?")) {
        missing = item;
        numbers.push(NaN);
      } else {
        numbers.push(parseInt(item));
      }
    });
    let [a, b, c, d] = numbers;
    console.log(a, b, c, d);
    if (!Number.isInteger(a)) {
      console.log(missing);
      let x = getA(b, c, d);
      if (!Number.isInteger(x)) {
        return -1;
      }
    } else if (!Number.isInteger(b)) {
      console.log(missing);
      let x = getB(a, c, d);
      if (!Number.isInteger(x)) {
        return -1;
      }
    } else if (!Number.isInteger(c)) {
      console.log(missing);
      let x = getC(a, b, d);
      if (!Number.isInteger(x)) {
        return -1;
      }
    } else if (!Number.isInteger(d)) {
      console.log(missing);
      let x = getD(a, b, c);
      if (!Number.isInteger(x)) {
        return -1;
      }
    }
  }
}

const test = new FixEquation();
console.log(test.findMissingDigit("2 * 12? + 2 = 247"));
