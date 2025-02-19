<script setup lang="ts">
interface Term {
  name: string
  abbreviation?: string
  iri?: string
}

defineProps<{
  term?: Term
}>()
</script>

<template>
  <a
    v-if="term?.iri"
    :href="term.iri"
    target="_blank"
    :class="{ tooltip: term.abbreviation && term.name }"
    class="hover:bg-base-300 rounded p-px"
    :data-tip="term.name"
    >{{ term.abbreviation || term.name || 'term' }}</a
  >
  <div v-else-if="term" :class="{ tooltip: term.abbreviation && term.name }" class="hover:bg-base-300 rounded p-px" :data-tip="term.name">
    {{ term.abbreviation || term.name }}
  </div>
  <div v-else></div>
</template>
