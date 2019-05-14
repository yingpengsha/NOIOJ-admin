<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="课程名称" prop="title" style="width:400px;">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="课程总时长" prop="time" style="width:300px;">
        <el-input v-model="form.time"></el-input>
      </el-form-item>
      <el-form-item label="课程类别" prop="classId">
        <el-select v-model="form.classId" placeholder="类别" clearable>
          <el-option v-for="(item,key) in classes" :key="key" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程难度" prop="difficulty">
        <el-select v-model="form.difficulty" placeholder="难度" clearable>
          <el-option v-for="(item,key) in difficultyClasses" :key="key" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程简介" prop="description" style="width:500px;">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="课程详情" prop="instructions" style="width:800px;">
        <Tinymce ref="editor" v-model="form.instructions" :height="250" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">立即更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as lesson from '@/api/lesson'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'UpdateLesson',
  data() {
    return {
      form: {},
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
      ],
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入课程总时长', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择课程类别', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择课程难度', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入课程简介', trigger: 'blur' }
        ],
        instructions: [
          { required: true, message: '请输入课程详情', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          lesson.update(this.form)
            .then((result) => {
              if (result.code === 1) {
                this.$message.success('更新课程成功！')
                this.$router.push({ name: 'AllLesson' })
              }
            })
        } else {
          console.log('error submit!!')
        }
      })
    },
    getData() {
      lesson.detailById(this.$route.params.id)
        .then((result) => {
          this.form = result.data
        })
    }
  },
  created() {
    this.getData()
  },
  components: {
    Tinymce
  }
}
</script>


