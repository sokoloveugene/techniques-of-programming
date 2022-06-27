function Transaction() {}

Transaction.start = function (data) {
  let delta = {};
  const keysToDelete = new Set();

  const methods = {
    rollback() {
      delta = {};
      keysToDelete.clear();
    },
    commit() {
      Object.assign(data, delta);
      for (const key of keysToDelete) {
        delete data[key];
      }
      this.rollback();
    },
  };

  return new Proxy(data, {
    get: (target, name) => {
      if (name === "delta") return delta;
      if (methods.hasOwnProperty(name)) return methods[name];
      if (keysToDelete.has(name)) return undefined;
      if (delta.hasOwnProperty(name)) return delta[name];
      return target[name];
    },

    set: (target, name, value) => {
      if (target[name] === value) delete delta[name];
      else delta[name] = value;
      keysToDelete.delete(name);
      return true;
    },

    deleteProperty: (target, name) => {
      keysToDelete.add(name);
      return true;
    },

    ownKeys: (target) => [
      ...new Set([...Object.keys(target), ...Object.keys(delta)]),
    ],

    getOwnPropertyDescriptor: (target, name) =>
      Object.getOwnPropertyDescriptor(
        delta.hasOwnProperty(name) ? delta : target,
        name
      ),
  });
};

const data = { name: "Marcus Aurelius", born: 121 };

const transaction = Transaction.start(data);

transaction.name = "Mao Zedong";
transaction.born = 1893;
transaction.age = 19;
delete transaction.age;
transaction.age = 24;

// data { name: 'Marcus Aurelius', born: 121 }

transaction.commit();

// data { name: 'Mao Zedong', born: 1893, age: 24 }
