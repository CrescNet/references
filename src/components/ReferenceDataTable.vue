<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlagIcon, LockClosedIcon, LockOpenIcon, NoSymbolIcon } from '@heroicons/vue/16/solid'
import {
  diseases,
  features,
  methods,
  publications,
  regions,
  units,
} from '../data/reference_data_sets.json'
import TermRef from './TermRef.vue'
import SetFilter from './SetFilter.vue'

const data = computed(() =>
  publications.flatMap((p) =>
    p.dataSets?.map((d) => {
      const dataSet = populateReferences(d)
      dataSet.publication = p
      return dataSet
    }),
  ),
)

const filters = ref({
  publication: { value: '', keys: ['publication.name', 'publication.year'] },
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
  if (d.disease) d.disease = diseases[d.disease]
  // @ts-expect-error TS7053
  if (d.region) d.region = regions[d.region]
  // @ts-expect-error TS7053
  if (d.feature) d.feature = features[d.feature]
  // @ts-expect-error TS7053
  d.domainRanges?.forEach((r) => {
    // @ts-expect-error TS7053
    if (r.feature) r.feature = features[r.feature]
    // @ts-expect-error TS7053
    if (r.unit) r.unit = units[r.unit]
    return r
  })
  // @ts-expect-error TS7053
  if (d.unit) d.unit = units[d.unit]
  // @ts-expect-error TS7053
  if (d.method) d.method = methods[d.method]
  return d
}

function deriveRowspan(rows: [], key: string, i: number) {
  const row = rows[i]
  let count = 1
  while (i + count < rows.length && rows[i + count][key] == row[key]) {
    count++
  }
  return count
}
</script>

<template>
  <div class="overflow-y-auto rounded-box border border-base-content/10 bg-base-100">
    <v-table :data="data" :filters="filters" class="table table-zebra table-xs table-pin-rows">
      <template #head>
        <tr class="bg-base-300 primary-header text-lg">
          <v-th sort-key="disease.name" class="select-none">Disease</v-th>
          <v-th sort-key="region.name" class="select-none">Region</v-th>
          <v-th :sort-key="publicationByYear" default-sort="desc" class="select-none"
            >Publication</v-th
          >
          <v-th sort-key="feature.name" class="select-none">Feature</v-th>
          <v-th sort-key="unit.name" class="select-none">Unit</v-th>
          <v-th sort-key="method.abbreviation" class="select-none">Method</v-th>
          <th class="select-none">Domain ranges</th>
          <v-th sort-key="dataSet.format" class="select-none">Data set</v-th>
          <th></th>
        </tr>
        <tr class="bg-base-300 top-[36.5px]">
          <td>
            <set-filter v-model="filters.disease.value" :options="data.flatMap((u) => u.disease)" />
          </td>
          <td>
            <set-filter v-model="filters.region.value" :options="data.flatMap((u) => u.region)" />
          </td>
          <td><input v-model="filters.publication.value" type="text" class="input input-xs" /></td>
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
          <td
            v-show="i == 0 || row.disease != rows[i - 1].disease"
            :rowspan="deriveRowspan(rows, 'disease', i)"
            class="text-base"
          >
            <term-ref :term="row.disease" />
          </td>
          <td
            v-show="i == 0 || row.region != rows[i - 1].region"
            :rowspan="deriveRowspan(rows, 'region', i)"
            class="text-base"
          >
            <term-ref :term="row.region" />
          </td>
          <td
            v-show="i == 0 || row.publication != rows[i - 1].publication"
            :rowspan="deriveRowspan(rows, 'publication', i)"
          >
            <a
              :href="row.publication?.url"
              target="_blank"
              class="tooltip tooltip-right hover:bg-base-300 rounded p-px"
              :data-tip="row.publication?.citation"
            >
              {{ row.publication?.name }}
              {{ row.publication?.year }}
            </a>
          </td>
          <td>
            <term-ref :term="row.feature" />
          </td>
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
            <a
              v-if="row.dataSet && row.dataSet.access !== 'on request'"
              role="button"
              class="btn btn-xs tooltip inline-flex"
              :href="row.dataSet.source"
              :data-tip="
                row.dataSet.access === 'public'
                  ? 'Public'
                  : row.dataSet.access === 'restricted'
                    ? 'Login required'
                    : 'On request to authors'
              "
            >
              <lock-open-icon v-show="row.dataSet.access === 'public'" class="size-3 mr-1" />
              <lock-closed-icon v-show="row.dataSet.access === 'restricted'" class="size-3 mr-1" />
              {{ row.dataSet.format }}
            </a>
            <no-symbol-icon v-else class="size-3" />
          </td>
          <td>
            <a
              :href="`https://github.com/CrescNet/references/issues/new?template=update_reference_data.md&title=Update+${row.publication?.name}+${row.publication?.year}+${row.feature?.name}`"
              target="_blank"
              role="button"
              class="btn btn-xs tooltip tooltip-left inline-flex"
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
</style>

<style lang="css" scoped>
table tbody td {
  @apply align-top;
}
.primary-header {
  box-shadow: inset 0 -5px 0 0 var(--color-base-300);
}
</style>
