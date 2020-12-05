<template>
  <div class="orderInfo">
    <div class="pay-Info">
      <div class="InfoText clearfix">
        <div class="info-text-title fl">{{ InfoTextTitle }}</div>
        <div class="right-Info fr" v-if="isShowRight">
          <div class="right-livery" v-if="!isLivery" @click="confirmLivery">确认收货</div>
          <div class="right-complete clearfix" v-else>
            <div class="complete fl">已完成</div>
            <div class="delete fr" @click="remove">
              <van-icon size="20" name="delete" />
            </div>
          </div>
        </div>
      </div>
      <div class="pay-Pro-box">
        <!-- 商品信息 -->
        <slot></slot>
      </div>
      <div class="pay-combined">
        <div class="pay-circle">
          <div class="circle circle-left"></div>
          <div class="circle circle-right"></div>
        </div>
        <div class="dateTime" v-if="dateTime != ''">{{ dateTime }}</div>
        <div class="paytotle">
          <div class="pay-totle-count">
            共计 <span>{{ proCount }}</span> 件
          </div>
          <div class="pay-total-money">合计 ￥{{ total | filtration }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderInfo",
  props: {
    //   标题
    InfoTextTitle: {
      type: String,
      default: "左边标题",
    },
    //   是否显示右边信息
    isShowRight: {
      type: Boolean,
      default: false,
    },
    //时间
    dateTime: {
      type: String,
      default: " ",
    },
    // 商品数量
    proCount: {
      type: Number,
      default: 0,
    },
    // 订单总金额
    total: {
      type: [Number,String],
      default: 0 | '0',
    },
     //   确认收货
    isLivery: {
      type:Boolean,
      default:false
    },
  },
  methods:{
    // 确定收货
    confirmLivery(){
      this.$emit('confirm-livery');
    },
    // 删除
    remove(){
      this.$emit('remove');
    }
  }
};
</script>

<style lang="less" scoped>
.orderInfo {
  .pay-Info {
    padding: 10px;
    margin-top: 0;

    .InfoText {
      font-size: 20px;
      font-weight: bold;
      color: #c38a60;
      background-color: #fff;
      padding: 10px;
      overflow: hidden;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
  .delete {
    margin-top: 5px;
    margin-left: 8px;
  }

  .pay-Pro-box {
    // padding-top: 10px;
    // padding-bottom: 20px;
    background-color: #fff;
    max-height: 200px;
    overflow: hidden;
    overflow-y: scroll;

    .pay-Info-box {
      max-height: 200px;
      overflow: hidden;
      overflow-y: scroll;
    }

    .pay-product-Info {
      flex: 8;
      width: calc(~"100% - 10px");
      margin-top: 15px;
      display: flex;

      &:last-child {
        margin-bottom: 15px;
      }
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

  .pay-circle {
    position: absolute;
    left: 0;
    top: -10px;
    width: 100%;
    height: 20px;
    background-color: #fff;
  }

  .pay-combined {
    padding-bottom: 5px;
    padding-top: 20px;
    background-color: #fff;
    position: relative;
  }
  .paytotle {
    width: 100%;
    height: 100%;
    display: flex;
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
  }

  .pay-totle-count {
    flex: 1;
    margin-left: 10px;
    color: #333;

    span {
      color: #c38a60;
    }
  }

  .pay-total-money {
    text-align: right;
    flex: 1;
    margin-right: 20px;
    color: #c38a60;
  }
  .dateTime {
    padding-top: 12px;
    margin-bottom: 5px;
    margin-left: 10px;
    font-size: 13px;
  }
}
</style>