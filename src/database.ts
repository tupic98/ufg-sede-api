import { createConnection, useContainer, ConnectionOptions, getConnectionOptions } from 'typeorm';
import { Container } from "typedi";

const getOptions = async () => {
  let connectionOptions: ConnectionOptions;
  connectionOptions = {
    type: 'postgres',
    synchronize: false,
    logging: true,
    entities: ['src/entities/**/*.ts', 'dist/entities/**/*.js'],
  };
  if (process.env.DATABASE_URL) {
    Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  } else {
    connectionOptions = await getConnectionOptions();
  }
  return connectionOptions;
}

export const connectDB = async () => {
  useContainer(Container);
  const typeormConfig = await getOptions();
  return await createConnection(typeormConfig);
};
