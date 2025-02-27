export const ROUTES = {
    HOME: "/",
    SATELLITES: "/satellites",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    LAUNCH: "/launches/:launch_id",
    LAUNCHES: "/launches",
    SATELLITES_TABLE: "/satellites/table",
    SATELLITE_CREATE: "/satellites/create",
    SATELLITE_EDIT: "/satellites/:id/edit",
    FORBIDDEN: "/403",
    NOT_FOUND: "*"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SATELLITES: "Спутники",
    LOGIN: "Авторизация",
    REGISTER: "Регистрация",
    PROFILE: "Профиль",
    LAUNCH: "Запуск",
    LAUNCHES: "Запуски",
    SATELLITES_TABLE: "Таблица спутников",
    SATELLITE_CREATE: "Создание спутника",
    SATELLITE_EDIT: "Редактирование спутника",
    FORBIDDEN: "Доступ запрещен",
    NOT_FOUND: "Страница не найдена",
};