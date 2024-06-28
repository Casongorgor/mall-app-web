<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">{{$t('address.name')}}</text>
			<input class="input" type="text" v-model="addressData.name" :placeholder="$t('address.name.placeholder')" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.phone')}}</text>
			<input class="input" type="number" v-model="addressData.phoneNumber" :placeholder="$t('address.phone.placeholder')" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.zipCode')}}</text>
			<input class="input" type="number" v-model="addressData.postCode" :placeholder="$t('address.zipCode.placeholder')" placeholder-class="placeholder" />
		</view>
<!-- 		<view class="row b-b">
			<text class="tit">所在区域</text>
			<text @click="chooseLocation" class="input">
				{{addressData.province}} {{addressData.city}} {{addressData.region}}
			</text>
			<text class="yticon icon-shouhuodizhi" @click="chooseLocation"></text>
		</view> -->
    <view class="row b-b">
      <text class="tit">{{$t('address.country')}}</text>
      <!--          <uni-combox-->
      <!--              v-model="countryCode" :candidates="countryList" placeholder="请选择所在国家" emptyTips="并未找到对应的国家名称" :border="false"-->
      <!--          ></uni-combox>-->
      <uni-data-select
          :placeholder="$t('address.country.placeholder')"
          v-model="addressData.countryCode"
          :localdata="countryList"
      ></uni-data-select>
    </view>
		<view class="row b-b">
			<text class="tit">{{$t('address.area')}}</text>
			<input class="input" type="text" v-model="addressData.prefixAddress" :placeholder="$t('address.area.placeholder')" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.detail')}}</text>
			<input class="input" type="text" v-model="addressData.detailAddress" :placeholder="$t('address.detail.placeholder')" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">{{$t('address.setToDefault')}}</text>
			<switch :checked="addressData.defaultStatus==1" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">{{$t('address.confirm')}}</button>
	</view>
</template>

<script>
	import {
		addAddress,
		updateAddress,
		fetchAddressDetail
	} from '@/api/address.js';
  import UniDataSelect from "../../components/uni-data-select.vue";
  import {COUNTRIES} from "../../utils/countries";
	export default {
    components: {UniDataSelect},
		data() {
      var countryArrays = []
      if(this.$i18n.locale === 'zh-Hans'){
        countryArrays =COUNTRIES.map(obj => ({
          text: obj.chinese,
          value: obj.english
        }));
      }else{
        countryArrays =COUNTRIES.map(obj => ({
          text: obj.english,
          value: obj.english
        }));
      }
			return {
				addressData: {
					name: '',
					phoneNumber: '',
					postCode: '',
					detailAddress: '',
					default: false,
					province: '',
					city: '',
					region: '',
					prefixAddress: '',
          countryCode: null
				},
        countryList: countryArrays
			}
		},
		onLoad(option) {
			let title = this.$t('address.title.add');
			if (option.type === 'edit') {
				title = this.$t('address.title.edit');
				fetchAddressDetail(option.id).then(response=>{
					this.addressData = response.data;
					this.addressData.prefixAddress = this.addressData.province+this.addressData.city+this.addressData.region;
				});
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e) {
				this.addressData.defaultStatus = e.detail.value ? 1 : 0;
			},
			//地图选择地址
			chooseLocation() {
				uni.chooseLocation({
					success: (data) => {
						this.covertAdderss(data.address);
						this.addressData.detailAddress = data.name;
					}
				})
			},
			//将地址转化为省市区
			covertAdderss(address) {
				console.log("covertAdderss", address);
				if (address.indexOf("省") != -1) {
					this.addressData.province = address.substr(0, address.indexOf("省") + 1);
					address = address.replace(this.addressData.province, "");
					this.addressData.city = address.substr(0, address.indexOf("市") + 1);
					address = address.replace(this.addressData.city, "");
					this.addressData.region = address.substr(0, address.indexOf("区") + 1);
				} else {
					this.addressData.province = address.substr(0, address.indexOf("市") + 1);
					address = address.replace(this.addressData.province, "");
					this.addressData.city = "";
					this.addressData.region = address.substr(0, address.indexOf("区") + 1);
				}
			},
			//提交
			confirm() {
				let data = this.addressData;
				if (!data.name) {
					this.$api.msg(this.$t('address.verification.name'));
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phoneNumber)) {
					this.$api.msg(this.$t('address.verification.phone'));
					return;
				}
				if (!data.prefixAddress) {
					this.$api.msg(this.$t('address.verification.area'));
					return;
				}
				this.covertAdderss(data.prefixAddress);
				if (!data.province) {
					this.$api.msg(this.$t('address.verification.province'));
					return;
				}
				if (!data.detailAddress) {
					this.$api.msg(this.$t('address.verification.detail'));
					return;
				}
				if(this.manageType=='edit'){
					updateAddress(this.addressData).then(response=>{
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg(this.$t('address.success.update'));
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				}else{
					addAddress(this.addressData).then(response=>{
						//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
						this.$api.prePage().refreshList(data, this.manageType);
						this.$api.msg(this.$t('address.success.create'));
						setTimeout(() => {
							uni.navigateBack()
						}, 800)
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
