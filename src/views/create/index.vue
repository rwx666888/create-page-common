<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>初始化项目环境</span>
      </div>
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="auto"
        :rules="rules"
      >
        <el-form-item
          label="swagger:"
          :prop="formData.docType"
          class="is-required"
        >
          <el-input
            v-model.trim="formData[formData.docType]"
            placeholder=""
            style="width: 800px;"
            :readonly="formData.docType!='cUrl'"
          >
            <el-select
              slot="prepend"
              v-model="formData.docType"
              style="width: 150px;"
              @change="onChangeFn"
            >
              <el-option label="远程url地址" value="cUrl" />
              <el-option label="swagger文档" value="cDocDesc" />
            </el-select>
            <el-button
              v-if="formData.docType!='cUrl'"
              slot="append"
              icon="el-icon-edit-outline"
              @click="dialogVisible=true"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="本地项目根目录:" prop="localProjectPath">
          <el-input
            v-model.trim="formData.localProjectPath"
            placeholder="D:\xxx\xxx"
            style="width: 800px;"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fnGetCatalog">提交</el-button>
          <el-button @click="fnReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-divider v-if="projectInfo.title" />
      <el-form v-if="projectInfo.title" class="pannel-info">
        <el-form-item label="本地项目名称:">
          <span class="sec-color">{{ projectInfo.pjtTitle }}</span>
        </el-form-item>
        <el-form-item label="本地项目路径:">
          <span class="sec-color">{{ projectInfo.pjtPath }}</span>
        </el-form-item>
        <el-form-item label="API名称:">
          <span class="sec-color">{{ projectInfo.title }}</span>
        </el-form-item>
        <el-form-item label="API描述:">
          <span class="sec-color">{{ projectInfo.description }}</span>
        </el-form-item>
        <el-form-item label="API版本:">
          <span class="sec-color">{{ projectInfo.version }}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="支持 YAML 及 JSON 格式的swagger"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      @close="dialogCloseFn"
    >
      <el-input
        v-model="tempCdoc"
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 20}"
        placeholder="请输入内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="yamlOrjsonFormatFn">格式转换</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="tempCdoc = ''">清 空</el-button>
        <el-button type="primary" @click="cdocSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getCatalog, getProjectInfo
} from '../../apis/create-page.js'
import {
  set as dbSet, get as dbGet, del as dbDel
} from 'idb-keyval'
import { isEmptyObject } from '@/utils/index.js'

const com_ = require('create-vue-page-npm').createApi

export default {
  name: 'CreateIndex',
  components: {},
  data () {
    var validDoc = (rule, value, callback) => {
      if (this.formData.docType === 'cUrl') {
        callback()
      } else {
        console.log('--this.formData.cDoc', this.formData.cDoc)
        if (com_.validSwaggerDoc(this.formData.cDoc)) {
          callback()
        } else {
          callback(new Error('请输入有效的swagger文档'))
        }
      }
    }

    return {
      formData: {
        cUrl: '',
        cUrlLoading: false,
        localProjectPath: '',
        docType: 'cUrl', // 文档的类型，cUrl ：url模式，cDocDesc：文档模式
        cDoc: '',
        cDocDesc: '点击右侧按钮输入swagger文档，支持YAML与JSON 格式' // 文档的描述信息
      },
      tempCdoc: '', // 临时数据
      projectInfo: {
        title: null
      },
      rules: {
        cUrl: [
          {
            required: true, message: '不能为空，格式：https://xx', trigger: 'blur'
          }
        ],
        localProjectPath: [
          {
            required: true, message: '请填写项目根目录', trigger: 'blur'
          }
        ],
        cDocDesc: [
          {
            validator: validDoc, trigger: 'blur'
          }
        ]
      },
      dialogVisible: false

    }
  },
  computed: {},
  watch: { },
  mounted () {
    this.init()
  },
  created () {},
  methods: {
    fnReset () {
      try {
        dbDel('cusCatalogDB')
      } catch (err) {
        console.log('--err', err)
      }

      const oldData = this.$options.data()
      this.formData = oldData.formData
      this.projectInfo = oldData.projectInfo
    },
    fnGetCatalog () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let data_ = {}
          if (this.formData.docType === 'cUrl') {
            if (this.formData.cUrl) {
              let res = await getCatalog(this.formData.cUrl).catch(_ => { return null })
              if (res) {
                if (typeof res === 'object') {
                  res = JSON.stringify(res)
                }
                data_ = com_.makeDataFn(res)
              }
            }
          } else {
            data_ = com_.makeDataFn(this.formData.cDoc)
          }
          console.log('------', JSON.parse(JSON.stringify(data_)))

          if (!isEmptyObject(data_.data)) {
            const uniqueTmp_ = {}
            const uniqueArr_ = []
            Object.keys(data_.data).forEach((v) => {
              const t_ = data_.data[v].name
              if (uniqueTmp_[t_]) {
                uniqueArr_.push(t_)
              } else {
                uniqueTmp_[t_] = true
              }
            })
            if (uniqueArr_.length) {
              this.$alert('API名称：' + uniqueArr_.join(', ') + '; 存在重复，请修正yaml文件')
            } else {
              const project_ = await getProjectInfo({ path: this.formData.localProjectPath }).catch(_ => { return {} })
              dbSet('cusCatalogDB', {
                info: data_.info,
                items: data_.data,
                project: {
                  pjtTitle: project_.title || '未识别到项目名称',
                  pjtPath: this.formData.localProjectPath
                }
              }).then(() => {
                console.log('DB OK!')
                this.init()
              }).catch((err) => console.log('DB err!', err))
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init () {
      dbGet('cusCatalogDB').then((val) => {
        // console.log(val.info)
        if (val) {
          this.projectInfo = {
            ...val.info, ...val.project
          }
        }
      }).catch((err) => console.log('DB err!', err))
    },
    choiceFile () {
      this.$refs['t-file'].dispatchEvent(new MouseEvent('click'))
      console.log(this.$refs['t-file'])
    },
    onChangeFn (val) {
      this.$nextTick(_ => {
        this.$refs.ruleForm.validateField(val)
      })
    },
    dialogCloseFn () {
      if (this.formData.cDoc && this.formData.cDoc.length) {
        this.formData.cDocDesc = '已设置文档：' + this.formData.cDoc.substr(0, 60)
      } else {
        this.formData.cDocDesc = '点击右侧按钮输入swagger文档，支持YAML与JSON 格式'
      }
    },
    // 格式化文档
    yamlOrjsonFormatFn () {
      this.tempCdoc = com_.formatYamlStr(this.tempCdoc)
    },
    cdocSubmit () {
      this.formData.cDoc = this.tempCdoc
      this.dialogVisible = false
      this.$nextTick(_ => {
        this.$refs.ruleForm.validateField('cDocDesc')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pannel-info{
  ::v-deep .el-form-item{
    margin-bottom: 0px;
  }
}
.sec-color{
  color: #606266;
}
.box-card{
  margin-top: 15px;
}
</style>
