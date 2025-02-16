<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel()

const props = defineProps<{
  label?: string
  options: ({ name: string; abbreviation?: string; iri?: string } | undefined)[]
}>()

const uniqueOptions = computed(() =>
  [...new Map(props.options?.filter((e) => !!e).map((o) => [o.iri, o])).values()].sort((a, b) =>
    (a.abbreviation || a.name).localeCompare(b.abbreviation || b.name),
  ),
)

const localOptions = computed(() => [
  { name: 'All', iri: undefined as string | undefined },
  ...uniqueOptions.value,
])
</script>

<template>
  <label v-if="label" class="fieldset-label">{{ label }}:</label>
  <select v-model="model" class="select select-xs">
    <option v-for="option in localOptions" :key="option.iri" :value="option.iri">
      {{ option.abbreviation || option.name }}
    </option>
  </select>
</template>
