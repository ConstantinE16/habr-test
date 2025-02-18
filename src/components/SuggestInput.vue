<template>
  <div class="suggest">
    <div
      v-if="title"
      class="suggest__title"
    >
      <span class="suggest__title--required">*</span>
      {{ title }}
    </div>
    <div class="suggest__input-container">
      <div
        v-if="selectedItems.length"
        class="suggest__tags"
      >
        <div
          v-for="item in selectedItems"
          :key="item.alias"
          class="suggest__tag"
        >
          @{{ item.alias }}

          <span
            class="suggest__tag-remove"
            @click="removeTag(item)"
          >
            ✖
          </span>
        </div>
      </div>
      <input
        v-show="selectedItems.length < props.maxTags"
        :placeholder="props.placeholder"
        v-model="inputText"
        @keydown="handleKeyDown"
      />
    </div>

    <ul
      v-if="isInputValid && suggestions.length > 0 && selectedItems.length < props.maxTags"
      :style="{ maxHeight: listHeight }"
      class="suggest__list"
      role="listbox"
      aria-live="polite"
      ref="suggestionList"
    >
      <li
        v-for="(item, index) in suggestions"
        :key="item.name"
        role="option"
        class="suggest__item"
        :aria-selected="index === activeIndex"
        :class="{ 'suggest__item--active': index === activeIndex }"
        :data-index="index"
        @click="selectItem(item)"
        :ref="(el) => setItemRef(el, index)"
      >
        <img
          class="suggest__avatar"
          :src="item.avatar || imgError"
          onerror="this.src=`imgError`"
          alt="Avatar"
        />
        <div>
          <strong>{{ item.name || item.alias }}</strong>
          <span v-if="item.type === 'company'"> (компания) </span>
          <p>@{{ item.alias }}</p>
        </div>
      </li>
    </ul>

    <div
      v-if="error"
      class="suggest__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  defineEmits,
  defineProps,
  nextTick,
  onUpdated,
} from 'vue'
import { SuggestItem, Key } from '../types'
import { debounce } from '../utils'

const imgError = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKKTSvZN11llNI0ft4757KYvxEBb9vbg6Hpg&s'

const props = defineProps({
  label: { type: String, default: 'Введите логин' },
  maxTags: { type: Number, default: 4 },
  title: { type: String, default: 'Заголовок' },
  placeholder: { type: String, default: 'placeholder' },
  fetchFunction: { type: Function, required: true },
})

const emit = defineEmits([ 'addItem', 'removeItem' ])

const inputText = ref<string>('')
const isInputValid = computed(() => inputText.value.length >= 3)
const suggestions = ref<SuggestItem[]>([])
const selectedItems = ref<SuggestItem[]>([])
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const activeIndex = ref<number>(-1)
const suggestionList = ref<HTMLElement | null>(null)

const selectItem = (item: SuggestItem) => {
  if (selectedItems.value.length + 1 === props.maxTags) {
    inputText.value = ''
    suggestions.value = []
  }

  selectedItems.value.push(item)

  suggestions.value = suggestions.value.filter((suggestion: SuggestItem) => suggestion.alias !== item.alias)

  emit('addItem', item)
}

const removeTag = (item: SuggestItem) => {
  selectedItems.value = selectedItems.value.filter((suggestion: SuggestItem) => suggestion.alias !== item.alias)

  if (suggestions.value.length) suggestions.value.push(item)

  emit('removeItem', item)
}

const fetchSuggestions = async () => {
  if (!isInputValid.value) {
    suggestions.value = []
    return
  }

  isLoading.value = true
  error.value = null

  try {
    suggestions.value = props.fetchFunction
      ? await props.fetchFunction(inputText.value)
      : []
  }
  catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке'
    suggestions.value = []
  }
  finally {
    isLoading.value = false
  }
}

const scrollToActiveItem = () => {
  if (!suggestionList.value) return

  const listContainer = suggestionList.value as HTMLElement
  const activeElement = listContainer.querySelector('li.active') as HTMLElement

  if (!activeElement) return

  const containerTop = listContainer.scrollTop
  const containerBottom = containerTop + listContainer.clientHeight
  const itemTop = activeElement.offsetTop
  const itemBottom = itemTop + activeElement.clientHeight

  if (itemTop < containerTop) {
    listContainer.scrollTop = itemTop
  }
  else if (itemBottom > containerBottom) {
    listContainer.scrollTop = itemBottom - listContainer.clientHeight
  }
}
const handleKeyDown = async (event: KeyboardEvent) => {
  if (suggestions.value.length === 0) return

  switch (event.key) {
    case Key.ArrowDown:
      event.preventDefault()
      if (activeIndex.value >= suggestions.value.length - 1) {
        activeIndex.value = 0
      }
      else {
        activeIndex.value++
      }
      await nextTick()
      scrollToActiveItem()
      break

    case Key.ArrowUp:
      event.preventDefault()
      if (activeIndex.value <= 0) {
        activeIndex.value = suggestions.value.length - 1
      }
      else {
        activeIndex.value--
      }
      await nextTick()
      scrollToActiveItem()
      break

    case Key.Enter:
      if (activeIndex.value !== -1) {
        selectItem(suggestions.value[activeIndex.value])
      }
      break

    case Key.Escape:
      suggestions.value = []
      activeIndex.value = -1
      break

    default: break
  }
}

const itemRefs = ref<HTMLElement[]>([])
const listHeight = ref('auto')
const setItemRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    itemRefs.value[index] = el
  }
}
const updateListHeight = () => {
  if (itemRefs.value.length > 0) {
    const heights = itemRefs.value.slice(0, 4).map((el) => el.offsetHeight)
    const totalHeight = heights.reduce((sum, h) => sum + h, 0)
    listHeight.value = `${totalHeight}px`
  }
}

onUpdated(() => {
  nextTick(updateListHeight)
})

const debouncedFetchSuggestions = debounce(fetchSuggestions, 200)

watch(inputText, () => {
  debouncedFetchSuggestions()
})
</script>

<style lang="scss" scoped>
.suggest {
  position: relative;

  &__title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;

    &--required {
      color: red;
      font-weight: bold;
    }
  }

  &__input-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border: 1px solid #ccc;
    padding: 8px 12px;
    border-radius: 5px;
    background: #fff;
    position: relative;
    min-height: 50px;
    height: auto;

    input {
      padding: 8px 0;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;
  }

  &__tag {
    background-color: #7c98b6;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    margin-right: 5px;
  }

  &__tag-remove {
    cursor: pointer;
    margin-left: 8px;
    padding: 3px;
    color: white;
    &:hover {
      color: #ff4d4d;
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    overflow-y: auto;
    z-index: 10;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    gap: 10px;

    &:hover {
      background: #f0f0f0;
    }

    &--active {
      background-color: #dbeafe;
    }
  }

  &__error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
