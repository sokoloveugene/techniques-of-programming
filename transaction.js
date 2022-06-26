class Transaction {
  static start(data) {
    return new Transaction(data);
  }

  #data;
  #delta;

  constructor(data) {
    this.#data = data;
    this.#delta = {};

    for (const key of Object.keys(data)) {
      this.#buildField(key);
    }
  }

  commit() {
    Object.assign(this.#data, this.#delta);
    this.rollback();
  }

  rollback() {
    this.#delta = {};
  }

  toJSON() {
    return Object.assign({}, this.#data, this.#delta);
  }

  #buildField(fieldName) {
    Object.defineProperty(this, fieldName, {
      set: function (value) {
        this.#delta[fieldName] = value;
      },
      get: function () {
        return this.#delta[fieldName] === undefined
          ? this.#data[fieldName]
          : this.#delta[fieldName];
      },
    });
  }
}

const data = { name: "Marcus Aurelius", born: 121 };

const transaction = Transaction.start(data);

transaction.name = "Mao Zedong";
transaction.born = 1893;

// data { name: 'Marcus Aurelius', born: 121 }

transaction.commit();

// data { name: 'Mao Zedong', born: 1893 }
