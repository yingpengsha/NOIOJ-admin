<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input v-model="listQuery.title" placeholder="题包名" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.originClass" placeholder="来源" clearable class="filter-item" style="width: 180px" @change="handleFilter">
        <el-option v-for="(item,key) in originClass" :key="key" :label="item.name" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 120px" @change="handleFilter">
        <el-option v-for="(item,key) in statusClass" :key="key" :label="item.name" :value="item.value"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 1px;" type="success" icon="el-icon-edit" @click="handleCreate">增加</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.packetId }}
        </template>
      </el-table-column>
      <el-table-column label="来源" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="originClass[scope.row.originClass].type">
            {{ originClass[scope.row.originClass].name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="题包名">
        <template slot-scope="scope">
          <span class="link-type" @click="handleDetail(scope.row.packetId)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目数量" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count || '免费' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? statusClass[scope.row.status].type : null">
            {{ scope.row.status ? statusClass[scope.row.status].name : '/' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.packetId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.packetId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top:10px;">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as packageAPI from '@/api/package'

export default {
  name: 'Package',
  data() {
    return {
      list: [],
      total: 0,
      loading: true,
      listQuery: {
        limit: 20,
        page: 1,
        title: null,
        originClass: null,
        userId: null,
        state: null
      },
      originClass: [
        { name: '信奥训练平台', value: 0, type: undefined },
        { name: '学校/组织', value: 1, type: 'success' },
        { name: '个人', value: 2, type: 'info' }
      ],
      statusClass: [
        { name: '编辑中', value: -1, type: 'info' },
        { name: '待审核', value: 0, type: 'warning' },
        { name: '已发布', value: 1, type: 'danger' }
      ]
    }
  },
  methods: {
    handleDetail(id) {
      this.$router.push({ path: `/package/detail/${id}` })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该题包, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        packageAPI.deleteById(id)
          .then((result) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCreate() {
      this.$router.push({ name: 'CreatePackage' })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getList() {
      this.list = []
      this.total = 0
      this.loading = true
      packageAPI.query(this.listQuery)
        .then((result) => {
          console.log(result)
          if (result.code) {
            this.total = result.data.totalCount
            this.list = result.data.list
          }
          this.loading = false
        })
    }
  },
  created() {
    this.getList()
  },
  filters: {
    formatDate(val) {
      const date = new Date(val)
      const year = date.getFullYear()
      const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate() + 1}`
      return `${year}-${month}-${day}`
    }
  }
}
</script>
