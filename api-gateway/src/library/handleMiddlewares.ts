import middlewares from "@/middlewares";

export const handleMiddlewares = (guards: string[]) => {
  return guards.map((guard) => middlewares[guard]);
};
