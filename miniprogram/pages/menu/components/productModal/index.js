// pages/menu/components/productModal/index.js
import {isEmptyObject} from '../../../../utils/tools'
Component({
  observers: {
    'good': function( obj) {
      if(isEmptyObject(obj)){
        return false
      }
      this.getGoodSelectedProps();
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    goodDetailModalVisible: {
      type: Boolean,
      value: false
    },
    good: {
      type: Object,
      value: {}
    },
    goodSelected: null
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 关闭饮品详情模态框
     */
    closeGoodDetailModal () {
      this.triggerEvent('closeModal');
    },

    /**
     * 改变默认属性值
     * @param e
     */
    changePropertyDefault(e) {
      let {id, index} = e.currentTarget.dataset;
      let good = this.data.good
      good.number = 1;
      good.property[index].values = good.property[index].values.map(value => {
        if (value.id === id) {
          return {...value, is_default: 1}
        }
        return {...value, is_default: 0}
      })
      this.triggerEvent('changePropertyDefault',{good})
    },

    /**
     * 计算当前饮品所选属性
     * @returns {string}
     */
    getGoodSelectedProps () {
      let goodSelected = '';
      if (this.data.good.use_property) {
        let props = [];
        this.data.good.property.forEach(({values}) => {
          values.forEach((value) => {
            if (value.is_default) {
              props.push(value.value);
            }
          });
        });
        goodSelected = props.join('，');
      }
      this.setData({
        goodSelected
      });
    },
    /**
     * 增加数量
     */
    handlePropertyAdd() {
      let good = this.data.good
      good.number = good.number += 1
      this.triggerEvent('changeGoodNum',{good})
    },
    /**
     * 减少数量
     */
    handlePropertyReduce() {
      if(this.data.good.number === 1) return
      let good = this.data.good
      good.number = good.number -= 1
      this.triggerEvent('changeGoodNum',{good})
    },
    handleAddToCartInModal() {
      const product ={...this.data.good,props_text: this.data.goodSelected}
      this.closeGoodDetailModal()
      this.triggerEvent('addToCart',{product})
    },
  }
});
