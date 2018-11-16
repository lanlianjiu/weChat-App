var app = getApp();
Page({
    data: {
        toView: 'inToViewFind',
        scrollHeight: 500,
        goodsCatery: [{
                title: '核心组件'
            },
            {
                title: '布局组件'
            },
            {
                title: '数据录入',
            },
        ],
        components: [{
                title: '核心组件',
                children: [{
                        title: 'AnimationGroup',
                        remark: '动画组',
                        url: '/pages/animation-group/index',
                    },
                    {
                        title: 'Button',
                        remark: '按钮',
                        url: '/pages/button/index',
                    },
                    {
                        title: 'Icon',
                        remark: '图标',
                        url: '/pages/icon/index',
                    },
                ],
            },
            {
                title: '布局组件',
                children: [{
                        title: 'Grid',
                        remark: '宫格',
                        url: '/pages/grid/index',
                    },
                    {
                        title: 'Layout',
                        remark: '栅格布局',
                        url: '/pages/layout/index',
                    },
                    {
                        title: 'WhiteSpace',
                        remark: '上下留白',
                        url: '/pages/white-space/index',
                    },
                    {
                        title: 'WingBlank',
                        remark: '两翼留白',
                        url: '/pages/wing-blank/index',
                    },
                ],
            },
            {
                title: '数据录入',
                children: [{
                        title: 'Calendar',
                        remark: '日历',
                        url: '/pages/calendar/index',
                    },
                    {
                        title: 'Checkbox',
                        remark: '复选框',
                        url: '/pages/checkbox/index',
                    },
                    {
                        title: 'InputNumber',
                        remark: '数字输入框',
                        url: '/pages/input-number/index',
                    },
                    {
                        title: 'Radio',
                        remark: '单选框',
                        url: '/pages/radio/index',
                    },
                    {
                        title: 'Rater',
                        remark: '评分',
                        url: '/pages/rater/index',
                    },
                    {
                        title: 'SearchBar',
                        remark: '搜索栏',
                        url: '/pages/search-bar/index',
                    },
                    {
                        title: 'Select',
                        remark: '下拉框',
                        url: '/pages/select/index',
                    },
                    {
                        title: 'Switch',
                        remark: '滑动开关',
                        url: '/pages/switch/index',
                    },
                    {
                        title: 'Textarea',
                        remark: '多行输入框',
                        url: '/pages/textarea/index',
                    },
                    {
                        title: 'Upload',
                        remark: '上传',
                        url: '/pages/upload/index',
                    },
                ],
            },
        ],
    },
    onShow: function () {

        this.setData({
            scrollHeight: app.globalData.windowHeight - 300
        })
    },
    scrollToview: function (e) {

        var _id = e.target.dataset.id;
        this.setData({
            toView: 'IntoView' + _id
        })
    }

})