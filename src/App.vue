<template>
  <div class="main">
    <div
      class="habr-wrapper"
    >
      <SuggestInput
        title="Пользователь или компания"
        placeholder="Введите логин"
        :fetchFunction="fetchSuggestions"
        @addItem="handleAdd"
        @removeItem="handleRemove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ApiResponse, SuggestItem } from './types'
import SuggestInput from './components/SuggestInput.vue'

const fetchSuggestions = async (searchText: string): Promise<SuggestItem[]> => {
  if (!searchText || searchText.length < 3) return []

  try {
    const response = await fetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${searchText}`)
    if (!response.ok) throw new Error(`Ошибка ${response.status}`)
    const data: ApiResponse = await response.json()
    return data.data
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Ошибка загрузки:', error.message)
    }
    else {
      console.error('Неизвестная ошибка:', error)
    }
    return []
  }
}

const selectedUsers = ref<SuggestItem[]>([])

const handleAdd = (item: SuggestItem) => {
  selectedUsers.value.push(item)
}

const handleRemove = (item: SuggestItem) => {
  selectedUsers.value = selectedUsers.value.filter((user) => user.alias !== item.alias)
}

</script>

<style lang="scss" scoped>
.habr-wrapper {
  margin: 0 auto;
  padding: 16px;
}
</style>
