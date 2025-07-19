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
