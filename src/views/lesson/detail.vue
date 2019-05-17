<template>
  <div class="app-container">
    <el-button
      style="margin-bottom:20px;"
      type="success"
      @click="handleCreateChapter">
      添加章节
    </el-button>
    <el-collapse accordion v-loading="loading">
      <el-collapse-item v-for="(chapter,key) in list" :key="key">
        <template slot="title">
          <span class="title">
            {{`章节${key+1}:`}}{{chapter.title}}
          </span>
          <div style="float:right;margin-right:20px;">
            <el-button
              size="small"
              type="primary"
              @click.native="handleUpdateChapter(chapter)">
              编辑章节
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click.native="handleDeleteChapter(chapter.chapterId)">
              删除章节
            </el-button>
            <el-button
              size="small"
              type="success"
              @click.native="handleCreateSection(chapter.chapterId)">
              添加课程
            </el-button>
          </div>
        </template>
        <div style="padding:0 30px;margin-top:20px;">
          <el-table
            :data="chapter.subsectionList"
            :show-header="false"
            style="width: 100%">
            <el-table-column
              label="编号"
              width="150">
              <template slot-scope="scope">
                <span>{{ `课程 ${key+1} - ${scope.$index+1}` }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              width="250">
              <template slot-scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleUpdateSection(scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteSection(scope.row.subsectionId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog title="章节信息" :visible.sync="dialogChapter" width="40%">
      <el-form :model="chapterForm" label-width="100px">
        <el-form-item label="章节标题" style="width:500px;">
          <el-input v-model="chapterForm.title"></el-input>
        </el-form-item>
        <el-form-item label="章节介绍" style="width:600px;">
          <el-input
            v-model="chapterForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入内容">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapter = false">取 消</el-button>
        <el-button type="primary" @click="submitChapterForm">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="课程信息" :visible.sync="dialogSection" width="40%">
      <el-form :model="sectionForm" label-width="100px">
        <el-form-item label="课程视频" style="width:600px">
          <el-upload
            class="upload-demo"
            :action="`${API_ROOT}/subsection/temp`"
            multiple
            :limit="1"
            :on-success="handleSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过 1 GB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程标题" style="width:500px;">
          <el-input v-model="sectionForm.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSection = false">取 消</el-button>
        <el-button type="primary" @click="submitSectionForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as lesson from '@/api/lesson'
import * as chapter from '@/api/chapter'
import * as section from '@/api/section'
import { API_ROOT } from '@/utils/request'

export default {
  name: 'LessonDetail',
  data() {
    return {
      API_ROOT,
      list: [],
      loading: true,
      defaultProps: {
        children: 'subsectionList',
        label: 'title'
      },
      chapterForm: {
        courseId: 0,
        title: '',
        description: ''
      },
      sectionForm: {
        chapterId: 1,
        title: '',
        url: null
      },
      fileList: [],
      dialogChapter: false,
      dialogSection: false,
      method: 'create'
    }
  },
  methods: {
    handleSuccess(res) {
      const url = res.data.split('/')
      this.sectionForm.url = url[url.length - 1]
    },
    handleDeleteSection(id) {
      section.deleteById(id)
        .then((result) => {
          console.log(result)
          this.getData()
        })
    },
    handleUpdateSection(section) {
      this.sectionForm = {
        subsectionId: section.subsectionId,
        chapterId: section.chapterId,
        title: section.title,
        url: section.url
      }
      this.fileList = [{ name: section.title, url: section.url }]
      this.dialogSection = true
      this.method = 'update'
    },
    handleCreateSection(id) {
      this.sectionForm = {
        chapterId: id,
        title: '',
        url: null
      }
      this.fileList = []
      this.dialogSection = true
      this.method = 'create'
    },
    handleDeleteChapter(id) {
      chapter.deleteById(id)
        .then((result) => {
          console.log(result)
          this.getData()
        })
    },
    submitSectionForm() {
      section[this.method](this.sectionForm)
        .then((result) => {
          this.dialogSection = false
          this.getData()
        })
    },
    handleUpdateChapter(chapter) {
      this.chapterForm = {
        chapterId: chapter.chapterId,
        courseId: chapter.courseId,
        title: chapter.title,
        description: chapter.description
      }
      this.dialogChapter = true
      this.method = 'update'
    },
    handleCreateChapter() {
      this.chapterForm = {
        courseId: 0,
        title: '',
        description: ''
      }
      this.dialogChapter = true
      this.method = 'create'
    },
    submitChapterForm() {
      this.chapterForm.courseId = this.$route.params.id
      chapter[this.method](this.chapterForm)
        .then((result) => {
          this.dialogChapter = false
          this.getData()
        })
    },
    getData() {
      this.loading = true
      lesson.detail(this.$route.params.id)
        .then((result) => {
          console.log(result)
          this.list = result.data.chapterList
          this.loading = false
        })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 28px;
  margin:20px;
  font-weight: 300;

}
</style>

