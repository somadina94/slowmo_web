const React = require("react");

module.exports = new Proxy(
  {},
  {
    get: (_target, name) => {
      const Icon = (props) => React.createElement("svg", { "data-icon": String(name), ...props });
      Icon.displayName = String(name);
      return Icon;
    },
  },
);
