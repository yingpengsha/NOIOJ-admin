<template>
  <div class="app-container">
    <el-card body-style="width:100%;display:flex;" style="margin-bottom:20px;" v-loading="packageLoading">
      <div slot="header" class="clearfix">
        <span>题包概要</span>
        <el-tag style="margin-left:10px" :type="statusClass[packageInfo.status+1].type">
          {{ statusClass[packageInfo.status+1].name }}
        </el-tag>
        <el-button style="margin-left:10px" size="small" :type="buttonClass[packageInfo.status+1].type"
          @click="handleToChangeStatus(buttonClass[packageInfo.status+1].value)"
        >
          {{ packageInfo.status ? buttonClass[packageInfo.status+1].name : '/' }}
        </el-button>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleToUpdatePackage">编辑概要</el-button>
      </div>
      <img :src="packageInfo.image" height="250px"/>
      <div class="detail">
        <h1>{{packageInfo.name}}</h1>
        <h2>价格: {{packageInfo.price}} 元</h2>
        <p>作者: {{packageInfo.author}}</p>
        <p v-html="packageInfo.introduce"></p>
      </div>
    </el-card>

    <el-card body-style="width:100%" v-loading="problemLoading">
      <div slot="header" class="clearfix">
        <span>题包题目</span>
      </div>
      <div class="filter-container" style="margin-bottom:20px">
        <el-input v-model="listQuery.title" placeholder="题目" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.difficulty" placeholder="难度" clearable class="filter-item" style="width: 100px">
          <el-option v-for="(item,key) in difficultyClasses" :key="key" :label="item.display_name" :value="item.value"/>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 1px;" type="success" icon="el-icon-edit" @click="handleCreate">增加</el-button>
      </div>

      <el-table
        :data="problemList"
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
            <span class="link-type"  @click.native.prevent="handleUpdate(scope.row.problemId)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="handleUpdate(scope.row.problemId)">编辑</el-button>
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
    </el-card>
  </div>
</template>

<script>
import * as packageAPI from '@/api/package'
import * as problem from '@/api/problem'

export default {
  name: 'PackageDetail',
  data() {
    return {
      packageLoading: true,
      problemLoading: true,
      packageInfo: {},
      problemList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        title: null,
        tags: null,
        difficulty: null,
        type: null,
        isFree: null,
        packetId: 0
      },
      difficultyClasses: [
        { value: 0, display_name: '入门' },
        { value: 1, display_name: '简单' },
        { value: 2, display_name: '中等' },
        { value: 3, display_name: '困难' },
        { value: 4, display_name: '超难' }
      ],
      statusClass: [
        { name: '编辑中', value: -1, type: 'info' },
        { name: '待审核', value: 0, type: 'warning' },
        { name: '已发布', value: 1, type: 'danger' }
      ],
      buttonClass: [
        { name: '发布', value: 0, type: 'primary' },
        { name: '取消发布', value: -1, type: 'danger' },
        { name: '取消发布', value: -1, type: 'danger' }
      ]
    }
  },
  methods: {
    handleToChangeStatus(status) {
      packageAPI.update({ packetId: this.packageInfo.packetId, status })
        .then((result) => {
          this.getPackageData()
        })
    },
    handleUpdate(id) {
      this.$router.push({ name: 'UpdatePackageProblem', params: { id }, query: { id: this.$route.params.id, name: this.packageInfo.name }})
    },
    handleCreate() {
      this.$router.push({ name: 'CreatePackageProblem', query: { name: this.packageInfo.name }})
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
    handleFilter() {
      this.listQuery.page = 1
      this.getProblemData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getProblemData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getProblemData()
    },
    handleToUpdatePackage() {
      this.$router.push({ path: '/package/update/' + this.packageInfo.packetId })
    },
    getPackageData() {
      this.packageLoading = true
      packageAPI.queryById(this.$route.params.id)
        .then((result) => {
          if (result.code) {
            this.packageInfo = result.data
          }
          this.packageLoading = false
        })
    },
    getProblemData() {
      this.problemLoading = true
      this.listQuery.packetId = this.$route.params.id
      problem.query(this.listQuery)
        .then((result) => {
          if (result.code) {
            this.total = result.data.totalCount
            this.problemList = result.data.list
          }
          this.problemLoading = false
        })
    }
  },
  created() {
    this.getPackageData()
    this.getProblemData()
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
.detail{
  width: 100%;
  margin-left: 30px;
}
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
