<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlagIcon, LockClosedIcon, LockOpenIcon, NoSymbolIcon } from '@heroicons/vue/16/solid'
import {
  dataSets,
  diseases,
  features,
  methods,
  publications,
  regions,
  units,
} from '../data/reference_data_sets.json'
import TermRef from './TermRef.vue'
import SetFilter from './SetFilter.vue'

const data = computed(() => dataSets.map(populateReferences))

const filters = ref({
  publication: { value: '', keys: ['publication.name'] },
  disease: { value: undefined, keys: ['disease.iri'] },
  region: { value: undefined, keys: ['region.iri'] },
  feature: { value: undefined, keys: ['feature.iri'] },
  method: { value: undefined, keys: ['method.iri'] },
  access: { value: undefined, keys: ['dataSet.access'] },
})

function publicationByYear(row: { publication: { name: string; year: number } }) {
  return `${row.publication.year} - ${row.publication.name}`
}

// @ts-expect-error TS7053
function populateReferences(dataSet) {
  const d = { ...dataSet }
  // @ts-expect-error TS7053
  d.publication = publications[d.publication]
  // @ts-expect-error TS7053
  d.disease = diseases[d.disease]
  // @ts-expect-error TS7053
  d.region = regions[d.region]
  // @ts-expect-error TS7053
  d.feature = features[d.feature]
  // @ts-expect-error TS7053
  d.domainRanges?.forEach((r) => {
    // @ts-expect-error TS7053
    r.feature = features[r.feature]
    // @ts-expect-error TS7053
    r.unit = units[r.unit]
    return r
  })
  // @ts-expect-error TS7053
  d.unit = units[d.unit]
  // @ts-expect-error TS7053
  d.method = methods[d.method]
  return d
}
</script>

<template>
  <div class="overflow-y-auto rounded-box border border-base-content/10 bg-base-100">
    <v-table :data="data" :filters="filters" class="table table-zebra table-xs table-pin-rows">
      <template #head>
        <tr class="bg-base-300 primary-header">
          <v-th :sort-key="publicationByYear" default-sort="desc" class="select-none"
            >Publication</v-th
          >
          <v-th sort-key="disease.name" class="select-none">Disease</v-th>
          <v-th sort-key="region.name" class="select-none">Region</v-th>
          <v-th sort-key="feature.name" class="select-none">Feature</v-th>
          <v-th sort-key="unit.name" class="select-none">Unit</v-th>
          <v-th sort-key="method.abbreviation" class="select-none">Method</v-th>
          <th class="select-none">Domain ranges</th>
          <v-th sort-key="dataSet.format" class="select-none">Data set</v-th>
          <th></th>
        </tr>
        <tr class="bg-base-300 secondary-header">
          <td><input v-model="filters.publication.value" type="text" class="input input-xs" /></td>
          <td>
            <set-filter v-model="filters.disease.value" :options="data.flatMap((u) => u.disease)" />
          </td>
          <td>
            <set-filter v-model="filters.region.value" :options="data.flatMap((u) => u.region)" />
          </td>
          <td>
            <set-filter v-model="filters.feature.value" :options="data.flatMap((u) => u.feature)" />
          </td>
          <td></td>
          <td>
            <set-filter v-model="filters.method.value" :options="data.flatMap((u) => u.method)" />
          </td>
          <td></td>
          <td>
            <set-filter
              v-model="filters.access.value"
              :options="data.flatMap((u) => ({ name: u.dataSet.access, iri: u.dataSet.access }))"
            />
          </td>
          <td></td>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="(row, i) in rows" :key="i">
          <td>
            <a
              :href="row.publication?.url"
              target="_blank"
              class="tooltip tooltip-right"
              :data-tip="row.publication?.citation"
            >
              {{ row.publication?.name }}
              {{ row.publication?.year }}
            </a>
          </td>
          <td><term-ref :term="row.disease" /></td>
          <td><term-ref :term="row.region" /></td>
          <td><term-ref :term="row.feature" /></td>
          <td><term-ref :term="row.unit" /></td>
          <td>
            <term-ref v-if="row.method" :term="row.method" />
          </td>
          <td>
            <div v-for="(range, i) in row.domainRanges" :key="i">
              <term-ref :term="range.feature" />:
              <span v-if="range.values">
                {{ range.values.join(', ') }}
              </span>
              <span v-else>
                {{ range.min }} - {{ range.max }}
                <term-ref :term="range.unit" />
              </span>
            </div>
          </td>
          <td>
            <div
              class="tooltip"
              :data-tip="
                row.dataSet.access === 'public'
                  ? 'Public'
                  : row.dataSet.access === 'restricted'
                    ? 'Login required'
                    : 'On request to authors'
              "
            >
              <lock-open-icon v-show="row.dataSet.access === 'public'" class="inline size-3 mr-1" />
              <lock-closed-icon
                v-show="row.dataSet.access === 'restricted'"
                class="inline size-3 mr-1"
              />
              <no-symbol-icon
                v-show="row.dataSet.access === 'on request'"
                class="inline size-3 mr-1"
              />
              <term-ref
                v-if="row.dataSet"
                :term="{ name: row.dataSet.format, iri: row.dataSet.source }"
              />
            </div>
          </td>
          <td>
            <a
              :href="`https://github.com/CrescNet/references/issues/new?template=update_reference_data.md&title=Update+${row.publication?.name}+${row.publication?.year}+${row.feature?.name}`"
              target="_blank"
              class="tooltip tooltip-left inline"
              data-tip="Report an issue about this data set."
              ><flag-icon class="size-3 text-yellow-500"
            /></a>
          </td>
        </tr>
      </template>
    </v-table>
  </div>
</template>

<style lang="css">
th.v-th svg {
  display: inline;
}
.primary-header {
  box-shadow: inset 0 -5px 0 0 var(--color-base-300);
}
.secondary-header {
  top: 29.5px;
}
</style>
