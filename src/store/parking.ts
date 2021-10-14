import { writable } from 'svelte/store'

function useLiveState() {
  const { subscribe, set, update } = writable(false)
}
