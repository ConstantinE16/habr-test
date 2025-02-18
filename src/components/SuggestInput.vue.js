import { ref, computed, watch, defineEmits, defineProps, nextTick, } from 'vue';
import { Key } from '../types';
import { debounce } from '../utils';
const imgError = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKKTSvZN11llNI0ft4757KYvxEBb9vbg6Hpg&s';
const props = defineProps({
    label: { type: String, default: 'Введите логин' },
    maxTags: { type: Number, default: 4 },
    title: { type: String, default: 'Заголовок' },
    placeholder: { type: String, default: 'placeholder' },
    fetchFunction: { type: Function, required: true },
});
const emit = defineEmits(['addItem', 'removeItem']);
const inputText = ref('');
const isInputValid = computed(() => inputText.value.length >= 3);
const suggestions = ref([]);
const selectedItems = ref([]);
const isLoading = ref(false);
const error = ref(null);
const activeIndex = ref(-1);
const suggestionList = ref(null);
const selectItem = (item) => {
    if (selectedItems.value.length + 1 === props.maxTags) {
        inputText.value = '';
        suggestions.value = [];
    }
    selectedItems.value.push(item);
    suggestions.value = suggestions.value.filter((suggestion) => suggestion.alias !== item.alias);
    emit('addItem', item);
};
const removeTag = (item) => {
    selectedItems.value = selectedItems.value.filter((suggestion) => suggestion.alias !== item.alias);
    suggestions.value.push(item);
    emit('removeItem', item);
};
const fetchSuggestions = async () => {
    if (!isInputValid.value) {
        suggestions.value = [];
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
        suggestions.value = props.fetchFunction
            ? await props.fetchFunction(inputText.value)
            : [];
    }
    catch (err) {
        error.value = err.message || 'Ошибка при загрузке';
        suggestions.value = [];
    }
    finally {
        isLoading.value = false;
    }
};
const scrollToActiveItem = () => {
    if (!suggestionList.value)
        return;
    const listContainer = suggestionList.value;
    const activeElement = listContainer.querySelector('li.active');
    if (!activeElement)
        return;
    const containerTop = listContainer.scrollTop;
    const containerBottom = containerTop + listContainer.clientHeight;
    const itemTop = activeElement.offsetTop;
    const itemBottom = itemTop + activeElement.clientHeight;
    if (itemTop < containerTop) {
        listContainer.scrollTop = itemTop;
    }
    else if (itemBottom > containerBottom) {
        listContainer.scrollTop = itemBottom - listContainer.clientHeight;
    }
};
const handleKeyDown = async (event) => {
    if (suggestions.value.length === 0)
        return;
    switch (event.key) {
        case Key.ArrowDown:
            event.preventDefault();
            if (activeIndex.value >= suggestions.value.length - 1) {
                activeIndex.value = 0;
            }
            else {
                activeIndex.value++;
            }
            await nextTick();
            scrollToActiveItem();
            break;
        case Key.ArrowUp:
            event.preventDefault();
            if (activeIndex.value <= 0) {
                activeIndex.value = suggestions.value.length - 1;
            }
            else {
                activeIndex.value--;
            }
            await nextTick();
            scrollToActiveItem();
            break;
        case Key.Enter:
            if (activeIndex.value !== -1) {
                selectItem(suggestions.value[activeIndex.value]);
            }
            break;
        case Key.Escape:
            suggestions.value = [];
            activeIndex.value = -1;
            break;
        default: break;
    }
};
const debouncedFetchSuggestions = debounce(fetchSuggestions, 200);
watch(inputText, () => {
    debouncedFetchSuggestions();
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ("suggest") },
});
if (__VLS_ctx.title) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("suggest__title") },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ("suggest__title--required") },
    });
    (__VLS_ctx.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ("suggest__input-container") },
});
if (__VLS_ctx.selectedItems.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("suggest__tags") },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.selectedItems))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: ((item.alias)),
            ...{ class: ("suggest__tag") },
        });
        (item.alias);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.selectedItems.length)))
                        return;
                    __VLS_ctx.removeTag(item);
                } },
            ...{ class: ("suggest__tag-remove") },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onKeydown: (__VLS_ctx.handleKeyDown) },
    placeholder: ((props.placeholder)),
});
(__VLS_ctx.inputText);
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.selectedItems.length < props.maxTags) }, null, null);
if (__VLS_ctx.isInputValid && __VLS_ctx.suggestions.length > 0 && __VLS_ctx.selectedItems.length < props.maxTags) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: ("suggest__list") },
        role: ("listbox"),
        'aria-live': ("polite"),
        ref: ("suggestionList"),
    });
    ;
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.suggestions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!((__VLS_ctx.isInputValid && __VLS_ctx.suggestions.length > 0 && __VLS_ctx.selectedItems.length < props.maxTags)))
                        return;
                    __VLS_ctx.selectItem(item);
                } },
            key: ((item.name)),
            role: ("option"),
            ...{ class: ("suggest__item") },
            'aria-selected': ((index === __VLS_ctx.activeIndex)),
            ...{ class: (({ 'suggest__item--active': index === __VLS_ctx.activeIndex })) },
            'data-index': ((index)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            ...{ class: ("suggest__avatar") },
            src: ((item.avatar || __VLS_ctx.imgError)),
            onerror: ("this.src=`imgError`"),
            alt: ("Avatar"),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (item.name || item.alias);
        if (item.type === 'company') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        (item.alias);
    }
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("suggest__error") },
    });
    (__VLS_ctx.error);
}
['suggest', 'suggest__title', 'suggest__title--required', 'suggest__input-container', 'suggest__tags', 'suggest__tag', 'suggest__tag-remove', 'suggest__list', 'suggest__item', 'suggest__item--active', 'suggest__avatar', 'suggest__error',];
var __VLS_special;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            imgError: imgError,
            inputText: inputText,
            isInputValid: isInputValid,
            suggestions: suggestions,
            selectedItems: selectedItems,
            error: error,
            activeIndex: activeIndex,
            suggestionList: suggestionList,
            selectItem: selectItem,
            removeTag: removeTag,
            handleKeyDown: handleKeyDown,
        };
    },
    emits: {},
    props: {
        label: { type: String, default: 'Введите логин' },
        maxTags: { type: Number, default: 4 },
        title: { type: String, default: 'Заголовок' },
        placeholder: { type: String, default: 'placeholder' },
        fetchFunction: { type: Function, required: true },
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        label: { type: String, default: 'Введите логин' },
        maxTags: { type: Number, default: 4 },
        title: { type: String, default: 'Заголовок' },
        placeholder: { type: String, default: 'placeholder' },
        fetchFunction: { type: Function, required: true },
    },
    __typeRefs: {},
    __typeEl: {},
});
;
