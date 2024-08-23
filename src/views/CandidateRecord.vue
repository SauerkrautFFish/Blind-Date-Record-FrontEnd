<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ candidateName }} </span>
    </template>

    <div id="main-chart" style="width: 100%; height: 500px"></div>
    <el-dialog v-model="candidateStore.addCandidateRecordDialog" @close="resetCandidateRecordForm" title="添加记录" width="500">
      <el-form :model="addCandidateRecordForm">
        <el-form-item label="日 期">
          <el-date-picker
            v-model="addCandidateRecordForm.date"
            type="date"
            placeholder="选择日期"
            size="large"
          />
        </el-form-item>
        <el-form-item label="尝试约会次数">
          <el-input-number
            v-model="addCandidateRecordForm.totalCnt"
            :min="1"
            controls-position="right"
            size="large"
          />
        </el-form-item>
        <el-form-item label="成功次数">
          <el-input-number
            v-model="addCandidateRecordForm.successCnt"
            :min="0"
            :max="addCandidateRecordForm.totalCnt"
            controls-position="right"
            size="large"
          />
        </el-form-item>
        <el-form-item label="说 明">
          <el-input
            v-model="addCandidateRecordForm.explanation"
            maxlength="200"

            placeholder="请输入"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetCandidateRecordForm">取消</el-button>
          <el-button type="primary" :loading="candidateStore.projectLoading" @click="candidateStore.setRecord(addCandidateRecordForm, candidateId)">
            {{
              candidateStore.projectLoading ? '提交中' : '确认'
            }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div style="width: 45%; height: auto; background-color: red; position:absolute;">
      <el-button class="mt-4" type="primary" style="width: 100%" @click="identifyUserAndCandidate(true)">添加记录</el-button>
      <el-table :data="candidateStore.getCandidateRecordByCandidateId(candidateId).userRecord" style="width: 100%">
        <el-table-column fixed prop="date" sortable label="日 期"/>
        <el-table-column prop="totalCnt" label="尝试约会次数"/>
        <el-table-column prop="successCnt" label="成功次数"/>
        <el-table-column prop="explanation" label="说 明"/>
        <el-table-column fixed="right" label="操 作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="modifyCandidateRecord(scope, true)" >
              修改
            </el-button>
            <el-button link type="danger" size="small" @click="candidateStore.deleteOneRecord(candidateId, scope.$index, true)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div style="width: 45%; height: auto; background-color: blue; margin-left:50%;">
      <el-button class="mt-4" type="primary" style="width: 100%" @click="identifyUserAndCandidate(false)">添加记录</el-button>
      <el-table :data="candidateStore.getCandidateRecordByCandidateId(candidateId).candidateRecord" style="width: 100%">
        <el-table-column fixed prop="date" sortable label="日 期"/>
        <el-table-column prop="totalCnt" label="尝试约会次数"/>
        <el-table-column prop="successCnt" label="成功次数"/>
        <el-table-column prop="explanation" label="说 明"/>
        <el-table-column fixed="right" label="操 作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="modifyCandidateRecord(scope, false)" >
              修改
            </el-button>
            <el-button link type="danger" size="small" @click="candidateStore.deleteOneRecord(candidateId, scope.$index, false)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-page-header>

</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useCandidateStore } from '@/stores/candidateList'
import router from '@/router'
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia'

function deleteRow(val:any) {

}

const addCandidateRecordForm = reactive({
  recordIndex: -1,
  date: '',
  totalCnt: 0,
  successCnt: 0,
  explanation: '',
  // 判断下是否是用户记录
  isUserRecord: false
})

const {candidateId} = defineProps(['candidateId'])
const candidateStore = useCandidateStore()
const candidateName = candidateStore.getCandidateNameById(candidateId)
const {candidateRecords} = storeToRefs(candidateStore)
function modifyCandidateRecord(scope:any, isUserRecord:any) {
  addCandidateRecordForm.recordIndex = scope.$index
  addCandidateRecordForm.date = scope.row.date
  addCandidateRecordForm.totalCnt = scope.row.totalCnt
  addCandidateRecordForm.successCnt = scope.row.successCnt
  addCandidateRecordForm.explanation = scope.row.explanation
  identifyUserAndCandidate(isUserRecord)
}

function identifyUserAndCandidate(isUserRecord:any) {
  addCandidateRecordForm.isUserRecord = isUserRecord
  candidateStore.setAddCandidateRecordDialog(true)
}

function resetCandidateRecordForm() {
  candidateStore.setAddCandidateRecordDialog(false)
  addCandidateRecordForm.recordIndex = -1
  addCandidateRecordForm.date = ''
  addCandidateRecordForm.totalCnt = 0
  addCandidateRecordForm.successCnt = 0
  addCandidateRecordForm.explanation = ''
}


watch(() => candidateRecords, (oldVal, newVal) => {

  const a = candidateRecords.value[candidateId].userRecord
  for(let i = 0; i < a.length; i++) {
    console.log(a[i].totalCnt)
  }
  // 获取两个record的date去重+排序

  // 把数据往里面一个个塞进去 如果为空则塞前面哪个值


}, {deep: true})

let myChart = ref<echarts.ECharts | null>();

onMounted(() => {
  candidateStore.getCandidateRecordApi(candidateId)
  myChart.value = echarts.init(document.getElementById('main-chart'));
// 绘制图表
  const option = {
    // 通过这个color修改两条线的颜色
    color: ["#00f2f1", "#ed3f35"],
    tooltip: {
      trigger: "axis"
    },
    legend: {
      // 如果series 对象有name 值，则 legend可以不用写data
      // 修改图例组件 文字颜色
      textStyle: {
        color: "#4c9bfd"
      },
      // 这个10% 必须加引号
      right: "10%"
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      show: true, // 显示边框
      borderColor: "#012f4a", // 边框颜色
      containLabel: true // 包含刻度文字在内
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ['1', '2'],
      axisTick: {
        show: false // 去除刻度线
      },
      axisLabel: {
        color: "#4c9bfd" // 文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      }
    },
    yAxis: {
      type: "value",
      axisTick: {
        show: false // 去除刻度线
      },
      axisLabel: {
        color: "#4c9bfd" // 文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      },
      splitLine: {
        lineStyle: {
          color: "#012f4a" // 分割线颜色
        }
      }
    },
    series: [
      {
        name: "你",
        type: "line",
        // true 可以让我们的折线显示带有弧度
        smooth: true,
        data: [1,2]
      },
      {
        name: "他/她",
        type: "line",
        smooth: true,
        data: [132, 1222],
        label: {
          show: true, // 显示数据标签
          position: 'top', // 数据标签位置，可以是 'top', 'bottom', 'inside', 'insideTop', 'insideBottom', 'insideLeft', 'insideRight', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
          color: '#FF5733', // 数据标签文本颜色
          fontSize: 12, // 数据标签文本大小

        },
      }
    ]
  };

  myChart.value.setOption(option)

  window.addEventListener("resize", function() {
    myChart.value?.resize();
  });
})

const goBack = () => {
  router.back()
}


</script>

<style scoped>

</style>