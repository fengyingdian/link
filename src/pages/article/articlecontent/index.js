
// components/articlecard/index.js
import { fetchFormattedArticle } from '../../../service/api';
import wxParser from '../../../wxParser/index';
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
    commentHandlerHeight: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInit() {
      const that = this;
      const { url } = that.data;
      fetchFormattedArticle({ articleId: '0', url, isParseHtml: true })
        .then((res) => {
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

          that.setData({
            show: true,
          });
        });
    },
  },
});
