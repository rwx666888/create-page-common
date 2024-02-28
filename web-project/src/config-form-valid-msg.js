module.exports = {
  itemType: {
    any: {
      label: '任何类型',
      msg: ''
    },
    string: {
      label: '字符串',
      msg: ''
    },
    number: {
      label: '数字',
      msg: '必须是数值型'
    },
    integer: {
      label: '整数类型',
      msg: '必须是整数'
    },
    float: {
      label: '浮点数类型',
      msg: '必须是浮点数'
    },
    array: {
      label: '数组',
      msg: '必须是数组'
    },
    date: {
      label: '日期',
      msg: '必须是日期'
    },
    url: {
      label: 'url',
      msg: 'url格式无效'
    },
    email: {
      label: 'email',
      msg: 'email格式无效'
    }
  },
  required: {
    msg: '{label}不能为空'
  },
  isMinMax: {
    strMsg: '{label}长度在 {min} 到 {max} 个字符',
    intMsg: '{label}必须大于 {min} 且小于 {max} '
  },
  regexp: {
    msg: ''
  }
}
