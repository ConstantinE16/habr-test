import { ref } from 'vue';
import SuggestInput from './components/SuggestInput.vue';
const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.length < 3)
        return [];
    try {
        const response = await fetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${searchText}`);
        if (!response.ok)
            throw new Error(`Ошибка ${response.status}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Ошибка загрузки:', error.message);
        }
        else {
            console.error('Неизвестная ошибка:', error);
        }
        return [];
    }
};
const selectedUsers = ref([]);
const handleAdd = (item) => {
    selectedUsers.value.push(item);
};
const handleRemove = (item) => {
    selectedUsers.value = selectedUsers.value.filter((user) => user.alias !== item.alias);
};
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ("main") },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ("habr-wrapper") },
});
;
const __VLS_0 = __VLS_asFunctionalComponent(SuggestInput, new SuggestInput({
    ...{ 'onAddItem': {} },
    ...{ 'onRemoveItem': {} },
    title: ("Пользователь или компания"),
    placeholder: ("Введите логин"),
    fetchFunction: ((__VLS_ctx.fetchSuggestions)),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onAddItem': {} },
    ...{ 'onRemoveItem': {} },
    title: ("Пользователь или компания"),
    placeholder: ("Введите логин"),
    fetchFunction: ((__VLS_ctx.fetchSuggestions)),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_5;
const __VLS_6 = {
    onAddItem: (__VLS_ctx.handleAdd)
};
const __VLS_7 = {
    onRemoveItem: (__VLS_ctx.handleRemove)
};
let __VLS_2;
let __VLS_3;
var __VLS_4;
['main', 'habr-wrapper',];
var __VLS_special;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SuggestInput: SuggestInput,
            fetchSuggestions: fetchSuggestions,
            handleAdd: handleAdd,
            handleRemove: handleRemove,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
;
