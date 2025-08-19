import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

/* ---- PrimeVue ---- */
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

// Componentss
import PrimeButton from 'primevue/button';
import PrimeDialog from 'primevue/dialog';
import PrimeInputText from 'primevue/inputtext';
import PrimeMessage from 'primevue/message';
import PrimePassword from 'primevue/password';
import PrimeFloatLabel from 'primevue/floatlabel';
import PrimePopover from 'primevue/popover';
import PrimeDataTable from 'primevue/datatable';
import PrimeColumn from 'primevue/column';
import PrimeSelectButton from 'primevue/selectbutton';
import PrimeToggleSwitch from 'primevue/toggleswitch';
import PrimeSkeleton from 'primevue/skeleton';
import PrimeTooltip from 'primevue/tooltip';
import PrimePaginator from 'primevue/paginator';
import PrimeAutocomplete from 'primevue/autocomplete';
import PrimeTag from 'primevue/tag';
import PrimeColorPicker from 'primevue/colorpicker';
import PrimeToast from 'primevue/toast';
import PrimeToastService from 'primevue/toastservice';
import PrimeRadioButton from 'primevue/radiobutton';
import PrimeRadioButtonGroup from 'primevue/radiobuttongroup';
import PrimeDivider from 'primevue/divider';

/* ---- PrimeVue ---- */

import App from './App.vue';
import router from './router';

/* ---- FontAwesome Config ---- */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, fab, far);
/* ---- FontAwesome Config ---- */

const app = createApp(App);

app.use(createPinia());
app.use(router);

/* ---- PrimeVue ---- */
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
});

app.use(PrimeToastService);

app.component('PrimeButton', PrimeButton);
app.component('PrimeDialog', PrimeDialog);
app.component('PrimeInputText', PrimeInputText);
app.component('PrimeMessage', PrimeMessage);
app.component('PrimePassword', PrimePassword);
app.component('PrimeFloatLabel', PrimeFloatLabel);
app.component('PrimePopover', PrimePopover);
app.component('PrimeDataTable', PrimeDataTable);
app.component('PrimeColumn', PrimeColumn);
app.component('PrimeSelectButton', PrimeSelectButton);
app.component('PrimeToggleSwitch', PrimeToggleSwitch);
app.component('PrimeSkeleton', PrimeSkeleton);
app.component('PrimePaginator', PrimePaginator);
app.component('PrimeAutocomplete', PrimeAutocomplete);
app.component('PrimeTag', PrimeTag);
app.component('PrimeColorPicker', PrimeColorPicker);
app.component('PrimeToast', PrimeToast);
app.component('PrimeRadioButton', PrimeRadioButton);
app.component('PrimeRadioButtonGroup', PrimeRadioButtonGroup);
app.component('PrimeDivider', PrimeDivider);

app.directive('tooltip', PrimeTooltip);

/* ---- PrimeVue ---- */

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
