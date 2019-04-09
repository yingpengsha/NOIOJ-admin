<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="所属题包名" v-show="this.form.packetId !== 0">
        <el-input v-model="$route.query.name" class="input" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="题目名称" prop="title">
        <el-input v-model="form.title" class="input"></el-input>
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <el-radio :label="0">入门</el-radio>
          <el-radio :label="1">简单</el-radio>
          <el-radio :label="2">中等</el-radio>
          <el-radio :label="3">困难</el-radio>
          <el-radio :label="4">超难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="算法/数据结构" prop="tags" class="select">
        <el-select
          v-for="(tag,index) in 8"
          @change="setTags"
          v-model="selectTags[index]"
          :key="index"
          filterable
          clearable
          :placeholder="tagName[index]"
          style="margin-right:10px;margin-bottom:10px"
        >
          <el-option
            v-for="item in tags[index]"
            :key="item.tagId"
            :label="item.name"
            :value="item.tagId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布时间" prop="inDate">
        <el-date-picker
          v-model="form.inDate"
          type="date"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="时间限制(秒)" prop="timeLimit">
        <el-input-number size="small" :min="0" v-model="form.timeLimit"></el-input-number>
      </el-form-item>
      <el-form-item label="空间限制(MByte)" prop="memoryLimit">
        <el-input-number size="small" :min="0" v-model="form.memoryLimit"></el-input-number>
      </el-form-item>
      <el-form-item label="题目介绍" prop="description">
        <el-input type="textarea" :rows="4" class="input" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="输入说明" prop="input">
        <el-input type="textarea" :rows="3" class="input" v-model="form.input"></el-input>
      </el-form-item>
      <el-form-item label="输出说明" prop="output">
        <el-input type="textarea" :rows="3" class="input" v-model="form.output"></el-input>
      </el-form-item>
      <el-form-item label="输入参照" prop="sampleInput">
        <el-input type="textarea" :rows="2" class="input" v-model="form.sampleInput"></el-input>
      </el-form-item>
      <el-form-item label="输出参照" prop="sampleOutput">
        <el-input type="textarea" :rows="2" class="input" v-model="form.sampleOutput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as tag from '@/api/tag'
import * as problem from '@/api/problem'
import * as utils from '@/utils/index'

export default {
  name: 'CreateProblem',
  data() {
    return {
      form: {
        title: '',
        description: '',
        input: '',
        output: '',
        sampleInput: '',
        sampleOutput: '',
        spj: 0,
        hint: '',
        source: 'OJ',
        inDate: new Date(),
        timeLimit: 0,
        memoryLimit: 0,
        defunct: 'Y',
        accepted: 0,
        submit: 0,
        solved: 0,
        difficulty: '',
        type: 0,
        isFree: 1,
        packetId: 0,
        tags: []
      },
      loading: true,
      tags: new Array(8),
      selectTags: new Array(8),
      tagName: ['搜索/递归/回溯', '排序', '动态规划', '数学', '其他', '树结构', '线性结构', '其他'],
      rules: {
        title: [
          { required: true, message: '请输入题目名称' }
        ],
        description: [
          { required: true, message: '请输入题目介绍' }
        ],
        input: [
          { required: true, message: '请输入题目输入参照' }
        ],
        tags: [
          { required: true, message: '算法和数据结构中至少选一个' }
        ],
        output: [
          { required: true, message: '请输入题目输出参照' }
        ],
        sampleInput: [
          { required: true, message: '请输入题目输入说明' }
        ],
        sampleOutput: [
          { required: true, message: '请输入题目输出说明' }
        ],
        difficulty: [
          { required: true, message: '请选择难度' }
        ],
        inDate: [
          { required: true, message: '请选择发布时间' }
        ],
        timeLimit: [
          { required: true, message: '请输入时间限制' }
        ],
        memoryLimit: [
          { required: true, message: '请输入空间限制' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.setTags()
      this.form.tags = this.form.tags.join()
      this.form.inDate = utils.parseTime(this.form.inDate)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          problem.upload(this.form)
            .then((result) => {
              if (result.code === 1) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$router.push({ name: 'Problem' })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTags() {
      tag.query()
        .then((result) => {
          this.filterTagsData(result.data)
        })
    },
    setTags() {
      this.selectTags.forEach(element => {
        if (element) {
          this.form.tags.push(element)
        }
      })
    },
    filterTagsData(tags) {
      for (let i = 0; i < 8; i++) {
        this.tags[i] = tags.filter(element => {
          return element.classId === i
        })
      }
      this.loading = false
    }
  },
  created() {
    this.getTags()
    if (this.$route.name === 'CreatePackageProblem') {
      this.form.packetId = this.$route.query.id
    }
  }
}
</script>

<style lang="scss" scoped>
.input{
  width:500px;
}
.select{
  width:1300px;
}
</style>
