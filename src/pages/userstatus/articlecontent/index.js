
// components/articlecard/index.js
import wxParser from '../../../wxParser/index';
import { fetchFormattedArticle } from '../../../service/api';
import { formatDateChinese } from '../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      value: '',
      observer(newValue) {
        if (newValue) {
          this.onInit();
        }
      },
    },
  },

  data: {
    status: -1,
  },

  methods: {
    onInit() {
      const that = this;
      const { url = '' } = that.data;
      const encodedUrl = encodeURIComponent(url);
      fetchFormattedArticle({ articleId: '0', url: encodedUrl, isParseHtml: true })
        .then((res) => {
          const { data: { status = 1 } = {} } = res || {};
          if (status !== 0) {
            that.setData({
              status,
            });
            return;
          }
          const {
            data: {
              title, author, published, content,
            },
          } = res.data;

          that.setData({
            title,
            author,
            published,
            content,
            time: formatDateChinese(new Date(published)),
          });

          wxParser.parse({
            bind: 'richText',
            html: content,
            target: that,
          });

          setTimeout(() => that.setData({
            status,
          }), 300);
        });
    },

    onCancle() {
      this.triggerEvent('cancle');
    },
  },
});
