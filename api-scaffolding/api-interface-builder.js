const { schema } = require("./api.schema.js");
const fs = require("fs");
const path = require("path");

const defaultOptions = {
  payloadPropName: "payload",
  payloadType: "any",
};

class ApiInterfaceBuilder {
  constructor(schema, options) {
    Object.assign(this, { ...options, ...defaultOptions });
    this.generatedInterfaces = new Set();
    this.getInterface("RootService", schema);
  }

  getInterface(name, schema) {
    const parts = [];
    parts.push(`export interface ${this.getInterfaceName(name)} {`);

    for (const [field, value] of Object.entries(schema)) {
      if (this.isGroup(value)) {
        parts.push(`${this.space}${field}: ${this.getInterfaceName(field)},`);
        this.getInterface(field, value);
      } else {
        parts.push(`${this.space}${field}${this.getMethod(value)}`);
      }
    }

    parts.push("};");
    this.generatedInterfaces.add(parts.join("\n"));
  }

  getMethod(template) {
    const listOfParams = this.getArgumentList(template);

    if (listOfParams.length === 0) return `(): ${this.returnType()}`;

    const parts = [];
    parts.push("(params: {");

    for (const param of listOfParams) {
      const [name, type = "unknown"] = param.split(/\??:/);
      parts.push(`${this.space.repeat(2)}${name}: ${type},`);
    }

    if (this.hasPayload(template)) {
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

  isGroup(value) {
    return typeof value === "object";
  }

  hasPayload(template) {
    return ["[POST]", "[PUT]", "[PATCH]"].some((method) =>
      template.startsWith(method)
    );
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
