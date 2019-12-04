import { inneraudio } from '../../../behavior/inneraudio/index';

Component({
  behaviors: [inneraudio],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          this.init();
        }
      },
    },
  },

  data: {
  },

  pageLifetimes: {
    show() {

    },
    hide() {

    },
  },

  methods: {
    onPlay() {
      const { isPlay = false } = this.data;
      if (isPlay) {
        this.stop();
      } else {
        this.play();
      }
    },
    onDelete() {
      this.stop();
      this.triggerEvent('delete');
    },
  },
});
