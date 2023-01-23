<script setup lang="ts">

import {getFatSelect, supabase} from "../../supa";
import {useRouter} from "vue-router";
import {computed, onActivated, onMounted, ref, watch} from "vue";
import {store} from "../../supa/store";
import ItemEditor from "./ItemEditor.vue";
import {cellTitle, toPluralTitle} from "./util";
import {getOpenApi} from "../../supa/supa-openapi";
import {OpenApi, PropertyDef, RelationRef} from "../../supa/openapi-def";
import {standardEmits} from "../../utils/standardEmits";
import DataComponent from "./DataComponent.vue";

const emit = defineEmits(standardEmits)

const router = useRouter();

// const tableName = ref('[tableName')
const tableName = computed(() => {
      return router.currentRoute.value.params['name'] as string
    }
)
const filters = router.currentRoute.value.query
</script>

<template>
  <data-component
      :table-name="tableName"
      :filters="filters"
  >
  </data-component>
</template>
