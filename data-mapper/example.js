const { pick, convert } = require("./mapper.js");

const initial = {
  timestamp: "Sun Jul 03 2022 18:08:21 GMT+0300 (Eastern European Summer Time)",
  user: {
    _id: "q2we-21asd2-ada2",
    isAdmin: false,
    main: {
      name: "John",
      surname: "Dou",
      birth: "1990-01-20",
      country: [{ code: 121, name: "Ukraine" }],
    },
  },
  langs: [{ short: "JS" }, { short: "TS" }, { short: "JAVA" }],
};

const toFullName = (name, surname) => {
  return `${name} ${surname}`;
};

const toAge = (date) => {
  return new Date().getFullYear() - new Date(date).getFullYear();
};

const schema = {
  timestamp: pick(),
  isAdmin: pick("user.isAdmin"),
  id: pick("user._id"),
  "info.fullName": pick("user.main.name", "user.main.surname")
    .setFunction(toFullName)
    .setFallback(null),
  "info.age": pick("user.main.birth")
    .setFunction(toAge)
    .setFallback("not defined"),
  "country.from": pick("user.main.country.0.name").setFallback(null),
};

console.log(JSON.stringify(convert(schema, initial), null, 2));

// const final = {
//   timestamp: "Sun Jul 03 2022 18:08:21 GMT+0300 (Eastern European Summer Time)",
//   isAdmin: false,
//   id: "q2we-21asd2-ada2",
//   info: {
//     fullName: "John Dou",
//     age: 32,
//   },
//   country: {
//     from: "Ukraine",
//   },
// };
