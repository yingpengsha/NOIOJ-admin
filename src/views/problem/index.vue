<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input v-model="listQuery.title" placeholder="题目" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.isFree" placeholder="免费/付费" clearable class="filter-item" style="width: 120px">
        <el-option v-for="(item,key) in freeClasses" :key="key" :label="item.display_name" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.difficulty" placeholder="难度" clearable class="filter-item" style="width: 100px">
        <el-option v-for="(item,key) in difficultyClasses" :key="key" :label="item.display_name" :value="item.value"/>
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
          {{ scope.row.problemId }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="难度" width="110" align="center">
        <template slot-scope="scope">
          <p class="difficulty" :style="difficultyClasses[scope.row.difficulty].display_name | tagStyle">
            {{ difficultyClasses[scope.row.difficulty].display_name }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row.problemId)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属题包" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="免费/收费" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isFree ? undefined : 'success'">
            {{ freeClasses[scope.row.isFree].display_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.problemId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.problemId)">删除
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
import * as problem from '@/api/problem'

export default {
  name: 'Problem',
  data() {
    return {
      list: [],
      total: 0,
      loading: true,
      listQuery: {
        limit: 20,
        page: 1,
        title: null,
        tags: null,
        difficulty: null,
        type: null,
        isFree: null,
        packetId: null
      },
      difficultyClasses: [
        { value: 0, display_name: '入门' },
        { value: 1, display_name: '简单' },
        { value: 2, display_name: '中等' },
        { value: 3, display_name: '困难' },
        { value: 4, display_name: '超难' }
      ],
      freeClasses: [
        { value: 0, display_name: '收费' },
        { value: 1, display_name: '免费' }
      ]
    }
  },
  methods: {
    handleUpdate(id) {
      this.$router.push({ path: `/problem/update/${id}` })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        problem.deleteById(id)
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
      this.$router.push({ name: 'CreateProblem' })
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
      problem.query(this.listQuery)
        .then((result) => {
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
    },
    tagStyle(difficulty) {
      let style = 'background:'
      switch (difficulty) {
        case '入门':
          style += '#909399'
          break
        case '简单':
          style += '#67C23A'
          break
        case '中等':
          style += '#0681FF'
          break
        case '困难':
          style += '#E6A23C'
          break
        case '超难':
          style += '#F56C6C'
          break
        default:
          break
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.difficulty{
  width: 80px;
  height:28px;
  line-height: 28px;
  margin:0 auto;
  background: black;
  color: white;
  border-radius: 3px;
}
</style>
