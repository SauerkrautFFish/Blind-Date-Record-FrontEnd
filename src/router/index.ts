import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'introPage',
      component: () => import("@/views/IntroPage.vue")
    },
    {
      path: '/myProject',
      name: 'myBlindDateProject',
      component: () => import("@/views/MyBlindDateProject.vue"),

    },
    {
      path: '/shareMoments',
      name: 'blindDateMoments',
      component: () => import("@/views/BlindDateMoments.vue")
    },
    {
      path: '/about',
      name: 'aboutUs',
      component: () => import("@/views/AboutUs.vue")
    },
    {
      path: '/myProject/candidateRecord/:candidateId',
      name: 'detailPage',
      component: () => import("@/views/CandidateRecord.vue"),
      props: true
    },
    {
      path: '/myProject/candidateReport/:candidateId',
      name: 'reportPage',
      component: () => import("@/views/CandidateReport.vue"),
      props: true
    },
    {
      path: '/shareMoments/detail/:shareUserId/:shareUserName/:shareCandidateId',
      name: 'sharePage',
      component: () => import("@/views/MomentDetailPage.vue"),
      props: true
    },
  ]
})

export default router
