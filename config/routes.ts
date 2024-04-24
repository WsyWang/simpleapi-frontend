export default [
  {path: '/', name: '接口中心', icon: 'smile', component: './Index/Index'},
  {path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo/Index', hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
    ],
  },
  {name: '个人中心', path: '/center', hideInMenu: true, component: './User/Personal'},
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {path: '/admin/interface_info',name: '接口管理', component: './Admin/InterfaceInfo'},
      {path: '/admin/interface_info_quota', name: '额度管理', component: './Admin/Quota'},
      {path: '/admin', redirect: '/admin/interface_info'},
    ],
  },
  {path: '*', layout: false, component: './404'},
];
