import { Option } from "react-multi-select-component";

export function selectLocalValues(placeholder: string, options: Option[]) {
    const allValues = options.filter((item) => !item.disabled).map((item) => item.value);
    const allValuesStr = allValues.join(", ");

    return {
        "allItemsAreSelected": allValuesStr,
        "clearSearch": "Очистити пошук",
        "clearSelected": "Очистити вибрані",
        "noOptions": "Опції відсутні",
        "search": "Пошук",
        "selectAll": "Вибрати всі",
        "selectAllFiltered": "Вибрати всі (фільтр)",
        "selectSomeItems": placeholder,
        "create": "Створити",
    }
}