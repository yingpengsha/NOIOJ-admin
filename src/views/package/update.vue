<template>
  <div class="app-container">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px">
      <el-form-item label="题包封面">
          <el-upload
            :action="`${API_ROOT}/packet/temp`"
            list-type="picture-card"
            :limit="1"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
      </el-form-item>
      <el-form-item label="题包名称" style="width:500px">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="题包来源">
        <el-radio-group v-model="form.originClass">
          <el-radio :label="0">信奥训练平台</el-radio>
          <el-radio :label="1">学校/组织</el-radio>
          <el-radio :label="2">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number v-model="form.price" :precision="2" :step="10" :min="0" :max="300"></el-input-number>
      </el-form-item>
      <el-form-item label="题包介绍" class="input" style="width:700px">
        <Tinymce ref="editor" v-model="form.introduce" height="500px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_ROOT } from '@/utils/request'
import * as packageAPI from '@/api/package'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'UpdatePackage',
  data() {
    return {
      form: {
        image: null,
        name: '',
        originClass: 0,
        introduce: '',
        price: 99
      },
      rules: {
        name: [{ required: true, message: '请输入题包标题', trigger: 'blur' }],
        image: [{ required: true, message: '请输入题包封面', trigger: 'blur' }],
        originClass: [{ required: true, message: '请输入题包来源', trigger: 'blur' }],
        introduce: [{ required: true, message: '请输入题包详情', trigger: 'blur' }],
        price: [{ required: true, message: '请输入题包发布价格', trigger: 'blur' }]
      },
      fileList: [],
      imageList: {},
      dialogImageUrl: '',
      dialogVisible: false,
      API_ROOT
    }
  },
  components: {
    Tinymce
  },
  methods: {
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '只支持1张图片!'
      })
    },
    handleSuccess(response, file) {
      console.log(response)
      const url = response.data.split('/')
      this.imageList[file.uid] = url[url.length - 1]
      this.form.image = url[url.length - 1]
    },
    handleRemove(file, fileList) {
      delete this.imageList[file.uid]
      this.form.image = null
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          packageAPI.update(this.form)
            .then((result) => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$router.push({ path: '/package/detail/' + this.$route.params.id })
            })
        } else {
          return false
        }
      })
    },
    getPackageData() {
      packageAPI.queryById(this.$route.params.id)
        .then((result) => {
          console.log(result)
          this.form = result.data
          const url = result.data.image.split('/')
          this.fileList.push({
            name: url[url.length - 1],
            url: this.form.image
          })
          this.imageList[url[url.length - 1]] = url[url.length - 1]
        })
    }
  },
  created() {
    this.getPackageData()
  }
}
</script>
