<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import FormListLayout from '@/components/FormListLayout/index.vue';

const page: Page = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});
function handlePageChange(p: Page) {
  Object.assign(page, p);
}
const searchFormData = () => ({
  account: '',
});
const searchForm = reactive(searchFormData());
function search() {
  console.log(searchForm);
}
const rows = ref([]);
function reset() {
  Object.assign(searchForm, searchFormData());
  search();
}
</script>

<template>
  <FormListLayout :page="page" @page-change="handlePageChange">
    <template #form>
      <el-form inline :model="searchForm">
        <el-form-item label="账号" prop="account">
          <el-input
            v-model.trim="searchForm.account"
            placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="search()"
            >查询</el-button
          >
          <el-button :icon="Refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #operation>
      <el-button type="primary" :icon="Plus">新增账号</el-button>
    </template>
    <template #table>
      <el-table :data="rows" border stripe>
        <el-table-column label="账号" prop=""></el-table-column>
        <el-table-column label="姓名" prop=""></el-table-column>
        <el-table-column label="手机号" prop=""></el-table-column>
        <el-table-column label="创建时间" prop=""></el-table-column>
        <el-table-column label="角色" prop=""></el-table-column>
      </el-table>
    </template>
  </FormListLayout>
</template>

<style></style>
