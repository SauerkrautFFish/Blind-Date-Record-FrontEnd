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
      path: '/myProject/candidateDetail/:candidateId',
      name: 'detailPage',
      component: () => import("@/views/CandidateDetail.vue"),
      props: true
    },
  ]
})

export default router
