Component({
  properties: {
    images: {
      type: Array,
      value: [],
      observer(val) {
        if (val && val.length > 0) {
          this.onInit(val);
        }
      },
    },
  },

  data: {},

  methods: {
    onInit(images) {
      if (images.length > 1) {
        this.setData({
          firstWidth: 1 - 1 / images.length,
          firstImage: images[0],
          restImages: images.slice(1),
          restWidth: 1 / images.length,
        });
      } else {
        this.setData({
          firstWidth: 1,
          firstImage: images[0],
          restImages: [],
          restWidth: 0,
        });
      }
    },
  },
});
