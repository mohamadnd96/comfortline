import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import HomeView from "../views/HomeView.vue";
const store = useStore();
const routes = [

  {
    path: "/home/:question?",
    name: "home",                                                     // Dashboard
    component: HomeView,
  },
  // {
  //   path: "/home/details/:q",
  //   name: "details",
  // component: () => import("../components/Details.vue"),
  // },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../components/Signup.vue"),
  },
  {
    path: "/backup",
    name: "backup",
    component: () => import("../components/admin/Backups.vue"),
  },
  {
    path: "/buildings",
    name: "buildings",
    component: () => import("../components/om/Buildings.vue"),
  },
  {
    path: "/buildings/addmanager/:id?",                             // if ?, this route will read from the URL (not static)
    name: "addmanager",
    props: true,
    component: () => import("../components/om/AddManager.vue"),
  },
  {
    path: "/buildings/edit/:id?",
    name: "editbuilding",
    props: true,
    component: () => import("../components/om/EditBuilding.vue"),
  },
  {
    path: "/buildings/qrcodes/:id?",
    name: "qrcodes",
    props: true,
    component: () => import("../components/om/QrCodes.vue"),
  },
  {
    path: "/buildingsadmin",
    name: "buildingsadmin",
    component: () => import("../components/admin/AdminBuildings.vue"),
  },
  {
    path: "/buildingsadmin/add",
    name: "addbuilding",
    component: () => import("../components/admin/AddBuilding.vue"),
  },

  {
    path: "/contactus",
    name: "contactus",
    component: () => import("../components/Contact.vue"),
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("../components/om/Notifications.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../components/Signout.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
