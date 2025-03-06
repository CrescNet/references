<script setup lang="ts">
import ReferenceDataTable from './components/ReferenceDataTable.vue'
import { PlusIcon } from '@heroicons/vue/16/solid'
import {
  diseases,
  features,
  methods,
  publications,
  regions,
  units,
} from './data/reference_data_sets.json'
import { computed } from 'vue'
import type { DataSet, Publication, RefDataSet, RefPublication } from './components/model'

const version = __APP_VERSION__

const data = computed(() =>
  (publications as RefPublication[]).flatMap((p) =>
    p.dataSets?.map((d) => ({
      ...populateReference(
        {
          name: p.name,
          year: p.year,
          url: p.url,
          citation: p.citation,
        },
        d,
      ),
    })),
  ),
)

function populateReference(publication: Publication, dataSet: RefDataSet) {
  const d = { publication, dataSet: dataSet.dataSet, domainRanges: [] } as unknown as DataSet
  if (dataSet.disease) d.disease = diseases[dataSet.disease as keyof typeof diseases]
  if (dataSet.region) d.region = regions[dataSet.region as keyof typeof regions]
  if (dataSet.feature) d.feature = features[dataSet.feature as keyof typeof features]
  if (dataSet.unit) d.unit = units[dataSet.unit as keyof typeof units]
  if (dataSet.method) d.method = methods[dataSet.method as keyof typeof methods]

  dataSet.domainRanges?.forEach((r, i) => {
    d.domainRanges[i] = {
      feature: features[r.feature as keyof typeof features],
      values: r.values,
      min: r.min,
      max: r.max,
    }
    if (r.unit) d.domainRanges[i].unit = units[r.unit as keyof typeof units]
    return r
  })
  return d
}
</script>

<template>
  <header>
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1 lg:flex-none">
        <div class="text-xl font-bold">
          <img src="/src/assets/logo.svg" class="w-10 inline" />
          Reference Data Collection
        </div>
      </div>
      <div class="flex flex-1 justify-end">
        <div class="flex items-stretch">
          <a href="https://crescnet.org/" target="_blank" tabindex="0" class="btn btn-ghost"
            >About CrescNet</a
          >
          <a
            href="https://github.com/CrescNet/references/"
            tabindex="0"
            target="_blank"
            class="btn btn-ghost"
            >Contribute</a
          >
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost">Theme</div>
            <ul
              tabindex="0"
              class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
            >
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Light"
                  value="light"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Dark"
                  value="dark"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="h-[calc(100vh-64px-36px)] flex flex-col gap-5 p-5">
    <div class="flex gap-5 justify-center">
      <div class="flex-none stats shadow">
        <div class="stat">
          <div class="stat-title">Total Reference Data Sets</div>
          <div class="stat-value">{{ data.length }}</div>
          <div class="stat-actions">
            <a
              href="https://github.com/CrescNet/references/issues/new?template=new_reference_data.yml"
              target="_blank"
              class="btn btn-xs btn-primary"
              ><plus-icon class="size-4" /> Add new reference data set</a
            >
          </div>
        </div>
      </div>
      <p class="w-300 flex-initial content-center">
        Welcome to our central hub for reference data on bodily features. Our goal is to provide a
        comprehensive directory of available datasets, linking you directly to the original sources.
        While we don't host the data itself, we aim to be the go-to resource for discovering and
        accessing this vital information.
        <strong
          >Please be aware that each dataset is governed by its own licensing terms and conditions,
          which users are responsible for reviewing and complying with.</strong
        >
      </p>
    </div>

    <reference-data-table :data="data" class="flex-1" />
  </main>

  <footer
    class="flex-auto footer footer-horizontal justify-between bg-base-300 text-base-content px-4 py-2"
  >
    <p>Copyright © {{ new Date().getFullYear() }} - CrescNet, Leipzig University</p>
    <p>v{{ version }}</p>
  </footer>
</template>
