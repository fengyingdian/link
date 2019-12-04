// components/AvatarContainer/index.js
import { addCommentLike } from '../../service/api';
import { sendClapMessage2User, sendRespondMessage2User } from '../../service/notification';
import { pageScrollTo } from '../../service/wxpromisify';

Component({
  properties: {
    url: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    comments: {
      type: Array,
      value: [],
    },
    selectedCommentId: {
      type: String,
      value: '',
    },
    isHideLastSplit: {
      type: Boolean,
      value: false,
    },
    isTop: {
      type: Boolean,
      value: false,
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
    maxlength: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedCommentBK: 'rgba(225, 40, 40, 0.05)',
  },

  ready() {
    const that = this;
    setTimeout(() => {
      that
        .createSelectorQuery()
        .select(`#comment-${that.data.selectedCommentId}`)
        .boundingClientRect((res) => {
          // Flimi.AppBase().logManager.log('comment-selector', that.data.selectedCommentId);
          if (res && res.top) {
            pageScrollTo({
              scrollTop: res.top - wx.getSystemInfoSync().statusBarHeight - 45,
              duration: 300,
            });
          }
          setTimeout(() => that.setData({ selectedCommentBK: '' }), 1000);
        })
        .exec();
    }, 1000);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInfluencer(ops) {
      const { userid, verifiedtype } = ops.currentTarget.dataset;
      if (userid && verifiedtype === 'vip') {
        wx.navigateTo({
          url: `/pages/influencer/index?userid=${userid}&flType=true`,
        });
      }
    },

    onClap(options) {
      // Flimi.AppBase().logManager.log('onClap: ', options);
      const that = this;
      const comment = (() => {
        const { item } = options.currentTarget.dataset;
        const { is_liked: isLiked, like_count: likeCount } = item;
        item.is_liked = !isLiked;
        item.like_count = isLiked ? likeCount - 1 : likeCount + 1;
        return item;
      })();
      that.setData({
        [`comments[${options.currentTarget.dataset.index}]`]: comment,
      });
      const {
        id: commentId,
        userid,
        text,
        is_liked: isLiked,
        replyId,
        rootId,
        like_count: likeCount,
      } = comment;
      const { url, title } = that.data;
      const { id: userId, nickname } = getApp().globalData.userInfo;
      addCommentLike({
        url: encodeURIComponent(url),
        userId,
        commentId,
        replyId,
        rootId,
        like: isLiked ? 1 : 0,
      })
        .catch(() => {
          // Flimi.AppBase().logManager.log('tapClap.fail', res);
        })
        .then(() => {
          // Flimi.AppBase().logManager.log('tapClap.success', res);
          this.triggerEvent('clap');
          return sendClapMessage2User({
            toUid: userid,
            url: encodeURIComponent(url),
            articleTitle: title,
            commentId,
            commentContent: text,
            fromUserName: nickname,
            timestamp: Date.now(),
            clapCount: likeCount,
          });
        })
        .then(() => {
          // Flimi.AppBase().logManager.log('sendClapMessage2User.success', res);
        })
        .catch(() => {
          // Flimi.AppBase().logManager.log('sendClapMessage2User.fail', res);
        });
    },

    onRespond(options) {
      const that = this;
      const {
        id: replyId,
        userid: toUid,
        rootId: originRootId,
        authorDisplayName: respondTo,
        text,
      } = options.currentTarget.dataset.item;

      const rootId = (() => {
        if (originRootId.length > 0) {
          return originRootId;
        }
        return replyId;
      })();

      const { url, title } = that.data;

      getApp().onRespondCommentSubmitCallback = (res) => {
        wx.showToast({
          title: '发布成功',
          duration: 1500,
        });

        // send wx notification to user
        const { nickname: fromUserName } = getApp().globalData.userInfo;
        sendRespondMessage2User({
          toUid,
          url: encodeURIComponent(url),
          articleTitle: title,
          replyId,
          commentContent: res,
          fromUserName,
          remark: `原评论: ${text}`,
          timestamp: Date.now(),
        })
          .then(() => {
            // Flimi.AppBase().logManager.log('sendRespondMessage2User.success', success);
          })
          .catch(() => {
            // Flimi.AppBase().logManager.log('sendRespondMessage2User.fail', fail);
          });
      };
      this.triggerEvent('respond', {
        url: encodeURIComponent(url),
        respondTo,
        toUid,
        replyId,
        rootId,
      });
    },

    onGetUserInfo(options) {
      const that = this;
      getApp()
        .onGotAuthorization({
          encryptedData: options.detail.encryptedData,
          iv: options.detail.iv,
        })
        .then((res) => {
          if (res) {
            wx.showToast({
              title: '登录成功',
            });
            const { type } = options.currentTarget.dataset;
            if (type === 'respond') {
              that.onRespond(options);
            } else {
              that.onClap(options);
            }
          } else {
            wx.showModal({
              title: '登录失败',
              content: '请稍后再尝试~',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#dd2324',
              success: () => {},
            });
          }
        });
    },

    onShare(options) {
      this.triggerEvent('share', {
        comment: options.currentTarget.dataset.item,
        isTop: this.data.isTop,
      });
    },
  },
});
