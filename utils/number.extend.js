(function (proto) {
  // 加法
  proto.add = function (v1) {
    var data = getAreas(v1, this);
    return (data.v1Long + data.v2Long) / Math.pow(10, data.maxLen)
  };

  // 减法
  proto.sub = function (v1) {
    return this.add(-v1);
  };

  // 乘法
  proto.mul = function (v1 , fixed = 2) {
    var data = getAreas(v1 , this);
    return +(data.v1Long2 * data.v2Long2 / Math.pow(10, data.lenCount)).toFixed(fixed)
  };

  // 除法
  proto.div = function(v2 , fixed = 2){
    return +(this / v2).toFixed(fixed);
  };


  // 获取基础参数
  function getAreas(v1, v2) {
    var len1 = 0, len2 = 0; // 小数位数
    try { len1 = v1.toString().split(".")[1].length } catch (e) { }
    try { len2 = v2.toString().split(".")[1].length } catch (e) { }

    var maxLen = Math.max(len1, len2);
    return {
      maxLen: maxLen, // 最大小数位数
      lenCount: len1 + len2, // 总共的小数位数
      len1 : len1,
      len2 : len2,
      v1Long: toLong(v1, maxLen), // 最大小数位数后的整数
      v1Long2 : v1.toString().replace('.' , ''), // 去小数位数后的整数
      v2Long: toLong(v2, maxLen), // 
      v2Long2: v2.toString().replace('.', ''),
    }
  }

  // 转换为整数型
  function toLong(val, max) {
    return +val.toFixed(max).replace('.', '');
  }
}(Number.prototype));