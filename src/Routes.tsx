export const ROUTES = {
    HOME: "/",
    SATELLITES: "/satellites",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SATELLITES: "Спутники",
  };