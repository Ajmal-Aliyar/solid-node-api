import "reflect-metadata";
import { connectDB } from "./config/db.config";
import { connectRedis } from "./config/redis.config";
import { startContainer } from "./inversify/container";
import { registerRoutes } from "./app/registerRoutes";
import { createApp } from "./server";
import { errorHandler } from "./middlewares/error-handler";
import { env } from "./config/env.config";
import { logger } from "./config/logger.config";

async function bootstrap() {
  try {
    await connectDB();
    await connectRedis();
    await startContainer();

    const app = createApp(); 
    registerRoutes(app);
    app.use(errorHandler);

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error("Bootstrapping failed:", err);
    process.exit(1);
  }
}

bootstrap();
