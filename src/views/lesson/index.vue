<template>
  <div class="app-container">
    <div id="lesson">
      <div class="filter-container" style="margin-bottom:20px">
        <el-input v-model="listQuery.title" placeholder="题目" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.classId" placeholder="类别" clearable class="filter-item" style="width: 120px">
          <el-option v-for="(item,key) in classes" :key="key" :label="item.name" :value="item.value"/>
        </el-select>
        <el-select v-model="listQuery.difficulty" placeholder="难度" clearable class="filter-item" style="width: 100px">
          <el-option v-for="(item,key) in difficultyClasses" :key="key" :label="item.name" :value="item.value"/>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 1px;" type="success" icon="el-icon-edit" @click="handleCreate">增加</el-button>
      </div>
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
          {{ scope.row.courseId }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类别" width="110" align="center">
        <template slot-scope="scope">
          {{ classes[scope.row.classId].name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="难度" width="110" align="center">
        <template slot-scope="scope">
          {{ difficultyClasses[scope.row.difficulty].name }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row.problemId)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节数" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.chapterCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程数" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.subsectionCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总时长" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.courseId)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleDetail(scope.row.courseId)">详情</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.courseId)">删除</el-button>
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
import * as lesson from '@/api/lesson'

export default {
  name: 'Lesson',
  data() {
    return {
      listQuery: {
        limit: 20,
        page: 1,
        title: null,
        classId: null,
        difficulty: null
      },
      list: [],
      total: 0,
      loading: true,
      classes: [
        { name: '数学', value: 0 },
        { name: '数据结构', value: 1 },
        { name: '算法', value: 2 }
      ],
      difficultyClasses: [
        { name: '入门', value: 0 },
        { name: '初级', value: 1 },
        { name: '中级', value: 2 },
        { name: '高级', value: 3 }
      ]
    }
  },
  methods: {
    handleDetail(id) {
      this.$router.push({ name: 'LessonDetail', params: { id }})
    },
    handleUpdate(id) {
      this.$router.push({ name: 'UpdateLesson', params: { id }})
    },
    handleCreate() {
      this.$router.push({ name: 'CreateLesson' })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lesson.deleteById(id)
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      lesson.query(this.listQuery)
        .then((result) => {
          this.list = result.data.list
          this.total = result.data.totalCount
          this.loading = false
        })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
#lesson{

}
</style>

