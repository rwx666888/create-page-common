<!-- cmp  -->
<template>
  <el-time-picker
    v-model="dateValue"
    v-bind="merageOpts"
    v-on="$listeners"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'CusTimePicker',
  inject: ['elForm'],
  props: {
    startKey: String,
    endKey: String
  },
  data () {
    return {

    }
  },
  computed: {
    merageOpts () {
      return Object.assign(
        {
          clearable: false,
          'range-separator': '-',
          'start-placeholder': '开始时间',
          'end-placeholder': '结束时间',
          editable: false,
          'value-format': 'timestamp',
          placeholder: '选择时间范围',
          format: 'HH:mm'
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
  beforeCreate () {
  },
  created () {

  },
  mounted () {

  },
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
