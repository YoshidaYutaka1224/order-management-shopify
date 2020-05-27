import {
    Home,
    File,
    Headphones,
    Users,
    Navigation,
    Tag,
    ShoppingBag,
    Settings,
    List
} from 'react-feather';

export const MENUITEMS = [
    {
        title: 'DASHBOARD_SIDE', icon: Home, type: 'link', path: '/dashboard', active: true, isShow: true, isAdmin : false
    },
    {
        title: 'USER_SIDE', icon: Users, type: 'link', path: '/user', active: true, isShow: false, isAdmin : true
    },
    {
        title: 'TAG_SIDE', icon: Tag, type: 'link', path: '/tag', active: true, isShow: false, isAdmin : false
    },
    {
        title: 'ORDER_SIDE', icon: ShoppingBag, type: 'link', path: '/order', active: true, isShow: true, isAdmin : false
    },
    {
        title: 'SETTING_SIDE', icon: Settings, type: 'link', path: '/setting', active: true, isShow: true, isAdmin : false
    },
    {
        title: 'MYLOGS_SIDE', icon: List, type: 'link', path: '/mylog', active: true, isShow: true, isAdmin : false
    },
    // {
    //     title: 'Dashboard', icon: Home, type: 'sub', badgeType: 'primary', active: false, children: [
    //         { path: '/dashboard/default', title: 'Default', type: 'link' },
    //         { path: '/dashboard/ecommerce', title: 'E-Commerce', type: 'link' },
    //         { path: '/dashboard/university', title: 'University', type: 'link' },
    //         { path: '/dashboard/crypto', title: 'Crypto', type: 'link' },
    //         { path: '/dashboard/project', title: 'Project', type: 'link' }
    //     ]
    // },
    // {
    //     title: 'Support Ticket', icon: Headphones, type: 'link', path: '/support-ticket/supportTicket', active: false
    // },
    // {
    //     path: '/sample/samplepage', title: 'Sample Page', icon: File, type: 'link', active: false
    // },
]

