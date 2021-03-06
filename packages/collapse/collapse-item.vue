<template>
    <div class="alike-collapse-item">
        <div class="alike-collapse-item__header" @click="handleItemClick">
            <div class="alike-collapse-item__header-title">{{title}}</div>
            <alike-icon type="arrow-right" size="16px" color="#999999"></alike-icon>
        </div>
        <div ref="sectionFinder" class="alike-collapse-item__section" :class="[isOpen ? 'alike-collapse-item__section--show':'alike-collapse-item__section--hide']" :style="{transition:transition,height:onceTotal || isOpen ? sectionHeight+'px' : '0px'}">
            <div class="alike-collapse-item__section-inner">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * alike-collapse-item 
 * @describe 折叠子面板
 * @website http://alike.galloping.xyz
 * @property title {String} 子面板的标题
 * @property name {String} 子面板的唯一标记符
 */
export default {
    name:"alike-collapse-item",
    inject: ['collapse'],
    props:{
        title:{
            type:String,
            default:""
        },
        name:{
            type:String,
            default:""
        }
    },
    data(){
        return {
            onceTotal:true,       
            sectionHeight:null,
            transition:"height 0s ease",
            isOpen:false,
            inName:""
        }
    },
    created(){
        // 初始唯一标识符
        this.inName = this.name ? this.name : this.collapse.childrens.length;
        this.collapse.childrens.push(this);
        
        // 初始激活选中项
        if(Array.isArray(this.collapse.active)){
            if(this.collapse.active.includes(this.inName)){
                this.isOpen = true;
            }
        }else if(this.collapse.active){
            if(this.collapse.active == this.inName){
                this.isOpen = true;
            }
        }
    },
    mounted(){
        /**
         * 由于需要获取到每个子元素内容区域的真实高度，所以首次初始化时需要先获取，通过双开关的原理避免一开始isActive为false元素高度值为0的情况。
         * 由于计算属性中无法设置data值，所以直接在style上判断
         */
        this.sectionHeight = this.$refs.sectionFinder.getBoundingClientRect().height;
        this.onceTotal = false;
        this.transition = "height 300ms ease";
    },
    methods:{
        handleItemClick(){
            this.isOpen = !this.isOpen;
            // 排他思想
            if(this.collapse.accordion == true){
                this.collapse.childrens.forEach(vm => {
                    if (vm !== this) {
                        vm.isOpen = false;
                    }
                })
            }
            // 触发父级事件
            this.collapse.itemChange && this.collapse.itemChange();
            // 强制更新父级数据
            this.$forceUpdate();
        }
    }
}
</script>

<style scoped>
.alike-collapse-item{border:1px solid #e8e8e8;border-radius:6px;cursor:pointer;}
.alike-collapse-item__header{display:flex;box-sizing:border-box;padding:10px;height:40px;background-color:#f8f8f8;align-items:center;}
.alike-collapse-item__header-title{flex:1;}
.alike-collapse-item__section{position:relative;overflow:hidden;}
.alike-collapse-item__section--show{border-top:1px solid #e8e8e8;}
.alike-collapse-item__section--hide{border-top:1px solid transparent;}
.alike-collapse-item__section-inner{padding:15px;}
</style>