const fs = require("fs");
const path = require("path");
const { schema } = require("./api.schema.js");
const { isQuery } = require("./query.js");

const options = {
  payloadPropName: "payload",
  payloadType: "any",
};

class ApiInterfaceBuilder {
  constructor(schema) {
    Object.assign(this, options);
    this.generatedInterfaces = new Set();
    this.getInterface("RootService", schema);
  }

  getInterface(name, schema) {
    const parts = [];

    parts.push(`export interface ${this.getInterfaceName(name)} {`);

    for (const [field, value] of Object.entries(schema)) {
      if (isQuery(value))
        parts.push(`${this.space}${field}${this.getMethod(value)}`);
      else {
        parts.push(`${this.space}${field}: ${this.getInterfaceName(field)},`);
        this.getInterface(field, value);
      }
    }

    parts.push("};");
    this.generatedInterfaces.add(parts.join("\n"));
  }

  getMethod(query) {
    const listOfParams = this.getArgumentList(query.url);
    const hasPayload = ["post", "put", "patch"].includes(query.method);
    const hasParam = listOfParams.length !== 0 || hasPayload;

    if (!hasParam) return `(): ${this.returnType()}`;

    const parts = [];
    parts.push("(params: {");

    for (const param of listOfParams) {
      const [name, type = "unknown"] = param.split(/\??:/);
      parts.push(`${this.space.repeat(2)}${name}: ${type},`);
    }

    if (hasPayload) {
      parts.push(
        `${this.space.repeat(2)}${this.payloadPropName}?: ${this.payloadType},`
      );
    }

    parts.push(`${this.space}})`);
    return parts.join("\n").concat(`: ${this.returnType()}`);
  }

  getArgumentList(template) {
    return [...template.matchAll(/{{(.*?)}}/g)].reduce(
      (acc, match, index) => (index === 0 ? acc : [...acc, match[1]]),
      []
    );
  }

  capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  }

  getInterfaceName(serviceName) {
    const base = `I${this.capitalize(serviceName)}`;
    return base.endsWith("Service") ? base : `${base}Service`;
  }

  returnType(generic = "any") {
    return `Promise<${generic}>;`;
  }

  get space() {
    return " ".repeat(2);
  }
}

const printTypes = (filePath) => {
  const { generatedInterfaces } = new ApiInterfaceBuilder(schema);

  const generatedLines = [...generatedInterfaces].join("\n\n");

  fs.writeFileSync(filePath, generatedLines, "utf8");
};

printTypes(path.join(process.cwd(), "generated-example.interface.ts"));
