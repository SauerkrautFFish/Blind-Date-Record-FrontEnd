<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">

  </el-page-header>

  <el-divider />
  <div>

    报告生成日期：{{ shareMomentStore.getShareDetail().candidateReportVO?.updateTime }}
    <el-divider />
    {{ shareMomentStore.getShareDetail().candidateReportVO?.report }}
    <el-divider />

  </div>
  <div id="main-chart" style="width: 100%; height: 500px"></div>
  <div style="width: 45%; height: auto; background-color: red; position:absolute;">

    <el-table :data="shareMomentStore.getShareDetail().blindDateRecordVO?.userRecord" style="width: 100%">
      <el-table-column fixed prop="date" sortable label="日 期" />
      <el-table-column prop="totalCnt" label="尝试约会次数" />
      <el-table-column prop="successCnt" label="成功次数" />
      <el-table-column prop="explanation" label="说 明" />
    </el-table>

  </div>
  <div style="width: 45%; height: auto; background-color: blue; margin-left:50%;">

    <el-table :data="shareMomentStore.getShareDetail().blindDateRecordVO?.candidateRecord" style="width: 100%">
      <el-table-column fixed prop="date" sortable label="日 期" />
      <el-table-column prop="totalCnt" label="尝试约会次数" />
      <el-table-column prop="successCnt" label="成功次数" />
      <el-table-column prop="explanation" label="说 明" />
    </el-table>
  </div>

</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { markRaw, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useCandidateStore } from '@/stores/candidateList'
import router from '@/router'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useShareMomentStore } from '@/stores/shareMoment'


const { shareUserId, shareUserName, shareCandidateId } = defineProps(['shareUserId', 'shareUserName', 'shareCandidateId'])

const shareMomentStore = useShareMomentStore()
const shareMomentRef = storeToRefs(shareMomentStore)
let myChart = ref<echarts.ECharts | null>()

onMounted(() => {
  shareMomentStore.getShareMomentDetailApi(shareUserId, shareCandidateId)
  // markRaw避免了很多vue3响应式导致echart图表奇怪的问题 牛 虽然不知道原理
  myChart.value = markRaw(echarts.init(document.getElementById('main-chart')))
  window.addEventListener('resize', () => {
    myChart.value?.resize()
  })

})


watch(() => shareMomentRef, (oldVal, newVal) => {
  const data = shareMomentStore.getShareDetail().blindDateRecordVO
  const shareCandidateName = data.candidateName
  const dateXAxisData = data.dateXAxisData
  const userYAxisData = data.userYAxisData
  const candidateYAxisData = data.candidateYAxisData

  const option = {
    // 通过这个color修改两条线的颜色
    color: ['#00f2f1', '#ed3f35'],
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        let xAxisLabel = params.name
        let yAxisValue = params.data
        return `X: ${xAxisLabel}<br/>Y: ${yAxisValue}%`
      }
    },
    legend: {
      // 如果series 对象有name 值，则 legend可以不用写data
      //selectedMode: false, // 点击标签不会导致折线图消失 (事实上 这里是规避了vue3绑定echart 导致点击标签报错的问题 我不知道怎么修复 所以就不让用户可以点击标签了)
      // 修改图例组件 文字颜色
      textStyle: {
        color: '#4c9bfd'
      }

    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      show: true, // 显示边框
      borderColor: '#012f4a', // 边框颜色
      containLabel: true // 包含刻度文字在内
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateXAxisData,
      axisTick: {
        show: false // 去除刻度线
      },
      axisLabel: {
        color: '#000000' // 文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false // 去除刻度线
      },
      axisLabel: {
        color: '#000000' // 文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      },
      splitLine: {
        lineStyle: {
          color: '#012f4a' // 分割线颜色
        }
      }
    },
    series: [
      {
        name: shareUserName,
        type: 'line',
        // true 可以让我们的折线显示带有弧度
        smooth: true,
        data: userYAxisData,
        label: {
          show: true, // 显示数据标签
          position: 'top', // 数据标签位置，可以是 'top', 'bottom', 'inside', 'insideTop', 'insideBottom', 'insideLeft', 'insideRight', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
          color: '#000000', // 数据标签文本颜色
          fontSize: 12, // 数据标签文本大小
          formatter: function(params: any) {
            // 自定义显示内容
            let yAxisValue = params.value // y 轴值
            return `${yAxisValue}%`
          }
        }
      },
      {
        name: shareCandidateName,
        type: 'line',
        smooth: true,
        data: candidateYAxisData,
        label: {
          show: true, // 显示数据标签
          position: 'top', // 数据标签位置，可以是 'top', 'bottom', 'inside', 'insideTop', 'insideBottom', 'insideLeft', 'insideRight', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
          color: '#000000', // 数据标签文本颜色
          fontSize: 12, // 数据标签文本大小
          formatter: function(params: any) {
            // 自定义显示内容
            let yAxisValue = params.value // y 轴值
            return `${yAxisValue}%`
          }
        }
      }
    ]
  }

  myChart.value?.setOption(option)

}, { deep: true })


const goBack = () => {
  router.back()
}


</script>

<style scoped>

</style>