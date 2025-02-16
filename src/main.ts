import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// @ts-expect-error TS7016
import SmartTable from 'vuejs-smart-table'

createApp(App).use(SmartTable).mount('#app')
