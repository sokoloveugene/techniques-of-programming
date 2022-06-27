class PatternBuilder {
  static setMap = (map) => new PatternBuilder(map);

  constructor(map) {
    this.map = map;
    this.fieldRegex = new RegExp(Object.keys(this.map).join("|"), "g");
    this.optional = /{{(.*?)}}/g;
    this.skip = [null, undefined, ""];
  }

  build = (pattern) =>
    this._pipe(this._replace.bind(this), this._cleanUp.bind(this))(pattern);

  _pipe(...fns) {
    return (value) => fns.reduce((acc, fn) => fn(acc), value);
  }

  _replace(str) {
    return str.replace(this.fieldRegex, (match) => {
      const replacement = this.map[match];
      if (this.skip.includes(replacement)) return;
      return replacement;
    });
  }

  _cleanUp(str) {
    return str.replace(this.optional, (match, $1) => {
      return $1.includes("undefined") ? "" : $1;
    });
  }
}

const address = {
  street: "Rue de Rivoli",
  postalCode: null,
  city: "Paris",
  country: {
    name: "France",
    code: "FRA",
  },
};

const getFieldsMap = (record) => ({
  STREET: record?.street,
  POSTAL_CODE: record?.postalCode,
  CITY: record?.city,
  COUNTRY: record?.country?.name,
  COUNTRY_CODE: record?.county?.code,
});

const addressMap = getFieldsMap(address);

// Skip interpolation in a middle
const pattern = "{{STREET - }}{{POSTAL_CODE, }}{{COUNTRY}}";
PatternBuilder.setMap(addressMap).build(pattern); // Rue de Rivoli - France

// Show pair with special characters in the interpolation
const pattern2 = "STREET, {{CITY (COUNTRY)}}";
PatternBuilder.setMap(addressMap).build(pattern2); // Rue de Rivoli, Paris (France)

// Skip pair if ONE does not exists
const pattern3 = "STREET, {{POSTAL_CODE CITY}} COUNTRY";
PatternBuilder.setMap(addressMap).build(pattern3); // Rue de Rivoli - France
