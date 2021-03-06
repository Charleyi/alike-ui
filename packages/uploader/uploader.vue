<template>
	<div class="alike-uploader" :class="[file ? 'alike-uploader--active':'alike-uploader--default']" @click="chooseFile" v-drag-upload>
        <div class="alike-uploader__preview" v-if="file">
            <img class="alike-uploader__preview-image" :src="file" />
            <div class="alike-uploader__preview-mask">
                <span class="alike-uploader__preview-icon" @click.stop="deleteFile">
                    <alike-icon type="delete" size="30px" color="#ffffff"></alike-icon>
                </span>
            </div>
        </div>
        <alike-icon type="plus" size="30px" color="#999999" v-else></alike-icon>

        <input class="alike-uploader__input" ref="uploaderFinder" type="file" @change="changeFile" />
    </div>
</template>

<script>
/**
 * alive-uploader
 * @property file {String} 图片地址
 * @property enableDrag {Boolean} 是否启用拖动上传文件
 * @property autoVerify {Boolean} 是否开启文件自动验证
 * @property size {Boolean} 支持上传文件的大小
 * @property types {Array} 支持上传文件的格式
 * @event change {Function} 上传图片时触发
 * @event delete {Function} 删除图片时触发
 */

export default {
    name: "alike-uploader",
    props:{
        file:{
            type:String,
            default:""
        },
        enableDrag:{
            type:Boolean,
            default:false
        },
        autoVerify:{
            type:Boolean,
            default:true
        },
        size:{
            type:Number,
            default:2097152     //  2md = 2 * 1024 * 1024
        },
        types:{
            type:Array,
            default:()=>["image/png","image/jpg","image/jpeg","image/gif"]
        }
    },
	methods: {
		chooseFile(){
            // 是否已经有上传的文件
			if (this.file || this.$refs.uploaderFinder.value) {
				return false;
            }

			this.$refs.uploaderFinder.click();
		},
		changeFile(e){
            this.verifyFile(e.target.files[0]);
		},
        verifyFile(file){
            let tempFilePath = window.URL.createObjectURL(file);
            this.$emit('change',file); 

            if(this.autoVerify){
                if(file.size > this.size){
                    this.$emit('fail',{msg:`图片上传大小不得超过${this.size}字节`});
                    return false;
                }

                if(!this.types.includes(file.type)){
                    this.$emit('fail',{msg:`图片类型仅支持${this.types.join(',')}`});
                    return false;
                }
            }

            this.$emit('success',{file:file,filePath:tempFilePath});
        },
        deleteFile(){
            // 解决单文件上传模式被删除后无法再次触发上传控件的问题
            if(this.$refs.uploaderFinder.value){
                this.$refs.uploaderFinder.value = null;
            }

            this.$emit('delete');
		}
	},
    directives:{
        dragUpload(el,binding,vnode){
            const vm = vnode.context;

            // 判断是否支持上传器拖放事件
            if(!vm.enableDrag){
                return false;
            }

            // 针对文档         
            // document.ondragenter = function(e){
            //     e.preventDefault();
            //     e.stopPropagation();
            // }           
            // document.ondragover = function(e){
            //     e.preventDefault();
            //     e.stopPropagation();
            // }
            // document.ondragleave = function(e){
            //     e.preventDefault();
            //     e.stopPropagation();
            // }  
            // document.ondrop = function(e){
            //     e.preventDefault();
            //     e.stopPropagation();
            //     console.log('drop...')
            //     vm.verifyFile(e.dataTransfer.files[0]);
            // } 

            // 指定元素
            el.ondragenter = function(e){
                e.preventDefault();
                e.stopPropagation();
            }           
            el.ondragover = function(e){
                e.preventDefault();
                e.stopPropagation();
            }
            el.ondragleave = function(e){
                e.preventDefault();
                e.stopPropagation();
            }  
            el.ondrop = function(e){
                e.preventDefault();
                e.stopPropagation();

                vm.verifyFile(e.dataTransfer.files[0]);
            }  
        }
    }
};
</script>

<style lang="scss" scoped>
.alike-uploader{position:relative;overflow:hidden;width:178px;height:178px;border:1px dashed #d9d9d9;border-radius:6px;color:#8c939d;text-align:center;font-size:28px;line-height:178px;cursor:pointer;}
.alike-uploader--default:hover{border-color:$alike-color-primary;}
.alike-uploader--active{cursor:auto;}
.alike-uploader__preview{position:relative;width:100%;height:100%;border-radius:6px;}
.alike-uploader__preview-image{width:100%;height:100%;border-radius:6px;}
.alike-uploader__preview-mask{position:absolute;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.7);opacity:0;transition:opacity .5s ease;}
.alike-uploader__preview:hover .alike-uploader__preview-mask{opacity:1;}
.alike-uploader__preview-icon{cursor:pointer;}
.alike-uploader__input{display:none;}
</style>