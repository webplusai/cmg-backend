console.log('DB_HOST App: ', process.env.DB_HOST);
console.log('DB_PORT App: ', process.env.DB_PORT);
console.log('DB_USER App: ', process.env.DB_USER);
console.log('DB_PASSWORD App: ', process.env.DB_PASSWORD);
console.log('DB_NAME App: ', process.env.DB_NAME);

export default () => ({
  appSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT as string, 3001),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNC === "true",
  },
});
