<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/16/solid'
import ReferenceDataTable from './components/ReferenceDataTable.vue'
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
            >CrescNet</a
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
    <p>
      Welcome to our central hub for reference data on bodily features. Our goal is to provide a
      comprehensive directory of available datasets, linking you directly to the original sources.
      While we don't host the data itself, we aim to be the go-to resource for discovering and
      accessing this vital information.
      <strong
        >Please be aware that each dataset is governed by its own licensing terms and conditions,
        which users are responsible for reviewing and complying with.</strong
      >
    </p>

    <div class="flex justify-center">
      <a
        href="https://github.com/CrescNet/references/issues/new?template=new_reference_data.yml"
        target="_blank"
        class="btn btn-primary"
        ><plus-icon class="size-5" /> Add new reference data set</a
      >
    </div>

    <reference-data-table class="flex-1" />
  </main>

  <footer
    class="flex-auto footer footer-horizontal footer-center bg-base-300 text-base-content p-2"
  >
    <p>Copyright © {{ new Date().getFullYear() }} - CrescNet</p>
  </footer>
</template>
