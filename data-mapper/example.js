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

const schema = {
  timestamp: "timestamp",
  id: "user._id",
  "info.fullName": {
    key: ["user.main.name", "user.main.surname"],
    transform: (name, surname) => {
      return `${name} ${surname}`;
    },
  },
  "info.age": {
    key: "user.main.birth",
    transform: (date) => {
      // TODO;
    },
    default: "not defined",
  },
  "country.from": {
    key: "user.main.country.0.name",
    default: null,
  },
};

const convert = (data, schema) => {
  const res = {};

  for (const [key, value] of Object.entries(data)) {
  }
};

const final = {
  timestamp: "Sun Jul 03 2022 18:08:21 GMT+0300 (Eastern European Summer Time)",
  id: "q2we-21asd2-ada2",
  info: {
    fullName: "John Dou",
    age: 32,
  },
  country: {
    from: "Ukraine",
  },
};
