import { Container } from "inversify";
import { bindAuthModule } from "./modules/auth-module";
import { bindUserModule } from "./modules/user-module";
import { bindSharedModule } from "./modules/shared-module";
const container: Container = new Container();

const startContainer = async () => {
   await bindAuthModule(container)
   await bindUserModule(container)
   await bindSharedModule(container)
};

const getContainer = (): Container => {
  if (!container) throw new Error("Container not initialized");
  return container;
};

export { startContainer, getContainer };
