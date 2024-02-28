<!-- cmp  -->
<template>
  <el-date-picker
    v-model="dateValue"
    v-bind="merageOpts"
    v-on="$listeners"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'CusDatePicker',
  inject: ['elForm'],
  props: {
    startKey: String,
    endKey: String
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      }
    }
  },
  computed: {
    merageOpts () {
      return Object.assign(
        {
          clearable: true,
          type: 'datetimerange',
          'range-separator': '-',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          editable: false,
          'value-format': 'timestamp'
        },
        this.$attrs
      )
    },
    dateValue: {
      get: function () {
        if (this.elForm.model[this.startKey] && this.elForm.model[this.endKey]) {
          return [this.elForm.model[this.startKey], this.elForm.model[this.endKey]]
        } else {
          return []
        }
      },
      // setter
      set: function (value) {
        const _value = value || []

        this.elForm.model[this.startKey] = _value[0] || ''
        this.elForm.model[this.endKey] = _value[1] || ''
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    onChange (value) {
      /* const _value = value || []

      this.elForm.model[this.startKey] = _value[0] || ''
      this.elForm.model[this.endKey] = _value[1] || '' */
    }
  }
}
</script>

<style lang="scss" scoped></style>
