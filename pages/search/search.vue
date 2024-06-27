<template>
  <view>
    <view class="search-container">
<!--      <view class="search-box" @click="showSearchHistory">-->
<!--        <uni-icons type="search" size="18" color="#999"></uni-icons>-->
<!--        <text class="search-placeholder">{{ $t('searchPlaceholder') }}</text>-->
<!--      </view>-->

    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="showHistory">
      <span>{{ $t('search.history') }}</span>
      <view class="history-clear" @click="clearSearchHistory">

        <text>{{ $t('search.clearHistory') }}</text>
<!--        <uni-icons type="trash" size="18" color="#999"></uni-icons>-->
        <image src="../../static/trash.png" style="width: 24px;height: 24px"></image>
      </view>
      <view class="history-card-container">
        <view class="history-card" v-for="item in searchHistory" @click="selectHistory(item)">
          <text class="history-text">{{ item }}</text>
<!--          <uni-icons type="closeempty" size="16" color="#999" @click.stop="deleteHistory(item)"></uni-icons>-->
        </view>
      </view>
    </view>
    <view class="f-header m-t">
      <image src="/static/icon_recommend_product.png"></image>
      <view class="tit-box">
        <text class="tit">{{$t('home.gussULike')}}</text>
        <text class="tit2">{{$t('home.gussULikeLabel')}}</text>
      </view>
      <text class="yticon icon-you" v-show="false"></text>
    </view>

    <view class="guess-section">
      <view v-for="(item, index) in recommendProductList" :key="index" class="guess-item" @click="navToDetailPage(item)">
        <view class="image-wrapper">
          <image :src="item.pic" mode="aspectFill"></image>
        </view>
        <text class="title clamp">{{item.name}}</text>
        <text class="title2 clamp">{{item.subTitle}}</text>
        <text class="price">￥{{item.price}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import {fetchRecommendProductList} from "../../api/home";

export default {
  data() {
    return {
      showHistory: true,
      searchHistory: [],
      recommendProductList: [],
      recommendParams: {
        pageNum: 1,
        pageSize: 4
      },
    }
  },
  onLoad() {
    // this.initTitleNView()
    this.loadSearchHistory()
    fetchRecommendProductList(this.recommendParams).then(response => {
      this.recommendProductList = response.data;
      // uni.stopPullDownRefresh();
    })
  },
  methods: {
    onNavigationBarSearchInputChanged: async function(res) {
      console.log("change......")
      // this.handleSearch(res.text)
    },
    onNavigationBarSearchInputConfirmed: async function(res) {
      console.log("Confirm......")
      this.handleSearch(res.text)
    },
    showSearchHistory() {
      this.showHistory = true
    },
    selectHistory(keyword){
      // var webView = this.$mp.page.$getAppWebview();
      // webView.setTitleNViewSearchInputText(keyword)
      this.handleSearch(keyword)
    },
    handleSearch(keyword) {
      // 保存搜索歷史
      this.saveSearchHistory(keyword)
      // 處理搜索邏輯
      console.log('搜索關鍵字:', keyword)
      uni.navigateTo({
        url: `/pages/product/list?keyword=${keyword}`
      })
    },
    deleteHistory(keyword) {
      // 從搜索歷史中刪除
      this.searchHistory = this.searchHistory.filter(item => item !== keyword)
      this.saveSearchHistory()
    },
    loadSearchHistory() {
      // 從緩存中加載搜索歷史
      this.searchHistory = uni.getStorageSync('searchHistory') || []
    },
    clearSearchHistory() {
      // 清除全部搜索歷史
      this.searchHistory = []
      this.saveSearchHistory()
    },
    //商品详情页
    navToDetailPage(item) {
      let id = item.id;
      uni.navigateTo({
        url: `/pages/product/product?id=${id}`
      })
    },
    saveSearchHistory(keyword) {
      // 保存搜索歷史到緩存
      if (keyword) {
        // 如果傳入了關鍵字,則添加到歷史記錄
        if (!this.searchHistory.includes(keyword)) {
          this.searchHistory.unshift(keyword)
          if (this.searchHistory.length > 10) {
            this.searchHistory.pop() // 保留最多10條歷史記錄
          }
        }
      }
      uni.setStorageSync('searchHistory', this.searchHistory)
    }
  }
}
</script>


<style scoped lang="scss">
.search-container{
  //padding: 16px;
}
.search-history {
  padding: 16px;
}

.history-clear {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
  cursor: pointer;
  margin-top: -20px;
}

.history-clear uni-icons {
  margin-left: 6px;
}

.history-card-container {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
}

.history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px 12px;
  margin: 6px;
  flex: 0 0 calc(50% - 12px);
  cursor: pointer;
}

.history-text {
  font-size: 14px;
  color: #333;
  flex: 1;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guess-section {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  background: #fff;

  .guess-item {
    display: flex;
    flex-direction: column;
    width: 48%;
    padding-bottom: 40upx;

    &:nth-child(2n+1) {
      margin-right: 4%;
    }
  }

  .image-wrapper {
    width: 100%;
    height: 330upx;
    border-radius: 3px;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  .image-wrapper-brand {
    width: 100%;
    height: 150upx;
    border-radius: 3px;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  .title {
    font-size: $font-lg;
    color: $font-color-dark;
    line-height: 80upx;
  }

  .title2 {
    font-size: $font-sm;
    color: $font-color-light;
    line-height: 40upx;
  }

  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 1;
  }
}
.f-header {
  display: flex;
  align-items: center;
  height: 140upx;
  padding: 6upx 30upx 8upx;
  background: #fff;

  image {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    margin-right: 20upx;
  }

  .tit-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tit {
    font-size: $font-lg +2upx;
    color: #font-color-dark;
    line-height: 1.3;
  }

  .tit2 {
    font-size: $font-sm;
    color: $font-color-light;
  }

  .icon-you {
    font-size: $font-lg +2upx;
    color: $font-color-light;
  }

  .timer {
    display: inline-block;
    width: 40upx;
    height: 36upx;
    text-align: center;
    line-height: 36upx;
    margin-right: 14upx;
    font-size: $font-sm+2upx;
    color: #fff;
    border-radius: 2px;
    background: rgba(0, 0, 0, .8);
  }
}
</style>