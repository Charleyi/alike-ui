<template>
    <div class="alike-transfer">
        <div class="alike-transfer-area alike-transfer-left">
            <div class="alike-transfer-header">
                左列表 - {{getTotalLeft}}/{{transferLeft.length}}
            </div>                
            <div class="alike-transfer-section">
                <label class="alike-transfer__item" v-for="(item,index) in transferLeft" :key="index">
                    <input class="alike-transfer__item-input" type="checkbox" v-model="item.checked" />
                    <span class="alike-transfer__item-label">{{item.label}}</span>
                </label>
            </div>
        </div>
        <div class="alike-transfer-handle alike-transfer-center">
            <alike-button :disabled="getTotalRight == 0 ? true : false" @click="toTransferLeft">
                <alike-icon type="arrow-left" color="#ffffff"></alike-icon>
            </alike-button>                
            <alike-button :disabled="getTotalLeft == 0 ? true : false" @click="toTransferRight">
                <alike-icon type="arrow-right" color="#ffffff"></alike-icon>
            </alike-button>
        </div>
        <div class="alike-transfer-area alike-transfer-right">
            <div class="alike-transfer-header">
                右列表 - {{getTotalRight}}/{{transferRight.length}}
            </div>                
            <div class="alike-transfer-section">
                <label class="alike-transfer__item" v-for="(item,index) in transferRight" :key="index">
                    <input class="alike-transfer__item-input" type="checkbox" v-model="item.checked" />
                    <span class="alike-transfer__item-label" :class="[item.checked ? 'alike-transfer__item-label--active':'']">{{item.label}}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * alike-movable-view 
 * @describe 数据穿梭框
 * @website http://alike.galloping.xyz
 * @property transfers {Array} 穿梭的数据
 * @event change {Function} 更新穿梭数据时触发，返回最新数据{Array}
 * 
 * transfers 数据格式分析
 * @property id {Number} 唯一标识符
 * @property label {String} 标签名
 * @property enabled {Boolean} 当前数据项是否被穿梭到右边
 * @property checked {Boolean} 当前数据项是否被选中
 * @property disabled {Boolean} 当前数据项是否被警用
 */
export default {
    name:"alike-transfer",
    props:{
        transfers:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return {
            transferLeft:[],
            transferRight:[]
        }
    },
    mounted(){
        this.initTransfer();
    },
    methods:{
        initTransfer(){
            this.transfers.forEach((item,index)=>{
                if(item.enabled){// 分组判断哪些是启用的
                    this.transferRight.push(item);
                }else{
                    this.transferLeft.push(item);
                }
            })
        },
        toTransferLeft(){
            // 这里不能使用下标删除否则会影响后续的下标顺序，所以先保留未被选中的项
            let originals = this.transferRight.filter((item)=>{
                return !item.checked;
            })

            this.transferRight.forEach((item,index)=>{
                if(item.checked){
                    this.transferLeft.push({
                        ...item,
                        checked:false,
                        enabled:false
                    });
                }
            })

            this.transferRight = originals;
            this.toTransferDispatch();
        },
        toTransferRight(){
            let originals = this.transferLeft.filter((item)=>{
                return !item.checked;
            })

            this.transferLeft.forEach((item,index)=>{
                if(item.checked){
                    this.transferRight.push({
                        ...item,
                        checked:false,
                        enabled:true
                    });
                }
            })

            this.transferLeft = originals;
            this.toTransferDispatch();
        },
        toTransferDispatch(){
            let details = [...this.transferLeft,...this.transferRight];
            details.sort((a,b)=>{
                return a.id - b.id
            });

            this.$emit('change',details);
        }
    },
    computed:{
        getTotalLeft(){
            let count = 0;
            this.transferLeft.forEach((item,index)=>{
                if(item.checked){
                    count++;
                }
            })
            return count;
        },
        getTotalRight(){
            let count = 0;
            this.transferRight.forEach((item,index)=>{
                if(item.checked){
                    count++;
                }
            })
            return count;
        }
    }
}
</script>

<style lang="scss" scoped>
.alike-transfer{
    width:600px;
    display:flex;

    .alike-transfer-center{
        width:100px;margin:0 20px;display:flex;justify-content:space-between;align-items:center;
    }

    .alike-transfer-area{
        flex:1;
        border-radius:5px;
        border: 1px solid rgba(0,0,0,.125);
    }
    .alike-transfer-header{
        padding:10px 15px;
        background-color: rgba(0,0,0,.03);
        border-bottom: 1px solid rgba(0,0,0,.125);
    }

    .alike-transfer__item{
        display:flex;
        align-items:center;
        padding:10px;
        cursor: pointer;

        &:hover{
            background-color:#f8f8f8;
        }

        .alike-transfer__item-input{
            margin-right:5px;
            cursor: pointer;
            width:20px;
            height:20px;
        }

        .alike-transfer__item-label{
            font-size:15px;color:#333333;user-select:none;
        }
        .alike-transfer__item-label--active{
            color:$alike-color-primary;
        }
    }
}
</style>