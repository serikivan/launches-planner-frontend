export const ROUTES = {
    HOME: "/",
    SATELLITES: "/satellites",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    LAUNCH: "/launches/:launch_id",
    LAUNCHES: "/launches"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SATELLITES: "Спутники",
    LOGIN: "Авторизация",
    REGISTER: "Регистрация",
    PROFILE: "Профиль",
    LAUNCH: "Запуск",
    LAUNCHES: "Запуски"
};