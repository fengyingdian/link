import { inneraudio } from '../../behavior/inneraudio/index';

Component({
  behaviors: [inneraudio],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    isOrder: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          this.play();
        } else {
          this.stop();
        }
      },
    },
  },

  data: {
  },

  pageLifetimes: {
    show() {},
    hide() {},
  },

  methods: {
    onPlay() {
      const { isOrder = false, isPlaying = false } = this.data;
      // in current audio context
      if (isOrder) {
        if (isPlaying) {
          this.stop();
        } else {
          this.play();
        }
      // not in current audio context
      // need to tell the parent to order
      } else {
        this.triggerEvent('play');
      }
    },
  },
});
