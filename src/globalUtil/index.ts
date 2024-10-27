import { showToast, showSuccessToast } from 'vant';
export default {
  /**web3钱包文本处理 */
  ellipsisWallet(value: string) {
    if (!value) return '';
    const index = value.length;
    return value.slice(0, 6) + '...' + value.slice(index - 4, index);
  },
  /**
   * 格式化时间
   * 调用 FormatDate(strDate, "yyyy-MM-dd HH:mm:ss")
   * @param strDate （中国标准时间）时间戳等都可以
   * @param strFormat 返回格式
   */
  formatDate(strDate: any, strFormat?: any) {
    if (!strDate) return;
    if (!strFormat) strFormat = 'yyyy/MM/dd HH:mm';
    switch (typeof strDate) {
      case 'string':
        strDate = new Date(strDate.replace(/-/g, '/'));
        break;
      case 'number':
        strDate = new Date(strDate);
        break;
    }
    if (strDate instanceof Date) {
      const dict: any = {
        yyyy: strDate.getFullYear(),
        M: strDate.getMonth() + 1,
        d: strDate.getDate(),
        H: strDate.getHours(),
        m: strDate.getMinutes(),
        s: strDate.getSeconds(),
        MM: ('' + (strDate.getMonth() + 101)).substr(1),
        dd: ('' + (strDate.getDate() + 100)).substr(1),
        HH: ('' + (strDate.getHours() + 100)).substr(1),
        mm: ('' + (strDate.getMinutes() + 100)).substr(1),
        ss: ('' + (strDate.getSeconds() + 100)).substr(1)
      };
      return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function (m: any) {
        return dict[m];
      });
    }
  },
  /**保留小数，向下取整，去掉末尾的0，添加数字千分位 */
  formatNumber(number: number, decimalPlaces: number = 2): string {
    if (!number) return '0';
    const strNumber = number.toString();
    const parts = strNumber.split('.');
    let integerPart = parts[0];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let decimalPart = '';
    if (parts.length > 1) {
      decimalPart = parts[1].slice(0, decimalPlaces);
    }
    let formattedNumber = integerPart;
    if (decimalPart) {
      formattedNumber += '.' + decimalPart;
    }
    return formattedNumber;
  },
  /**保留小数，向下取整，去掉末尾的0 */
  formatNumber_(number: number, decimalPlaces: number = 2): string {
    if (!number) return '0';
    const strNumber = number.toString();
    const parts = strNumber.split('.');
    let integerPart = parts[0];
    let decimalPart = '';
    if (parts.length > 1) {
      decimalPart = parts[1].slice(0, decimalPlaces);
    }
    let formattedNumber = integerPart;
    if (decimalPart) {
      formattedNumber += '.' + decimalPart;
    }
    return formattedNumber;
  },
  /**保留6位小数，向下取整，去掉末尾的0
   * 避免输出科学计数法，保证余额交易的准确性
   */
  utilFormat(numStr: string): number {
    const roundedNumber = Math.floor(Number(numStr) * 1e6) / 1e6;
    const formattedNumber = roundedNumber.toFixed(6).replace(/\.?0+$/, '');
    return Number(formattedNumber);
  },
  /**滚动到页面顶部 */
  toTop() {
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    const step = distance / 10;
    (function jump() {
      if (distance > 0) {
        distance -= step;
        window.scrollTo(0, distance);
        setTimeout(jump, 10);
      }
    })();
  },
  /**复制 */
  handleCopy(value: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand('Copy');
    document.body.removeChild(dummy);
    showToast('Copy successfully');
  },
  getTimeNum(msec) {
    if (msec > 60) {
      const d = parseInt((msec / 60 / 60 / 24).toString()); //算出天数
      const h = parseInt(((msec / 60 / 60) % 24).toString()); //算出小时数
      const m = parseInt(((msec / 60) % 60).toString()); //算出分钟数
      const dict = {
        d: d > 0 ? d + 'D' : '',
        h: h > 0 ? h + 'H' : '',
        m: m > 0 ? m + 'M' : ''
      };
      return `${dict.d}${dict.h}${dict.m}`;
    } else {
      return `1M`;
    }
  },
  getTimeNum2(startTime, endTime) {
    // const nowTime = Math.round((new Date() as any) / 1000);
    const msec = endTime - startTime;
    if (msec > 60) {
      const d = parseInt((msec / 60 / 60 / 24).toString()); //算出天数
      const h = parseInt(((msec / 60 / 60) % 24).toString()); //算出小时数
      const m = parseInt(((msec / 60) % 60).toString()); //算出分钟数
      const dict = {
        d: d > 0 ? d + '天' : '',
        h: h > 0 ? h + '时' : '',
        m: m > 0 ? m + '分' : ''
      };
      return `${dict.d}${dict.h}${dict.m}`;
    } else {
      return `1分`;
    }
  }
};
