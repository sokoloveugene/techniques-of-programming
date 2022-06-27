function Transaction() {}

Transaction.start = function (data) {
  let delta = {};

  const methods = {
    commit: () => {
      Object.assign(data, delta);
      delta = {};
    },
    rollback: () => {
      delta = {};
    },
  };

  return new Proxy(data, {
    get: (target, name) => {
      if (name === "delta") return delta;
      if (methods.hasOwnProperty(name)) return methods[name];
      if (delta.hasOwnProperty(name)) return delta[name];
      return data[name];
    },

    set: (obj, prop, value) => {
      if (data[prop] === value) delete delta[prop];
      else delta[prop] = value;
      return true;
    },

    ownKeys: () => [...new Set([...Object.keys(data), ...Object.keys(delta)])],

    getOwnPropertyDescriptor: (target, name) =>
      Object.getOwnPropertyDescriptor(
        delta.hasOwnProperty(name) ? delta : data,
        name
      ),
  });
};

const data = { name: "Marcus Aurelius", born: 121 };

const transaction = Transaction.start(data);

transaction.name = "Mao Zedong";
transaction.born = 1893;
transaction.age = 19;

// data { name: 'Marcus Aurelius', born: 121 }

transaction.commit();

// data { name: 'Mao Zedong', born: 1893, age: 19 }
