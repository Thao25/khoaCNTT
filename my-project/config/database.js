module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        client: "mongo",
        host: "127.0.0.1",
        port: 27017,
        database: "strapi",
        username: "",
        password: "",
      },
      options: {
        authenticationDatabase: "",
        ssl: false,
      },
    },
  },
});
