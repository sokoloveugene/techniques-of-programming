const users = [
  { name: "John", age: 23 },
  { name: "Jane", age: 18 },
  { name: "Mike", age: 40 },
  { name: "Helen", age: 27 },
  { name: "John", age: 12 },
];

const overloading = (...fns) => {
  const fnList = [];

  for (const fn of fns) {
    if (typeof fn === "function") fnList[fn.length] = fn;
  }

  return function () {
    return fnList[arguments.length].apply(this, arguments);
  };
};

const findUser = overloading(
  () => users,
  (name) => users.find((user) => user.name === name),
  (name, age) => users.find((user) => user.name === name && user.age === age)
);

findUser(); // [{}, {}, {}, {}, {}]
findUser("John"); // { name: "John", age: 23 }
findUser("John", 12); // { name: "John", age: 12 }
findUser("John", 13); // undefined
