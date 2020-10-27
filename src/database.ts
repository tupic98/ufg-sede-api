import { createConnection, useContainer } from 'typeorm';
import { Container } from "typedi";

export const connectDB = async () => {
  useContainer(Container);
  return await createConnection();
};
