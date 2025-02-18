export interface SuggestItem {
  id: number,
  alias: string,
  name?: string,
  type: 'user' | 'company',
  avatar?: string,
}

export interface ApiResponse {
  data: SuggestItem[],
}
export enum Key {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  Enter = 'Enter',
  Escape = 'Escape',
}
