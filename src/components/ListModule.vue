<template>
  <div class="listModule">
    <div class="pay-Info-box">
      <div class="pay-product-Info" >
        <div class="pay-info-img">
          <img class="auto-img" :src="item.small_img || item.smallImg" alt="" />
        </div>
        <div class="pay-info-con">
          <div class="pay-info-text">
            <div>
              <div class="pay-name">{{ item.name }}</div>
              <div class="pay-rule">{{ item.rule }}</div>
            </div>
            <div class="pay-enname">{{ item.enname }}</div>
          </div>
          <div class="pay-count-box">
            <div class="pay-price">￥{{ item.price }}</div>
            <div>
              <div class="count-box" v-if="!isNumerical">x{{ item.count }}</div>
              <div class="count-box" v-else>
                <van-stepper
                  v-model="vanCount"
                  theme="round"
                  button-size="20"
                  disable-input
                  @change="changeCount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListModule",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    isNumerical: {
      type: Boolean,
      default: false,
    },
  
  },
  data() {
    return {
      vanCount: 0,
    };
  },
  created() {
    //
    this.vanCount = this.item.count;
    //
  },
  methods: {
    changeCount() {
      //
      //
      this.item.count = this.vanCount;
      this.$emit("coo", this.item);
    },
    
    
  },
};
</script>

<style lang="less" scoped>
.listModule {
  width: 100%;
  .pay-Info-box {
    margin-left: 10px;
    margin-top: 10px;
  }

  .pay-product-Info {
    flex: 8;
    display: flex;

    &:last-child {
      margin-bottom: 15px;
    }
  }
  .pay-info-img {
    width: 80px;
    height: 80px;
    margin-left: 20px;
  }

  .pay-info-con {
    flex: 1;
    width: calc(~"100% - 50px");
    width: 100%;
    margin-left: 15px;
    margin-right: 10px;
  }

  .pay-info-text {
    > div {
      display: flex;
    }
  }

  .pay-name {
    flex: 1;
    font-size: 16px;
    margin-right: 20px;
  }

  .pay-rule {
    flex: 1;
    font-size: 14px;
    color: #999;
    line-height: 19px;
    text-align: left;
  }

  .pay-enname {
    font-size: 14px;
    color: #999;
  }

  .pay-count-box {
    display: flex;
    margin-top: 10px;
  }

  .pay-price {
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
  }

  .count-box {
    font-size: 16px;
    line-height: 30px;
  }
}
</style>