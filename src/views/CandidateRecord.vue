<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ candidateName }} </span>
    </template>

    <div id="main-chart" style="width: 100%; height: 500px"></div>
    <el-button type="primary" round @click="candidateStore.addCandidateRecordDialog = true">添 加</el-button>
    <el-divider />
    <el-dialog v-model="candidateStore.addCandidateRecordDialog" title="添加记录" width="500">
      <el-form :model="addCandidateRecordForm">
        <el-form-item label="日 期">
          <el-date-picker
            v-model="addCandidateRecordForm.date"
            type="date"
            placeholder="Pick a day"
            size="large"
          />
        </el-form-item>
        <el-form-item label="总预约次数">
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
          <el-button @click="candidateStore.addCandidateRecordDialog = false">取消</el-button>
          <el-button type="primary" :loading="candidateStore.projectLoading" @click="candidateStore.setUserRecord(addCandidateRecordForm, candidateId)">
            {{
              candidateStore.projectLoading ? '提交中' : '确认'
            }}
          </el-button>
        </div>
      </template>
    </el-dialog>

  </el-page-header>

</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { useCandidateStore } from '@/stores/candidateList'
import router from '@/router'
import * as echarts from 'echarts';

const addCandidateRecordForm = reactive({
  date: '',
  totalCnt: 0,
  successCnt: 0,
  explanation: ''
})

const {candidateId} = defineProps(['candidateId'])
console.log("candidateId ts=", candidateId)
const candidateStore = useCandidateStore()
const candidateName = candidateStore.getCandidateNameById(candidateId)

onMounted(() => {
  candidateStore.getCandidateRecordApi(candidateId)
  const myChart = echarts.init(document.getElementById('main-chart'));
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
        name: "新增粉丝",
        type: "line",
        // true 可以让我们的折线显示带有弧度
        smooth: true,
        data: [123, 456]
      },
      {
        name: "新增游客",
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

  myChart.setOption(option)

  window.addEventListener("resize", function() {
    myChart.resize();
  });
})

const goBack = () => {
  router.back()
}


</script>

<style scoped>

</style>