import { inneraudio } from '../../behavior/inneraudio/index';

Component({
  behaviors: [inneraudio],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
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
      const { isPlaying = false } = this.data;
      if (isPlaying) {
        this.stop();
      } else {
        this.play();
      }
    },
    onRemove() {
      this.stop();
      this.triggerEvent('delete');
    },
  },
});
